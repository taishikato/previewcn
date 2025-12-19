import chalk from "chalk";

import { TARGET_DEFAULT_URL } from "../utils/constants";
import { detectNextJsProject, findAppLayout } from "../utils/detect-project";
import { logger } from "../utils/logger";
import {
  checkReceiverFileExists,
  checkThemeReceiverInLayout,
} from "../utils/modify-layout";

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

  // Check 2: Receiver file exists
  const receiverExists = await checkReceiverFileExists(process.cwd());
  checks.push({
    name: "PreviewCN receiver file",
    pass: receiverExists,
    message: receiverExists ? "Found" : "Not found (run `npx previewcn init`)",
  });

  // Check 3: ThemeReceiver in layout
  let hasThemeReceiver = false;
  const layoutPath = await findAppLayout(process.cwd());
  if (layoutPath) {
    hasThemeReceiver = await checkThemeReceiverInLayout(layoutPath);
  }
  checks.push({
    name: "ThemeReceiver in layout",
    pass: hasThemeReceiver,
    message: hasThemeReceiver ? "Found" : "Not found in layout",
  });

  // Check 4: Target app running
  let targetRunning = false;
  try {
    const response = await fetch(TARGET_DEFAULT_URL, {
      method: "HEAD",
      signal: AbortSignal.timeout(3000),
    });
    targetRunning = response.ok;
  } catch {
    // Target not running
  }
  checks.push({
    name: `Target app (${TARGET_DEFAULT_URL})`,
    pass: targetRunning,
    message: targetRunning ? "Running" : "Not running",
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
    logger.success("All checks passed! PreviewCN is ready to use.");
  } else {
    logger.warn("Some checks failed. Run `npx previewcn init` to set up.");
  }
}
