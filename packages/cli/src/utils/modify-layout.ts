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
  const importMatch = newContent.match(/^(import .+\n)+/m);
  if (importMatch) {
    const lastImportIndex = importMatch.index! + importMatch[0].length;
    newContent =
      newContent.slice(0, lastImportIndex) +
      IMPORT_STATEMENT +
      "\n" +
      newContent.slice(lastImportIndex);
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
