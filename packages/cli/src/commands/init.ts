import fs from "fs/promises";
import path from "path";
import ora from "ora";

import {
  THEME_RECEIVER_FILENAME,
  THEME_RECEIVER_TEMPLATE,
} from "../templates/theme-receiver";
import { confirm, cyan } from "../utils/cli-ui";
import { detectNextJsProject, findAppLayout } from "../utils/detect-project";
import { findComponentsDir } from "../utils/find-components-dir";
import { logger } from "../utils/logger";
import {
  addDevtoolsToLayout,
  addThemeReceiverToLayout,
} from "../utils/modify-layout";
import {
  detectPackageManager,
  installDevDependency,
} from "../utils/package-manager";

type InitOptions = {
  yes?: boolean;
  force?: boolean;
  devtools?: boolean;
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

  // Devtools mode: install devtools package and patch layout only.
  if (options.devtools) {
    await initDevtoolsMode({ layoutPath, yes: options.yes });
    return;
  }

  await initReceiverMode({
    layoutPath,
    yes: options.yes,
    force: options.force,
  });
}

type InitReceiverModeArgs = {
  layoutPath: string;
  yes?: boolean;
  force?: boolean;
};

async function initReceiverMode({
  layoutPath,
  yes,
  force,
}: InitReceiverModeArgs) {
  // Step 3: Find components directory
  const componentsDir = await findComponentsDir(process.cwd());
  const receiverPath = path.join(componentsDir, THEME_RECEIVER_FILENAME);
  const relativeReceiverPath = path.relative(process.cwd(), receiverPath);

  // Check if receiver already exists
  let receiverExists = false;
  try {
    await fs.access(receiverPath);
    receiverExists = true;
  } catch {
    // File doesn't exist
  }

  if (receiverExists && !force) {
    logger.info(`Receiver already exists at: ${cyan(relativeReceiverPath)}`);
    const overwrite = await confirm("Overwrite existing receiver file?", false);
    if (!overwrite) {
      logger.info("Skipping receiver file generation.");
    } else {
      receiverExists = false; // Mark for regeneration
    }
  }

  // Step 4: Confirmation
  if (!yes && !receiverExists) {
    const proceed = await confirm(
      `This will create ${cyan(relativeReceiverPath)} and modify your layout. Continue?`,
      true
    );
    if (!proceed) {
      logger.info("Aborted.");
      process.exit(0);
    }
  }

  // Step 5: Generate receiver file
  if (!receiverExists || force) {
    const generateSpinner = ora(`Creating ${relativeReceiverPath}...`).start();

    try {
      // Ensure components directory exists
      await fs.mkdir(componentsDir, { recursive: true });

      // Write the receiver file
      await fs.writeFile(receiverPath, THEME_RECEIVER_TEMPLATE, "utf-8");
      generateSpinner.succeed(`Created ${relativeReceiverPath}`);
    } catch (error) {
      generateSpinner.fail(`Failed to create ${relativeReceiverPath}`);
      logger.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  }

  // Step 6: Modify layout
  const layoutSpinner = ora(
    "Adding PreviewCNThemeReceiver to layout..."
  ).start();

  try {
    await addThemeReceiverToLayout(layoutPath, componentsDir);
    layoutSpinner.succeed("Added PreviewCNThemeReceiver to layout");
  } catch (error) {
    layoutSpinner.fail("Failed to modify layout");
    logger.error(error instanceof Error ? error.message : String(error));
    logger.hint(
      "You may need to add PreviewCNThemeReceiver manually. See documentation."
    );
    process.exit(1);
  }

  // Success message
  console.log();
  logger.success("PreviewCN initialized successfully!");
  console.log();

  logger.info("Next step:");
  console.log(
    `  Run ${cyan("npx previewcn")} to start the dev server and editor together.`
  );
  console.log();
}

type InitDevtoolsModeArgs = {
  layoutPath: string;
  yes?: boolean;
};

async function initDevtoolsMode({ layoutPath, yes }: InitDevtoolsModeArgs) {
  if (!yes) {
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
