import path from "path";
import { execa } from "execa";
import ora from "ora";

import { confirm, cyan } from "../utils/cli-ui";
import { detectNextJsProject, findAppLayout } from "../utils/detect-project";
import { logger } from "../utils/logger";
import { addDevtoolsToLayout } from "../utils/modify-layout";
import { resolvePreviewcnPaths } from "../utils/path-resolver";

const REGISTRY_URL =
  process.env.PREVIEWCN_REGISTRY_URL || "https://www.previewcn.com/r";

type InitOptions = {
  yes?: boolean;
};

export async function initCommand(options: InitOptions) {
  logger.info("Initializing PreviewCN...\n");

  const cwd = process.cwd();

  // Step 1: Detect Next.js App Router project
  const spinner = ora("Detecting project type...").start();

  const projectInfo = await detectNextJsProject(cwd);

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
  const layoutPath = await findAppLayout(cwd);

  if (!layoutPath) {
    logger.error("Could not find app/layout.tsx");
    process.exit(1);
  }

  logger.info(`Found layout at: ${cyan(path.relative(cwd, layoutPath))}`);

  // Step 3: Resolve import path for layout modification
  const { importPath } = await resolvePreviewcnPaths(cwd);

  // Step 4: Confirm installation
  if (!options.yes) {
    const proceed = await confirm(
      "This will install PreviewCN components via shadcn and modify your app layout. Continue?",
      true
    );
    if (!proceed) {
      logger.info("Aborted.");
      process.exit(0);
    }
  }

  await setupDevtools(cwd, layoutPath, importPath);

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

async function setupDevtools(
  cwd: string,
  layoutPath: string,
  importPath: string
) {
  // Install components via shadcn registry
  const installSpinner = ora("Installing PreviewCN components...").start();

  try {
    await execa(
      "npx",
      [
        "-y",
        "shadcn@latest",
        "add",
        "-y",
        `${REGISTRY_URL}/devtools.json`,
        "--overwrite",
      ],
      {
        cwd,
        stdio: "pipe",
      }
    );
    installSpinner.succeed("Installed PreviewCN components");
  } catch (error) {
    installSpinner.fail("Failed to install PreviewCN components");
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Add devtools to layout
  const layoutSpinner = ora("Adding PreviewcnDevtools to layout...").start();

  try {
    await addDevtoolsToLayout(layoutPath, importPath);
    layoutSpinner.succeed("Added PreviewcnDevtools to layout");
  } catch (error) {
    layoutSpinner.fail("Failed to modify layout for devtools");
    logger.error(error instanceof Error ? error.message : String(error));
    logger.hint(
      "You may need to add PreviewcnDevtools manually. See documentation."
    );
    process.exit(1);
  }
}
