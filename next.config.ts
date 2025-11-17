import * as fs from "node:fs";
import * as path from "node:path";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import { getRequiredEnv } from "./src/lib/env";

const withMDX = createMDX();

function getFoldersWithPageFiles(dir: string): string[] {
  const foldersWithPageFiles: string[] = [];

  // Read the contents of the current directory.
  const items = fs.readdirSync(dir);

  // Check if the current directory contains either 'page.mdx' or 'page.tsx'
  const containsPageFile = items.some(
    (item) => item === "page.mdx" || item === "page.tsx",
  );

  if (containsPageFile) {
    foldersWithPageFiles.push(dir);
  }

  // Loop through each item in the directory.
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    // If the item is a directory, recursively search it.
    if (stat.isDirectory()) {
      foldersWithPageFiles.push(...getFoldersWithPageFiles(fullPath));
    }
  }

  return foldersWithPageFiles;
}

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.posthog.com; style-src 'self' 'unsafe-inline' https://*.posthog.com; object-src 'none'; base-uri 'self'; connect-src 'self' https://discord.com https://*.posthog.com; font-src 'self' https://*.posthog.com; frame-src 'self' https://www.youtube.com; img-src 'self' data: https://avatars.githubusercontent.com https://img.shields.io https://*.posthog.com; manifest-src 'self'; media-src 'self' https://github.com https://github-production-user-asset-6210df.s3.amazonaws.com https://*.posthog.com; worker-src 'self' blob: data:;",
  },
];

const baseDir = path.join("src", "app", "(home)");
const config: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  env: {
    SITEMAP_PAGES: getFoldersWithPageFiles(baseDir)
      .map((folder) => folder.substring(baseDir.length))
      .join("|"),
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
        protocol: "https",
      },
      {
        hostname: "github.com",
        protocol: "https",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/discord",
        destination: getRequiredEnv("NEXT_PUBLIC_DISCORD_LINK"),
        permanent: false,
      },
      {
        source: "/github",
        destination: getRequiredEnv("NEXT_PUBLIC_GITHUB_LINK"),
        permanent: false,
      },
      {
        source: "/donate",
        destination: getRequiredEnv("NEXT_PUBLIC_DONATE_LINK"),
        permanent: false,
      },
      {
        source: "/demo-video",
        destination: "https://www.youtube.com/watch?v=BD-xE8vbHtQ",
        permanent: false,
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
      {
        source: "/RELAY-KAWND/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/RELAY-KAWND/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/va/:match*",
        destination: "/_vercel/insights/:match*",
      },
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*{/}?",
        headers: securityHeaders,
      },
    ];
  },
};

export default withMDX(config);
