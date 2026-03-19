import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },
  typescript: {
    // Build will succeed even with TS errors (fix later)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Build will succeed even with ESLint warnings
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
