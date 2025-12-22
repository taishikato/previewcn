import fs from "fs/promises";
import path from "path";

/**
 * Find a reasonable components directory in a Next.js project.
 * Prefers existing directories, but falls back to <cwd>/components.
 */
export async function findComponentsDir(cwd: string): Promise<string> {
  // Check common component directory locations
  const candidates = [
    path.join(cwd, "components"),
    path.join(cwd, "src", "components"),
    path.join(cwd, "app", "components"),
  ];

  for (const dir of candidates) {
    try {
      const stat = await fs.stat(dir);
      if (stat.isDirectory()) {
        return dir;
      }
    } catch {
      // Directory doesn't exist, continue
    }
  }

  // Default to components/ in project root
  return path.join(cwd, "components");
}
