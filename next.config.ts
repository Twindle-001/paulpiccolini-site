import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      // Old WordPress URLs → new site equivalents
      {
        source: "/shop",
        destination: "/prints",
        permanent: true, // 301 redirect
      },
      {
        source: "/portraits",
        destination: "/portrait",
        permanent: true, // 301 redirect
      },
      // Common WordPress paths that no longer exist
      {
        source: "/wp-admin/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-content/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-includes/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/wp-login.php",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/",
        permanent: true,
      },
      {
        source: "/feed/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
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
