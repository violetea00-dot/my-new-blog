import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/my-new-blog",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
