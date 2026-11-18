import type { NextConfig } from "next";

// Static export for GitHub Pages: `next build` writes plain HTML/CSS/JS to ./out.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true, // /docs -> /docs/index.html, which GitHub Pages serves directly
  images: { unoptimized: true }, // no image server on GitHub Pages
};

export default nextConfig;
