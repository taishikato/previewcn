import fs from "fs/promises";

const IMPORT_STATEMENT_REGEX = /^import[\s\S]*?;\s*$/gm;
const LEGACY_DEVTOOLS_IMPORT_REGEX =
  /^import[\s\S]*?@previewcn\/devtools(?:\/styles\.css)?["'][\s\S]*?;\s*$/gm;
const DEVTOOLS_IMPORT_REGEX =
  /import\s+\{[^}]*\bPreviewcnDevtools\b[^}]*\}\s+from\s+["'][^"']+["'];?/;

// Default import path for shadcn-style components
const DEFAULT_IMPORT_PATH = "@/components/ui/previewcn";

// Devtools component JSX
const DEVTOOLS_COMPONENT =
  '{process.env.NODE_ENV === "development" && <PreviewcnDevtools />}';

function getDevtoolsImport(importPath: string): string {
  return `import { PreviewcnDevtools } from "${importPath}";`;
}

function stripLegacyDevtoolsImports(content: string): string {
  const cleaned = content.replace(LEGACY_DEVTOOLS_IMPORT_REGEX, "");
  return cleaned.replace(/\n{3,}/g, "\n\n");
}

function hasDevtoolsImport(content: string): boolean {
  return DEVTOOLS_IMPORT_REGEX.test(content);
}

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

export async function addDevtoolsToLayout(
  layoutPath: string,
  importPath: string = DEFAULT_IMPORT_PATH
): Promise<void> {
  const content = await fs.readFile(layoutPath, "utf-8");
  const cleanedContent = stripLegacyDevtoolsImports(content);

  const importsToAdd: string[] = [];
  if (!hasDevtoolsImport(cleanedContent)) {
    importsToAdd.push(getDevtoolsImport(importPath));
  }

  let newContent = insertAfterLastImport(cleanedContent, importsToAdd);

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
