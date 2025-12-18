import fs from "fs/promises";
import path from "path";

export type ProjectInfo = {
  isNextJs: boolean;
  isAppRouter: boolean;
};

export async function detectNextJsProject(cwd: string): Promise<ProjectInfo> {
  const result: ProjectInfo = {
    isNextJs: false,
    isAppRouter: false,
  };

  // Check package.json for next dependency
  try {
    const pkgPath = path.join(cwd, "package.json");
    const pkgContent = await fs.readFile(pkgPath, "utf-8");
    const pkg = JSON.parse(pkgContent);
    result.isNextJs = Boolean(
      pkg.dependencies?.next || pkg.devDependencies?.next
    );
  } catch {
    return result;
  }

  // Check for app/ directory
  try {
    const appDir = path.join(cwd, "app");
    const stat = await fs.stat(appDir);
    result.isAppRouter = stat.isDirectory();
  } catch {
    // Check for src/app/ directory
    try {
      const srcAppDir = path.join(cwd, "src", "app");
      const stat = await fs.stat(srcAppDir);
      result.isAppRouter = stat.isDirectory();
    } catch {
      // app/ doesn't exist
    }
  }

  return result;
}

export async function findAppLayout(cwd: string): Promise<string | null> {
  const possiblePaths = [
    path.join(cwd, "app", "layout.tsx"),
    path.join(cwd, "app", "layout.ts"),
    path.join(cwd, "app", "layout.jsx"),
    path.join(cwd, "app", "layout.js"),
    path.join(cwd, "src", "app", "layout.tsx"),
    path.join(cwd, "src", "app", "layout.ts"),
    path.join(cwd, "src", "app", "layout.jsx"),
    path.join(cwd, "src", "app", "layout.js"),
  ];

  for (const p of possiblePaths) {
    try {
      await fs.access(p);
      return p;
    } catch {
      // File doesn't exist
    }
  }

  return null;
}
