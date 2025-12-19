import fs from "fs/promises";

const IMPORT_STATEMENT = 'import { ThemeReceiver } from "@previewcn/receiver";';
const RECEIVER_COMPONENT =
  '{process.env.NODE_ENV === "development" && <ThemeReceiver />}';

export async function addThemeReceiverToLayout(
  layoutPath: string
): Promise<void> {
  const content = await fs.readFile(layoutPath, "utf-8");

  // Check if already added
  if (
    content.includes("@previewcn/receiver") ||
    content.includes("ThemeReceiver")
  ) {
    return; // Already configured
  }

  let newContent = content;

  // Add import at the top (after existing imports)
  // This regex handles multi-line imports like: import { Foo, Bar } from "pkg";
  const importRegex = /^import[\s\S]*?from\s*['"][^'"]+['"];?\s*$/gm;
  const matches = [...newContent.matchAll(importRegex)];
  if (matches.length > 0) {
    const lastMatch = matches[matches.length - 1];
    const insertIndex = lastMatch.index! + lastMatch[0].length;
    newContent =
      newContent.slice(0, insertIndex) +
      "\n" +
      IMPORT_STATEMENT +
      newContent.slice(insertIndex);
  } else {
    // No imports found, add at top
    newContent = IMPORT_STATEMENT + "\n\n" + newContent;
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
      content.includes("ThemeReceiver") ||
      content.includes("@previewcn/receiver")
    );
  } catch {
    return false;
  }
}
