import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import { execa } from "execa";
import ora from "ora";

import { EDITOR_DEFAULT_PORT, TARGET_DEFAULT_URL } from "../utils/constants";
import { logger } from "../utils/logger";

type DevOptions = {
  target?: string;
  port?: string;
};

export async function devCommand(options: DevOptions) {
  const target = options.target || TARGET_DEFAULT_URL;
  const port = options.port || EDITOR_DEFAULT_PORT;

  logger.info(`Starting PreviewCN editor...`);
  logger.info(`Target: ${chalk.cyan(target)}`);
  logger.info(`Editor: ${chalk.cyan(`http://localhost:${port}`)}`);
  console.log();

  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const editorPath = path.resolve(__dirname, "..", "editor");
  const serverPath = path.join(editorPath, "server.js");

  // Check if editor is bundled
  try {
    await fs.access(serverPath);
  } catch {
    logger.error("Editor not found. This might be a development build issue.");
    logger.hint("Try reinstalling previewcn: npm install -g previewcn");
    process.exit(1);
  }

  const spinner = ora("Starting editor server...").start();

  try {
    // Set environment variables for the standalone server
    const env = {
      ...process.env,
      PORT: port,
      HOSTNAME: "0.0.0.0",
      PREVIEWCN_TARGET_URL: target,
    };

    spinner.succeed("Editor server started");
    console.log();
    logger.success(
      `PreviewCN is ready at ${chalk.cyan(`http://localhost:${port}`)}`
    );
    console.log();
    logger.info("Press Ctrl+C to stop");
    console.log();

    // Run the standalone Next.js server
    await execa("node", [serverPath], {
      cwd: editorPath,
      env,
      stdio: "inherit",
    });
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException;
    if (nodeError.code === "ENOENT") {
      spinner.fail("Failed to start editor");
      logger.error("Node.js is required to run the editor.");
    } else {
      spinner.fail("Editor server stopped");
    }
    process.exit(1);
  }
}
