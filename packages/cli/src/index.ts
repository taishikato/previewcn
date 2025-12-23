import { Command } from "commander";

import { doctorCommand } from "./commands/doctor";
import { initCommand } from "./commands/init";

const program = new Command();

program
  .name("previewcn")
  .description("CLI for PreviewCN - real-time shadcn/ui theme editor")
  .version("0.1.0");

// Default command: `npx previewcn` runs init
program
  .command("init", { isDefault: true })
  .description("Initialize PreviewCN devtools in your Next.js project")
  .option("-y, --yes", "Skip confirmation prompts")
  .action(initCommand);

program
  .command("doctor")
  .description("Check PreviewCN setup and diagnose issues")
  .action(doctorCommand);

program.parse();
