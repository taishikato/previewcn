#!/usr/bin/env node

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WEB_STANDALONE = path.resolve(
  ROOT,
  "..",
  "..",
  "apps",
  "web",
  ".next",
  "standalone"
);
const WEB_STATIC = path.resolve(
  ROOT,
  "..",
  "..",
  "apps",
  "web",
  ".next",
  "static"
);
const WEB_PUBLIC = path.resolve(ROOT, "..", "..", "apps", "web", "public");
const EDITOR_DIR = path.resolve(ROOT, "editor");

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function main() {
  console.log("Copying editor build to CLI package...");

  // Check if standalone build exists
  try {
    await fs.access(WEB_STANDALONE);
  } catch {
    console.error(
      "Error: Standalone build not found. Run `pnpm --filter @previewcn/web build:standalone` first."
    );
    process.exit(1);
  }

  // Clean editor directory (keep .gitkeep)
  try {
    const entries = await fs.readdir(EDITOR_DIR);
    for (const entry of entries) {
      if (entry !== ".gitkeep") {
        await fs.rm(path.join(EDITOR_DIR, entry), {
          recursive: true,
          force: true,
        });
      }
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Directory doesn't exist, create it
      await fs.mkdir(EDITOR_DIR, { recursive: true });
    } else {
      // Unexpected error (permissions, etc.)
      throw error;
    }
  }

  // Copy standalone output
  console.log("Copying standalone build...");
  await copyDir(WEB_STANDALONE, EDITOR_DIR);

  // Copy static files
  console.log("Copying static files...");
  const staticDest = path.join(EDITOR_DIR, ".next", "static");
  await copyDir(WEB_STATIC, staticDest);

  // Copy public files
  console.log("Copying public files...");
  const publicDest = path.join(EDITOR_DIR, "public");
  await copyDir(WEB_PUBLIC, publicDest);

  console.log("Editor build copied successfully!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
