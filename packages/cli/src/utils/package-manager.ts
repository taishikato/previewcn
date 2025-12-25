import { detect } from "detect-package-manager";

export type PackageManagerName = Awaited<ReturnType<typeof detect>>;

export async function detectPackageManager(
  cwd: string
): Promise<PackageManagerName> {
  return await detect({ cwd });
}
