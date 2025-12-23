import chalk from "chalk";

import { detectNextJsProject, findAppLayout } from "../utils/detect-project";
import { hasDevtoolsPackage as hasDevtoolsPackageInstalled } from "../utils/devtools-package";
import { logger } from "../utils/logger";
import { checkDevtoolsInLayout } from "../utils/modify-layout";

export async function doctorCommand() {
  logger.info("Running PreviewCN diagnostics...\n");

  const checks: Array<{ name: string; pass: boolean; message: string }> = [];

  // Check 1: Next.js App Router
  const projectInfo = await detectNextJsProject(process.cwd());
  checks.push({
    name: "Next.js App Router",
    pass: projectInfo.isNextJs && projectInfo.isAppRouter,
    message: projectInfo.isNextJs
      ? projectInfo.isAppRouter
        ? "Detected"
        : "App Router not found (using Pages Router?)"
      : "Not a Next.js project",
  });

  // Check 2: @previewcn/devtools package installed
  const hasDevtoolsPackage = await hasDevtoolsPackageInstalled(process.cwd());
  checks.push({
    name: "@previewcn/devtools package",
    pass: hasDevtoolsPackage,
    message: hasDevtoolsPackage
      ? "Installed"
      : "Not found (run `npx previewcn init`)",
  });

  // Check 3: PreviewcnDevtools in layout
  let hasDevtoolsInLayout = false;
  const layoutPath = await findAppLayout(process.cwd());
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
    logger.success("All checks passed! PreviewCN devtools is ready to use.");
    logger.info(
      "Run your dev server and click the theme icon to open the editor."
    );
  } else {
    logger.warn("Some checks failed. Run `npx previewcn init` to set up.");
  }
}
