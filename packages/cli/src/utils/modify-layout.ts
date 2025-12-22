import fs from "fs/promises";
import path from "path";

import { THEME_RECEIVER_FILENAME } from "../templates/theme-receiver";

const IMPORT_STATEMENT_REGEX = /^import[\s\S]*?;\s*$/gm;

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

// Devtools import statements
const DEVTOOLS_STYLE_IMPORT = 'import "@previewcn/devtools/styles.css";';
const DEVTOOLS_COMPONENT_IMPORT =
  'import { PreviewcnDevtools } from "@previewcn/devtools";';
const DEVTOOLS_COMPONENT =
  '{process.env.NODE_ENV === "development" && <PreviewcnDevtools />}';

const RECEIVER_COMPONENT =
  '{process.env.NODE_ENV === "development" && <PreviewCNThemeReceiver />}';

function insertAfterLastImport(content: string, lines: string[]): string {
  if (lines.length === 0) return content;

  const insertText = `\n${lines.join("\n")}`;
  const matches = [...content.matchAll(IMPORT_STATEMENT_REGEX)];
  if (matches.length === 0) {
    return `${lines.join("\n")}\n\n${content}`;
  }

  const lastMatch = matches[matches.length - 1];
  const insertIndex = lastMatch.index! + lastMatch[0].length;
  return (
    content.slice(0, insertIndex) + insertText + content.slice(insertIndex)
  );
}

function insertAfterBodyOpen(content: string, jsx: string): string {
  const bodyMatch = content.match(/<body[^>]*>/);
  if (!bodyMatch) return content;

  const bodyEndIndex = bodyMatch.index! + bodyMatch[0].length;
  return (
    content.slice(0, bodyEndIndex) +
    "\n        " +
    jsx +
    content.slice(bodyEndIndex)
  );
}

export async function addThemeReceiverToLayout(
  layoutPath: string,
  componentsDir: string
): Promise<void> {
  const content = await fs.readFile(layoutPath, "utf-8");

  // Check if already added
  if (content.includes("PreviewCNThemeReceiver")) {
    return;
  }

  const importPath = getImportPath(layoutPath, componentsDir);
  const importStatement = buildImportStatement(importPath);

  let newContent = insertAfterLastImport(content, [importStatement]);
  newContent = insertAfterBodyOpen(newContent, RECEIVER_COMPONENT);

  await fs.writeFile(layoutPath, newContent, "utf-8");
}

export async function checkThemeReceiverInLayout(
  layoutPath: string
): Promise<boolean> {
  try {
    const content = await fs.readFile(layoutPath, "utf-8");

    return content.includes("PreviewCNThemeReceiver");
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

export async function addDevtoolsToLayout(layoutPath: string): Promise<void> {
  const content = await fs.readFile(layoutPath, "utf-8");

  const importsToAdd: string[] = [];
  if (!content.includes("@previewcn/devtools/styles.css")) {
    importsToAdd.push(DEVTOOLS_STYLE_IMPORT);
  }
  if (!content.includes("PreviewcnDevtools")) {
    importsToAdd.push(DEVTOOLS_COMPONENT_IMPORT);
  }

  let newContent = insertAfterLastImport(content, importsToAdd);

  // Add component inside <body> tag (only if not present)
  if (!newContent.includes("<PreviewcnDevtools")) {
    newContent = insertAfterBodyOpen(newContent, DEVTOOLS_COMPONENT);
  }

  await fs.writeFile(layoutPath, newContent, "utf-8");
}

export async function checkDevtoolsInLayout(
  layoutPath: string
): Promise<boolean> {
  try {
    const content = await fs.readFile(layoutPath, "utf-8");
    return content.includes("PreviewcnDevtools");
  } catch {
    return false;
  }
}
