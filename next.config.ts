import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  serverExternalPackages: [
    "@remotion/bundler",
    "@remotion/renderer",
    "@rspack/core",
    "@rspack/binding-linux-x64-gnu",
    "@rspack/binding-linux-arm64-gnu",
  ]
};

export default nextConfig;
