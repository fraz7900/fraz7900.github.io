import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export to out/ for GitHub Pages (user site: fraz7900.github.io, empty base path).
  output: "export",
  // Emit /work/index.html etc. so Pages serves /work/ and redirects /work to it.
  trailingSlash: true,
  // cacheComponents / partialPrefetching (template defaults) are omitted on purpose:
  // Next 16.4 fails the build with "PPR cannot be enabled in export mode".
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
