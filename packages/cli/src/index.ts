import { Command } from "commander";

import { doctorCommand } from "./commands/doctor";
import { initCommand } from "./commands/init";

const program = new Command();

program
  .name("previewcn")
  .description("CLI for previewcn - real-time shadcn/ui theme editor")
  .version("0.1.0");

// Default command: `npx previewcn` runs init
program
  .command("init", { isDefault: true })
  .description("Initialize previewcn devtools in your Next.js project")
  .option("-y, --yes", "Skip confirmation prompts")
  .action(initCommand);

program
  .command("doctor")
  .description("Check previewcn setup and diagnose issues")
  .action(doctorCommand);

program.parse();
