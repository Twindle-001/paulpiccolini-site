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
      // Old WordPress product/page URLs (404 in Search Console)
      {
        source: "/produit/:slug*",
        destination: "/prints",
        permanent: true,
      },
      {
        source: "/conditions-generales-de-vente",
        destination: "/cgv",
        permanent: true,
      },
      {
        source: "/conditions-generales-de-vente/",
        destination: "/cgv",
        permanent: true,
      },
      {
        source: "/portfolio",
        destination: "/",
        permanent: true,
      },
      {
        source: "/portfolio/",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/home-2",
        destination: "/",
        permanent: true,
      },
      {
        source: "/en/home-2/",
        destination: "/",
        permanent: true,
      },
      // Catch remaining /en/ old WPML paths
      {
        source: "/en/:path*",
        destination: "/:path*",
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
    // Sanity CDN handles format negotiation (AVIF/WebP) via auto=format,
    // but enabling Next.js optimization helps with any next/image usage
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
