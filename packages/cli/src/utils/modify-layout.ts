import fs from "fs/promises";

const IMPORT_STATEMENT_REGEX = /^import[\s\S]*?;\s*$/gm;

// Devtools import statements
const DEVTOOLS_STYLE_IMPORT = 'import "@previewcn/devtools/styles.css";';
const DEVTOOLS_COMPONENT_IMPORT =
  'import { PreviewcnDevtools } from "@previewcn/devtools";';
const DEVTOOLS_COMPONENT =
  '{process.env.NODE_ENV === "development" && <PreviewcnDevtools />}';

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
