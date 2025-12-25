import * as fs from "fs/promises";
import * as path from "path";

export type GeneratedFile = {
  path: string; // Relative path from target directory
  content: string; // File content
};

export async function writeComponentFiles(
  targetDir: string,
  files: GeneratedFile[]
): Promise<void> {
  await fs.mkdir(targetDir, { recursive: true });

  for (const file of files) {
    const fullPath = path.join(targetDir, file.path);
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, file.content, "utf-8");
  }
}
