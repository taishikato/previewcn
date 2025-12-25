import { spawn } from "child_process";
import { detect } from "detect-package-manager";

export type PackageManagerName = Awaited<ReturnType<typeof detect>>;

export async function detectPackageManager(
  cwd: string
): Promise<PackageManagerName> {
  return await detect({ cwd });
}

export function getDevArgs(pm: string, port: number): string[] {
  // pnpm: pnpm dev -- --port 3001
  // yarn: yarn dev -- --port 3001
  // npm:  npm run dev -- --port 3001
  if (pm === "pnpm") {
    return ["dev", "--", "--port", String(port)];
  }
  if (pm === "yarn") {
    return ["dev", "--", "--port", String(port)];
  }
  // npm and others
  return ["run", "dev", "--", "--port", String(port)];
}

export async function installDevDependency(
  pm: PackageManagerName,
  packageName: string,
  cwd: string
): Promise<void> {
  const args = getInstallDevArgs(pm, packageName);

  return new Promise((resolve, reject) => {
    const child = spawn(pm, args, {
      cwd,
      stdio: "pipe",
    });

    let stderr = "";

    child.stderr?.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Failed to install ${packageName}: ${stderr}`));
      }
    });

    child.on("error", (err) => {
      reject(err);
    });
  });
}

function getInstallDevArgs(
  pm: PackageManagerName,
  packageName: string
): string[] {
  // pnpm: pnpm add -D <package>
  // yarn: yarn add -D <package>
  // npm:  npm install -D <package>
  // bun:  bun add -D <package>
  if (pm === "pnpm") {
    return ["add", "-D", packageName];
  }
  if (pm === "yarn") {
    return ["add", "-D", packageName];
  }
  if (pm === "bun") {
    return ["add", "-D", packageName];
  }
  // npm and others
  return ["install", "-D", packageName];
}
