import { Command } from "commander";

import { devCommand } from "./commands/dev";
import { doctorCommand } from "./commands/doctor";
import { initCommand } from "./commands/init";
import { startCommand } from "./commands/start";

const program = new Command();

program
  .name("previewcn")
  .description("CLI for PreviewCN - real-time shadcn/ui theme editor")
  .version("0.1.0");

// Default command: `npx previewcn` (no subcommand)
program
  .command("start", { isDefault: true })
  .description("Start target dev server and PreviewCN editor (default)")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-p, --port <port>", "Port for the editor", "4000")
  .action(startCommand);

program
  .command("init")
  .description("Initialize PreviewCN in your Next.js project")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-f, --force", "Overwrite existing receiver file")
  .option(
    "-d, --devtools",
    "Use embedded devtools mode (no iframe, single dev server)"
  )
  .action(initCommand);

program
  .command("dev")
  .description("Start the PreviewCN theme editor only")
  .option(
    "-t, --target <url>",
    "Target URL to preview",
    "http://localhost:3000"
  )
  .option("-p, --port <port>", "Port for the editor", "4000")
  .action(devCommand);

program
  .command("doctor")
  .description("Check PreviewCN setup and diagnose issues")
  .action(doctorCommand);

program.parse();
