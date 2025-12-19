import { Command } from "commander";

import { devCommand } from "./commands/dev";
import { doctorCommand } from "./commands/doctor";
import { initCommand } from "./commands/init";

const program = new Command();

program
  .name("previewcn")
  .description("CLI for PreviewCN - real-time shadcn/ui theme editor")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize PreviewCN in your Next.js project")
  .option("-y, --yes", "Skip confirmation prompts")
  .option("-f, --force", "Overwrite existing receiver file")
  .action(initCommand);

program
  .command("dev")
  .description("Start the PreviewCN theme editor")
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
