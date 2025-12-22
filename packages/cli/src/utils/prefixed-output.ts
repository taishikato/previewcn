import readline from "readline";
import chalk from "chalk";

type OutputStreams = {
  stdout?: NodeJS.ReadableStream | null;
  stderr?: NodeJS.ReadableStream | null;
};

/**
 * Pipe child process output to console with a dim prefix.
 * Uses readline to handle chunked output safely (line-by-line).
 */
export function pipePrefixedOutput(streams: OutputStreams, prefix: string) {
  const disposers: Array<() => void> = [];

  if (streams.stdout) {
    disposers.push(pipeStream(streams.stdout, prefix));
  }
  if (streams.stderr) {
    disposers.push(pipeStream(streams.stderr, prefix));
  }

  return () => {
    for (const dispose of disposers) {
      dispose();
    }
  };
}

function pipeStream(stream: NodeJS.ReadableStream, prefix: string) {
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  rl.on("line", (line) => {
    if (!line.trim()) return;
    console.log(chalk.dim(`${prefix} ${line}`));
  });

  return () => rl.close();
}
