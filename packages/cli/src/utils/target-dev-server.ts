import { execa, type ResultPromise } from "execa";

import { getDevArgs } from "./package-manager";
import { pipePrefixedOutput } from "./prefixed-output";

export type TargetDevServer = {
  url: string;
  port: number;
  process: ResultPromise;
  stop: () => void;
};

type StartTargetDevServerOptions = {
  cwd: string;
  packageManager: string;
  port: number;
};

export function startTargetDevServer({
  cwd,
  packageManager,
  port,
}: StartTargetDevServerOptions): TargetDevServer {
  const url = `http://localhost:${port}`;

  const child = execa(packageManager, getDevArgs(packageManager, port), {
    cwd,
    stdio: "pipe",
    env: {
      ...process.env,
      FORCE_COLOR: "1",
    },
  });

  const disposeOutput = pipePrefixedOutput(child, "[target]");

  const stop = () => {
    disposeOutput();
    try {
      child.kill("SIGTERM");
    } catch {
      // ignore
    }
  };

  return { url, port, process: child, stop };
}
