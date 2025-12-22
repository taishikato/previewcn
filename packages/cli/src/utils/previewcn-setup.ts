import { findAppLayout } from "./detect-project";
import {
  checkReceiverFileExists,
  checkThemeReceiverInLayout,
} from "./modify-layout";

/**
 * Returns true if PreviewCN appears to be initialized in the current project:
 * - receiver file exists
 * - receiver is referenced in app layout
 */
export async function isPreviewcnInitialized(cwd: string): Promise<boolean> {
  const receiverExists = await checkReceiverFileExists(cwd);
  if (!receiverExists) return false;

  const layoutPath = await findAppLayout(cwd);
  if (!layoutPath) return false;

  return await checkThemeReceiverInLayout(layoutPath);
}
