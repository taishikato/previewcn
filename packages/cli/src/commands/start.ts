import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";

import { EDITOR_DEFAULT_PORT } from "../utils/constants";
import { logger } from "../utils/logger";
import { detectPackageManager } from "../utils/package-manager";
import { findAvailablePort, waitForServer } from "../utils/ports";
import { isPreviewcnInitialized } from "../utils/previewcn-setup";
import { registerShutdownHandlers } from "../utils/shutdown";
import { startTargetDevServer } from "../utils/target-dev-server";
import { devCommand } from "./dev";
import { initCommand } from "./init";

type StartOptions = {
  yes?: boolean;
  port?: string;
};

const TARGET_PORT_START = 3000;
const TARGET_READY_TIMEOUT_MS = 60_000;

/**
 * Default command for `npx previewcn` (no subcommand).
 * - Checks if the project is initialized
 * - If not, prompts to run init
 * - Starts the target dev server on an available port
 * - Starts the editor with the resolved target URL
 */
export async function startCommand(options: StartOptions) {
  const cwd = process.cwd();

  await ensureInitialized(cwd, options);

  // Step 2: Detect package manager
  const spinner = ora("Detecting package manager...").start();
  let pm: string;
  try {
    pm = await detectPackageManager(cwd);
    spinner.succeed(`Detected package manager: ${chalk.cyan(pm)}`);
  } catch {
    spinner.fail("Could not detect package manager");
    logger.error("Make sure you have a package.json in the current directory.");
    process.exit(1);
  }

  // Step 3: Find available port for target app
  const targetPortSpinner = ora(
    "Finding available port for target app..."
  ).start();
  let targetPort: number;
  try {
    targetPort = await findAvailablePort(TARGET_PORT_START);
    targetPortSpinner.succeed(
      `Target app will run on port ${chalk.cyan(targetPort)}`
    );
  } catch (error) {
    targetPortSpinner.fail("Could not find available port");
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Step 4: Start target dev server
  const target = startTargetDevServer({
    cwd,
    packageManager: pm,
    port: targetPort,
  });
  const targetUrl = target.url;
  logger.info(`Starting target dev server at ${chalk.cyan(targetUrl)}...`);
  console.log();

  const unregisterShutdown = registerShutdownHandlers(() => target.stop());

  // Step 5: Wait for target server to be ready
  const waitSpinner = ora("Waiting for target server to be ready...").start();
  const serverReady = await waitForServer(targetUrl, TARGET_READY_TIMEOUT_MS);

  if (!serverReady) {
    waitSpinner.fail("Target server did not start in time");
    unregisterShutdown();
    target.stop();
    logger.error("The target dev server did not respond within 60 seconds.");
    logger.hint(
      "Make sure your project has a valid `dev` script in package.json."
    );
    process.exit(1);
  }

  waitSpinner.succeed("Target server is ready");
  console.log();

  // Step 6: Start editor with resolved target URL
  const editorPort = options.port || EDITOR_DEFAULT_PORT;

  try {
    await devCommand({
      target: targetUrl,
      port: editorPort,
    });
  } finally {
    unregisterShutdown();
    target.stop();
  }
}

async function ensureInitialized(cwd: string, options: StartOptions) {
  const initialized = await isPreviewcnInitialized(cwd);
  if (initialized) return;

  if (options.yes) {
    logger.info("Project not initialized. Running init...\n");
    await initCommand({ yes: true });
    return;
  }

  const response = await prompts({
    type: "confirm",
    name: "runInit",
    message: "PreviewCN is not initialized in this project. Run init now?",
    initial: true,
  });

  if (!response.runInit) {
    logger.info("Aborted. Run `npx previewcn init` to set up PreviewCN.");
    process.exit(0);
  }

  await initCommand({ yes: false });
  console.log();
}
