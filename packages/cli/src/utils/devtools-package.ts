import fs from "fs/promises";
import path from "path";

type PackageJson = {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export async function hasDevtoolsPackage(cwd: string): Promise<boolean> {
  return await hasPackageDependency(cwd, "@previewcn/devtools");
}

async function hasPackageDependency(
  cwd: string,
  packageName: string
): Promise<boolean> {
  const packageJson = await readPackageJson(cwd);
  if (!packageJson) return false;

  return Boolean(
    packageJson.devDependencies?.[packageName] ??
    packageJson.dependencies?.[packageName]
  );
}

async function readPackageJson(cwd: string): Promise<PackageJson | null> {
  try {
    const packageJsonPath = path.join(cwd, "package.json");
    const content = await fs.readFile(packageJsonPath, "utf-8");
    return JSON.parse(content) as PackageJson;
  } catch {
    return null;
  }
}
