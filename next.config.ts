import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["img.clerk.com"], // Allow Clerk images
  },
  reactStrictMode: false, // Disable React Strict Mode
};

export default nextConfig;
