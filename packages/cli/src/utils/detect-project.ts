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

  // Check for app/ or src/app/ directory
  const appDirs = [path.join(cwd, "app"), path.join(cwd, "src", "app")];
  for (const dir of appDirs) {
    try {
      const stat = await fs.stat(dir);
      if (stat.isDirectory()) {
        result.isAppRouter = true;
        break;
      }
    } catch {
      // Directory doesn't exist, continue checking
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
