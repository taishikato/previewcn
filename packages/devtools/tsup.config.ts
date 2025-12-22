import { readFileSync, writeFileSync } from "fs";
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  external: ["react"],
  minify: true,
  treeshake: true,
  splitting: false,
  sourcemap: false,
  async onSuccess() {
    // Prepend "use client" directive to output files
    const files = ["dist/index.js", "dist/index.cjs"];
    for (const file of files) {
      const content = readFileSync(file, "utf-8");
      writeFileSync(file, `"use client";\n${content}`);
    }
    console.log('Added "use client" directive to output files');
  },
});
