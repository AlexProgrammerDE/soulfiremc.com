import { withPlausibleProxy } from 'next-plausible';
import { createMDX } from 'fumadocs-mdx/next';
import { NextConfig } from 'next';

const withMDX = createMDX();

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; connect-src 'self' https://discord.com; font-src 'self'; frame-src 'self' https://www.youtube.com; img-src 'self' data: https://avatars.githubusercontent.com https://img.shields.io; manifest-src 'self'; media-src 'self' https://github.com https://github-production-user-asset-6210df.s3.amazonaws.com; worker-src 'self';",
  },
];

const config: NextConfig = {
  reactStrictMode: true,
  env: {
    // SITEMAP_PAGES: getFoldersWithPageFiles("app")
    //   .map(folder => folder.substring("app".length))
    //   .join("|")
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https',
      },
      {
        hostname: 'github.com',
        protocol: 'https',
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: '/discord',
        destination: process.env.NEXT_PUBLIC_DISCORD_LINK,
        permanent: false,
      },
      {
        source: '/github',
        destination: process.env.NEXT_PUBLIC_GITHUB_LINK,
        permanent: false,
      },
      {
        source: '/donate',
        destination: process.env.NEXT_PUBLIC_DONATE_LINK,
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/va/:match*',
        destination: '/_vercel/insights/:match*',
      },
      {
        source: '/docs/:path*.mdx',
        destination: '/llms.mdx/:path*',
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default withMDX(
  withPlausibleProxy({
    customDomain: process.env.PLAUSIBLE_URL,
  })(config),
);
