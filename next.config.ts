import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/my-new-blog",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
