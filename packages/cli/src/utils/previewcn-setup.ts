import { findAppLayout } from "./detect-project";
import { hasDevtoolsPackage } from "./devtools-package";
import { checkDevtoolsInLayout } from "./modify-layout";

/**
 * Returns true if PreviewCN devtools appears to be initialized in the current project:
 * - @previewcn/devtools is in package.json (devDependencies)
 * - PreviewcnDevtools is referenced in app layout
 */
export async function isPreviewcnInitialized(cwd: string): Promise<boolean> {
  const hasDevtoolsPackageInstalled = await hasDevtoolsPackage(cwd);
  if (!hasDevtoolsPackageInstalled) return false;

  const layoutPath = await findAppLayout(cwd);
  if (!layoutPath) return false;

  return await checkDevtoolsInLayout(layoutPath);
}
