import * as fs from "node:fs";
import * as path from "node:path";
import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";
import { getRequiredEnv } from "@/lib/env";

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

    // If the item is a directory (skip dynamic route segments like [slug]),
    // recursively search it.
    if (stat.isDirectory() && !item.startsWith("[")) {
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
    value: "0",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // {
  //   key: "Content-Security-Policy",
  //   value:
  //     "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.posthog.com https://analytics.ahrefs.com https://e.soulfiremc.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://*.posthog.com; object-src 'none'; base-uri 'self'; connect-src 'self' https://discord.com https://*.posthog.com https://analytics.ahrefs.com https://e.soulfiremc.com https://challenges.cloudflare.com; font-src 'self' https://*.posthog.com; frame-src 'self' https://www.youtube.com https://challenges.cloudflare.com; img-src 'self' data: blob: https://gravatar.com https://avatars.githubusercontent.com https://cdn.discordapp.com https://www.gravatar.com https://img.shields.io https://*.posthog.com; manifest-src 'self'; media-src 'self' https://github.com https://github-production-user-asset-6210df.s3.amazonaws.com https://*.posthog.com; worker-src 'self' blob: data:;",
  // },
];

const baseDir = path.join("src", "app", "(home)");
const config: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  cacheComponents: true,
  serverExternalPackages: ["@takumi-rs/image-response"],
  experimental: {
    viewTransition: true,
  },
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
        hostname: "cdn.discordapp.com",
        protocol: "https",
      },
      {
        hostname: "github.com",
        protocol: "https",
      },
      {
        hostname: "media.discordapp.net",
        protocol: "https",
      },
      {
        hostname: "www.gravatar.com",
        protocol: "https",
      },
      {
        hostname: "gravatar.com",
        protocol: "https",
      },
      {
        hostname: "enderdash.com",
        protocol: "https",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/discord",
        destination: getRequiredEnv(
          process.env.NEXT_PUBLIC_DISCORD_LINK,
          "NEXT_PUBLIC_DISCORD_LINK",
        ),
        permanent: false,
      },
      {
        source: "/github",
        destination: getRequiredEnv(
          process.env.NEXT_PUBLIC_GITHUB_LINK,
          "NEXT_PUBLIC_GITHUB_LINK",
        ),
        permanent: false,
      },
      {
        source: "/donate",
        destination: getRequiredEnv(
          process.env.NEXT_PUBLIC_DONATE_LINK,
          "NEXT_PUBLIC_DONATE_LINK",
        ),
        permanent: false,
      },
      {
        source: "/demo-video",
        destination: "https://www.youtube.com/watch?v=BD-xE8vbHtQ",
        permanent: false,
      },
      {
        source: "/docs/installation/windows",
        destination: "/docs/start-here/windows",
        permanent: true,
      },
      {
        source: "/docs/installation/macos",
        destination: "/docs/start-here/macos",
        permanent: true,
      },
      {
        source: "/docs/installation/linux",
        destination: "/docs/start-here/linux",
        permanent: true,
      },
      {
        source: "/docs/installation/dedicated-server",
        destination: "/docs/start-here/dedicated-server",
        permanent: true,
      },
      {
        source: "/docs/guides/gui-mode",
        destination: "/docs/start-here/gui-mode",
        permanent: true,
      },
      {
        source: "/docs/guides/cli-mode",
        destination: "/docs/start-here/cli-mode",
        permanent: true,
      },
      {
        source: "/docs/guides/gui-navigation",
        destination: "/docs/how-to/gui-navigation",
        permanent: true,
      },
      {
        source: "/docs/guides/docker",
        destination: "/docs/how-to/docker",
        permanent: true,
      },
      {
        source: "/docs/guides/webdav",
        destination: "/docs/how-to/webdav",
        permanent: true,
      },
      {
        source: "/docs/guides/mcp",
        destination: "/docs/how-to/mcp",
        permanent: true,
      },
      {
        source: "/docs/guides/dedicated-mode",
        destination: "/docs/how-to/dedicated-mode",
        permanent: true,
      },
      {
        source: "/docs/usage/accounts",
        destination: "/docs/how-to/import-accounts",
        permanent: true,
      },
      {
        source: "/docs/usage/proxies",
        destination: "/docs/how-to/import-proxies",
        permanent: true,
      },
      {
        source: "/docs/usage/account-formats",
        destination: "/docs/reference/account-formats",
        permanent: true,
      },
      {
        source: "/docs/usage/proxy-formats",
        destination: "/docs/reference/proxy-formats",
        permanent: true,
      },
      {
        source: "/docs/usage/versions",
        destination: "/docs/reference/versions",
        permanent: true,
      },
      {
        source: "/docs/usage/commands",
        destination: "/docs/reference/commands",
        permanent: true,
      },
      {
        source: "/docs/usage/cli-flags",
        destination: "/docs/reference/cli-flags",
        permanent: true,
      },
      {
        source: "/docs/usage/operation-modes",
        destination: "/docs/concepts/operation-modes",
        permanent: true,
      },
      {
        source: "/docs/usage/plugins",
        destination: "/docs/concepts/plugins",
        permanent: true,
      },
      {
        source: "/docs/terminology",
        destination: "/docs/reference/terminology",
        permanent: true,
      },
      {
        source: "/docs/installation",
        destination: "/docs/start-here",
        permanent: true,
      },
      {
        source: "/docs/guides",
        destination: "/docs/how-to",
        permanent: true,
      },
      {
        source: "/docs/usage",
        destination: "/docs/reference",
        permanent: true,
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
  async rewrites() {
    return [
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

// import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
