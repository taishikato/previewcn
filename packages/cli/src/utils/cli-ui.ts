import chalk from "chalk";
import prompts from "prompts";

export function cyan(value: string) {
  return chalk.cyan(value);
}

export async function confirm(message: string, initial: boolean) {
  const response = await prompts({
    type: "confirm",
    name: "value",
    message,
    initial,
  });

  return Boolean(response.value);
}
