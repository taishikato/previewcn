import chalk from "chalk";
import { detect } from "detect-package-manager";
import { execa, type ResultPromise } from "execa";
import ora from "ora";
import prompts from "prompts";

import { EDITOR_DEFAULT_PORT } from "../utils/constants";
import { findAppLayout } from "../utils/detect-project";
import { logger } from "../utils/logger";
import {
  checkReceiverFileExists,
  checkThemeReceiverInLayout,
} from "../utils/modify-layout";
import { findAvailablePort, waitForServer } from "../utils/ports";
import { devCommand } from "./dev";
import { initCommand } from "./init";

type StartOptions = {
  yes?: boolean;
  port?: string;
};

/**
 * Default command for `npx previewcn` (no subcommand).
 * - Checks if the project is initialized
 * - If not, prompts to run init
 * - Starts the target dev server on an available port
 * - Starts the editor with the resolved target URL
 */
export async function startCommand(options: StartOptions) {
  const cwd = process.cwd();

  // Step 1: Check if initialized
  const isInitialized = await checkIsInitialized(cwd);

  if (!isInitialized) {
    if (options.yes) {
      logger.info("Project not initialized. Running init...\n");
      await initCommand({ yes: true });
    } else {
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
    }
    console.log();
  }

  // Step 2: Detect package manager
  const spinner = ora("Detecting package manager...").start();
  let pm: Awaited<ReturnType<typeof detect>>;
  try {
    pm = await detect({ cwd });
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
    targetPort = await findAvailablePort(3000);
    targetPortSpinner.succeed(
      `Target app will run on port ${chalk.cyan(targetPort)}`
    );
  } catch (error) {
    targetPortSpinner.fail("Could not find available port");
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Step 4: Start target dev server
  const targetUrl = `http://localhost:${targetPort}`;
  logger.info(`Starting target dev server at ${chalk.cyan(targetUrl)}...`);
  console.log();

  let targetProcess: ResultPromise | null = null;

  const cleanup = () => {
    if (targetProcess) {
      targetProcess.kill("SIGTERM");
    }
  };

  // Handle cleanup on exit
  process.on("SIGINT", () => {
    cleanup();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    cleanup();
    process.exit(0);
  });

  try {
    const devArgs = getDevArgs(pm, targetPort);
    targetProcess = execa(pm, devArgs, {
      cwd,
      stdio: "pipe",
      env: {
        ...process.env,
        FORCE_COLOR: "1",
      },
    });

    // Stream target process output with prefix
    targetProcess.stdout?.on("data", (data: Buffer) => {
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (line.trim()) {
          console.log(chalk.dim(`[target] ${line}`));
        }
      }
    });

    targetProcess.stderr?.on("data", (data: Buffer) => {
      const lines = data.toString().split("\n");
      for (const line of lines) {
        if (line.trim()) {
          console.log(chalk.dim(`[target] ${line}`));
        }
      }
    });
  } catch (error) {
    logger.error("Failed to start target dev server");
    logger.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  // Step 5: Wait for target server to be ready
  const waitSpinner = ora("Waiting for target server to be ready...").start();
  const serverReady = await waitForServer(targetUrl, 60000);

  if (!serverReady) {
    waitSpinner.fail("Target server did not start in time");
    cleanup();
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
    cleanup();
  }
}

/**
 * Check if the project is initialized with PreviewCN.
 */
async function checkIsInitialized(cwd: string): Promise<boolean> {
  const receiverExists = await checkReceiverFileExists(cwd);
  if (!receiverExists) {
    return false;
  }

  const layoutPath = await findAppLayout(cwd);
  if (!layoutPath) {
    return false;
  }

  const hasReceiver = await checkThemeReceiverInLayout(layoutPath);
  return hasReceiver;
}

/**
 * Get the arguments to pass to the package manager to run `dev` with a specific port.
 */
function getDevArgs(pm: string, port: number): string[] {
  // All package managers support `run dev -- --port <port>`
  // pnpm: pnpm dev -- --port 3001
  // npm: npm run dev -- --port 3001
  // yarn: yarn dev -- --port 3001
  if (pm === "pnpm") {
    return ["dev", "--", "--port", String(port)];
  }
  if (pm === "yarn") {
    return ["dev", "--port", String(port)];
  }
  // npm and others
  return ["run", "dev", "--", "--port", String(port)];
}
