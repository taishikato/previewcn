import fs from "fs/promises";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";

import {
  THEME_RECEIVER_FILENAME,
  THEME_RECEIVER_TEMPLATE,
} from "../templates/theme-receiver";
import { detectNextJsProject, findAppLayout } from "../utils/detect-project";
import { logger } from "../utils/logger";
import { addThemeReceiverToLayout } from "../utils/modify-layout";

type InitOptions = {
  yes?: boolean;
  force?: boolean;
};

async function findComponentsDir(cwd: string): Promise<string> {
  // Check common component directory locations
  const candidates = [
    path.join(cwd, "components"),
    path.join(cwd, "src", "components"),
    path.join(cwd, "app", "components"),
  ];

  for (const dir of candidates) {
    try {
      const stat = await fs.stat(dir);
      if (stat.isDirectory()) {
        return dir;
      }
    } catch {
      // Directory doesn't exist, continue
    }
  }

  // Default to components/ in project root
  return path.join(cwd, "components");
}

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

  if (receiverExists && !options.force) {
    logger.info(
      `Receiver already exists at: ${chalk.cyan(relativeReceiverPath)}`
    );
    const response = await prompts({
      type: "confirm",
      name: "overwrite",
      message: "Overwrite existing receiver file?",
      initial: false,
    });

    if (!response.overwrite) {
      logger.info("Skipping receiver file generation.");
    } else {
      receiverExists = false; // Mark for regeneration
    }
  }

  // Step 4: Confirmation
  if (!options.yes && !receiverExists) {
    const response = await prompts({
      type: "confirm",
      name: "proceed",
      message: `This will create ${chalk.cyan(relativeReceiverPath)} and modify your layout. Continue?`,
      initial: true,
    });

    if (!response.proceed) {
      logger.info("Aborted.");
      process.exit(0);
    }
  }

  // Step 5: Generate receiver file
  if (!receiverExists || options.force) {
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
  logger.info("Next steps:");
  console.log(`  1. Start your development server`);
  console.log(
    `  2. Run the PreviewCN editor: ${chalk.cyan("npx previewcn dev")}`
  );
  console.log();
}
