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
