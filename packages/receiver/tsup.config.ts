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
});
