import path from "path";

import chalk from "chalk";
import { detect } from "detect-package-manager";
import { execa } from "execa";
import ora from "ora";
import prompts from "prompts";

import { detectNextJsProject, findAppLayout } from "../utils/detect-project";
import { logger } from "../utils/logger";
import { addThemeReceiverToLayout } from "../utils/modify-layout";

type InitOptions = {
  yes?: boolean;
};

export async function initCommand(options: InitOptions) {
  logger.info("Initializing PreviewCN...\n");

  // Step 1: Detect Next.js App Router project
  const spinner = ora("Detecting project type...").start();

  const projectInfo = await detectNextJsProject(process.cwd());

  if (!projectInfo.isNextJs) {
    spinner.fail("Not a Next.js project");
    logger.error("PreviewCN requires a Next.js project with App Router.");
    logger.hint("Make sure you're in the root of a Next.js project.");
    process.exit(1);
  }

  if (!projectInfo.isAppRouter) {
    spinner.fail("App Router not detected");
    logger.error("PreviewCN requires Next.js App Router (app/ directory).");
    logger.hint("Create an app/ directory or migrate from pages/ to app/.");
    process.exit(1);
  }

  spinner.succeed("Next.js App Router project detected");

  // Step 2: Find layout file
  const layoutPath = await findAppLayout(process.cwd());

  if (!layoutPath) {
    logger.error("Could not find app/layout.tsx");
    process.exit(1);
  }

  logger.info(
    `Found layout at: ${chalk.cyan(path.relative(process.cwd(), layoutPath))}`
  );

  // Step 3: Confirmation
  if (!options.yes) {
    const response = await prompts({
      type: "confirm",
      name: "proceed",
      message:
        "This will install @previewcn/receiver and modify your layout. Continue?",
      initial: true,
    });

    if (!response.proceed) {
      logger.info("Aborted.");
      process.exit(0);
    }
  }

  // Step 4: Install @previewcn/receiver
  const pkgManager = await detect({ cwd: process.cwd() });
  const installSpinner = ora("Installing @previewcn/receiver...").start();

  try {
    const installCmd = {
      npm: ["npm", "install", "--save-dev", "@previewcn/receiver"],
      yarn: ["yarn", "add", "--dev", "@previewcn/receiver"],
      pnpm: ["pnpm", "add", "--save-dev", "@previewcn/receiver"],
      bun: ["bun", "add", "--dev", "@previewcn/receiver"],
    }[pkgManager];

    await execa(installCmd[0], installCmd.slice(1), { cwd: process.cwd() });
    installSpinner.succeed("Installed @previewcn/receiver");
  } catch (error) {
    installSpinner.fail("Failed to install @previewcn/receiver");
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Step 5: Modify layout
  const layoutSpinner = ora("Adding ThemeReceiver to layout...").start();

  try {
    await addThemeReceiverToLayout(layoutPath);
    layoutSpinner.succeed("Added ThemeReceiver to layout");
  } catch (error) {
    layoutSpinner.fail("Failed to modify layout");
    logger.error(error instanceof Error ? error.message : String(error));
    logger.hint(
      "You may need to add ThemeReceiver manually. See documentation."
    );
    process.exit(1);
  }

  // Success message
  console.log();
  logger.success("PreviewCN initialized successfully!");
  console.log();
  logger.info("Next steps:");
  console.log(
    `  1. Start your development server: ${chalk.cyan(`${pkgManager} run dev`)}`
  );
  console.log(`  2. Run the PreviewCN editor: ${chalk.cyan("npx previewcn dev")}`);
  console.log();
}
