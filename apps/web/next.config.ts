import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Support standalone build for CLI bundling
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,

  // Transpile monorepo packages
  transpilePackages: ["@previewcn/receiver"],
};

export default nextConfig;
