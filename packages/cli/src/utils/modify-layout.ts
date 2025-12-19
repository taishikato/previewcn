import fs from "fs/promises";
import path from "path";

import { THEME_RECEIVER_FILENAME } from "../templates/theme-receiver";

function getImportPath(layoutPath: string, componentsDir: string): string {
  // Get relative path from layout directory to components directory
  const layoutDir = path.dirname(layoutPath);
  const relativePath = path.relative(layoutDir, componentsDir);

  // Remove .tsx extension for import
  const fileNameWithoutExt = THEME_RECEIVER_FILENAME.replace(/\.tsx$/, "");

  // Convert to proper import path
  const importPath = path.posix.join(
    relativePath.split(path.sep).join(path.posix.sep),
    fileNameWithoutExt
  );

  // Ensure it starts with ./ for relative imports
  return importPath.startsWith(".") ? importPath : `./${importPath}`;
}

function buildImportStatement(importPath: string): string {
  return `import { PreviewCNThemeReceiver } from "${importPath}";`;
}

const RECEIVER_COMPONENT =
  '{process.env.NODE_ENV === "development" && <PreviewCNThemeReceiver />}';

export async function addThemeReceiverToLayout(
  layoutPath: string,
  componentsDir: string
): Promise<void> {
  const content = await fs.readFile(layoutPath, "utf-8");

  // Check if already added (check for both old and new patterns)
  if (
    content.includes("@previewcn/receiver") ||
    content.includes("PreviewCNThemeReceiver") ||
    content.includes("ThemeReceiver")
  ) {
    return; // Already configured
  }

  const importPath = getImportPath(layoutPath, componentsDir);
  const importStatement = buildImportStatement(importPath);

  let newContent = content;

  // Add import at the top (after existing imports)
  const importRegex = /^import[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm;
  const matches = [...newContent.matchAll(importRegex)];
  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    const insertIndex = lastMatch.index! + lastMatch[0].length;
    newContent =
      newContent.slice(0, insertIndex) +
      "\n" +
      importStatement +
      newContent.slice(insertIndex);
  } else {
    // No imports found, add at top
    newContent = importStatement + "\n\n" + newContent;
  }

  // Add component inside <body> tag
  const bodyMatch = newContent.match(/<body[^>]*>/);
  if (bodyMatch) {
    const bodyEndIndex = bodyMatch.index! + bodyMatch[0].length;
    newContent =
      newContent.slice(0, bodyEndIndex) +
      "\n        " +
      RECEIVER_COMPONENT +
      newContent.slice(bodyEndIndex);
  }

  await fs.writeFile(layoutPath, newContent, "utf-8");
}

export async function checkThemeReceiverInLayout(
  layoutPath: string
): Promise<boolean> {
  try {
    const content = await fs.readFile(layoutPath, "utf-8");
    return (
      content.includes("PreviewCNThemeReceiver") ||
      content.includes("ThemeReceiver") ||
      content.includes("@previewcn/receiver") ||
      content.includes("previewcn-theme-receiver")
    );
  } catch {
    return false;
  }
}

export async function checkReceiverFileExists(cwd: string): Promise<boolean> {
  const candidates = [
    path.join(cwd, "components", THEME_RECEIVER_FILENAME),
    path.join(cwd, "src", "components", THEME_RECEIVER_FILENAME),
    path.join(cwd, "app", "components", THEME_RECEIVER_FILENAME),
  ];

  for (const filePath of candidates) {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      // File doesn't exist, continue
    }
  }

  return false;
}
