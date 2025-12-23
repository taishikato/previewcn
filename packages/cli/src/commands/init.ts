import path from "path";
import ora from "ora";

import { confirm, cyan } from "../utils/cli-ui";
import { detectNextJsProject, findAppLayout } from "../utils/detect-project";
import { logger } from "../utils/logger";
import { addDevtoolsToLayout } from "../utils/modify-layout";
import {
  detectPackageManager,
  installDevDependency,
} from "../utils/package-manager";

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
    `Found layout at: ${cyan(path.relative(process.cwd(), layoutPath))}`
  );

  // Step 3: Confirm and setup devtools
  if (!options.yes) {
    const proceed = await confirm(
      "This will install @previewcn/devtools and modify your app layout. Continue?",
      true
    );
    if (!proceed) {
      logger.info("Aborted.");
      process.exit(0);
    }
  }

  await setupDevtools(layoutPath);

  // Success message
  console.log();
  logger.success("PreviewCN devtools initialized successfully!");
  console.log();
  logger.info("Next step:");
  console.log(
    `  Run ${cyan("pnpm dev")} (or your dev command) to start the dev server.`
  );
  console.log(
    `  Click the ${cyan("theme palette icon")} in the bottom-right corner to open the editor.`
  );
  console.log();
}

async function setupDevtools(layoutPath: string) {
  const cwd = process.cwd();

  // Install @previewcn/devtools as devDependency
  const installSpinner = ora("Installing @previewcn/devtools...").start();

  try {
    const pm = await detectPackageManager(cwd);
    await installDevDependency(pm, "@previewcn/devtools", cwd);
    installSpinner.succeed("Installed @previewcn/devtools");
  } catch (error) {
    installSpinner.fail("Failed to install @previewcn/devtools");
    logger.error(error instanceof Error ? error.message : String(error));
    logger.hint("You can install it manually: pnpm add -D @previewcn/devtools");
    // Continue anyway - user can install manually
  }

  // Add devtools to layout
  const layoutSpinner = ora("Adding PreviewcnDevtools to layout...").start();

  try {
    await addDevtoolsToLayout(layoutPath);
    layoutSpinner.succeed("Added PreviewcnDevtools to layout");
  } catch (error) {
    layoutSpinner.fail("Failed to modify layout for devtools");
    logger.error(error instanceof Error ? error.message : String(error));
    logger.hint(
      "You may need to add PreviewcnDevtools manually. See documentation."
    );
  }
}
