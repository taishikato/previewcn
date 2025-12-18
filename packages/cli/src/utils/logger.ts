import chalk from "chalk";

export const logger = {
  info: (message: string) => console.log(chalk.blue("info"), message),
  success: (message: string) => console.log(chalk.green("success"), message),
  warn: (message: string) => console.log(chalk.yellow("warn"), message),
  error: (message: string) => console.log(chalk.red("error"), message),
  hint: (message: string) => console.log(chalk.gray("hint"), message),
};
