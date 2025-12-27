import fs from "fs/promises";
import path from "path";
import chalk from "chalk";

import { detectNextJsProject, findAppLayout } from "../utils/detect-project";
import { logger } from "../utils/logger";
import { checkDevtoolsInLayout } from "../utils/modify-layout";
import { resolvePreviewcnPaths } from "../utils/path-resolver";

async function hasPreviewcnComponents(targetDir: string): Promise<boolean> {
  try {
    const indexPath = path.join(targetDir, "index.ts");
    await fs.access(indexPath);
    return true;
  } catch {
    return false;
  }
}

export async function doctorCommand() {
  logger.info("Running previewcn diagnostics...\n");

  const cwd = process.cwd();
  const checks: Array<{ name: string; pass: boolean; message: string }> = [];

  // Check 1: Next.js App Router
  const projectInfo = await detectNextJsProject(cwd);
  checks.push({
    name: "Next.js App Router",
    pass: projectInfo.isNextJs && projectInfo.isAppRouter,
    message: projectInfo.isNextJs
      ? projectInfo.isAppRouter
        ? "Detected"
        : "App Router not found (using Pages Router?)"
      : "Not a Next.js project",
  });

  // Check 2: previewcn components generated
  const { targetDir } = await resolvePreviewcnPaths(cwd);
  const hasComponents = await hasPreviewcnComponents(targetDir);
  const relativePath = path.relative(cwd, targetDir);
  checks.push({
    name: "previewcn components",
    pass: hasComponents,
    message: hasComponents
      ? `Found in ${relativePath}`
      : `Not found (run \`npx previewcn init\`)`,
  });

  // Check 3: PreviewcnDevtools in layout
  let hasDevtoolsInLayout = false;
  const layoutPath = await findAppLayout(cwd);
  if (layoutPath) {
    hasDevtoolsInLayout = await checkDevtoolsInLayout(layoutPath);
  }
  checks.push({
    name: "PreviewcnDevtools in layout",
    pass: hasDevtoolsInLayout,
    message: hasDevtoolsInLayout
      ? "Found"
      : "Not found in layout (run `npx previewcn init`)",
  });

  // Print results
  console.log();
  for (const check of checks) {
    const icon = check.pass ? chalk.green("✓") : chalk.red("✗");
    const status = check.pass
      ? chalk.green(check.message)
      : chalk.red(check.message);
    console.log(`  ${icon} ${check.name}: ${status}`);
  }
  console.log();

  const allPassed = checks.every((c) => c.pass);
  if (allPassed) {
    logger.success("All checks passed! previewcn devtools is ready to use.");
    logger.info(
      "Run your dev server and click the theme icon to open the editor."
    );
  } else {
    logger.warn("Some checks failed. Run `npx previewcn init` to set up.");
  }
}
