import type { NextConfig } from "next";

const isCI = process.env.GITHUB_ACTIONS === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";

const config: NextConfig = {
  output: "export",
  basePath: isCI ? `/${repo}` : "",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default config;
