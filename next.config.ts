import nextra from 'nextra'
import {withPlausibleProxy} from "next-plausible";
import * as fs from 'fs';
import * as path from 'path';

function getFoldersWithPageFiles(dir: string): string[] {
  const foldersWithPageFiles: string[] = [];

  // Read the contents of the current directory.
  const items = fs.readdirSync(dir);

  // Check if the current directory contains either 'page.mdx' or 'page.tsx'
  const containsPageFile = items.some(item =>
    item === 'page.mdx' || item === 'page.tsx'
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

function isExportNode(node, varName: string) {
  if (node.type !== 'mdxjsEsm') return false
  const [n] = node.data.estree.body

  if (n.type !== 'ExportNamedDeclaration') return false

  const name = n.declaration?.declarations?.[0].id.name
  if (!name) return false

  return name === varName
}

const DEFAULT_PROPERTY_PROPS = {
  type: 'Property',
  kind: 'init',
  method: false,
  shorthand: false,
  computed: false
}

export function createAstObject(obj) {
  return {
    type: 'ObjectExpression',
    properties: Object.entries(obj).map(([key, value]) => ({
      ...DEFAULT_PROPERTY_PROPS,
      key: { type: 'Identifier', name: key },
      value:
        value && typeof value === 'object' ? value : { type: 'Literal', value }
    }))
  }
}

// eslint-disable-next-line unicorn/consistent-function-scoping
const rehypeOpenGraphImage = () => ast => {
  const frontMatterNode = ast.children.find(node =>
    isExportNode(node, 'metadata')
  )
  if (!frontMatterNode) {
    return
  }
  const { properties } =
    frontMatterNode.data.estree.body[0].declaration.declarations[0].init
  const title = properties.find(o => o.key.value === 'title')?.value.value
  if (!title) {
    return
  }
  const [prop] = createAstObject({
    openGraph: createAstObject({
      images: `https://soulfiremc.com/og?title=${title}`
    })
  }).properties
  properties.push(prop)
}

const withNextra = nextra({
  staticImage: true,
  latex: true,
  defaultShowCopyCode: true,
  mdxOptions: {
    rehypePlugins: [
      // Provide only on `build` since turbopack on `dev` supports only serializable values
      process.env.NODE_ENV === 'production' && rehypeOpenGraphImage
    ]
  },
})

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self'; connect-src 'self' https://discord.com; font-src 'self'; frame-src 'self' https://www.youtube.com; img-src 'self' data: https://avatars.githubusercontent.com https://img.shields.io; manifest-src 'self'; media-src 'self' https://github.com https://github-production-user-asset-6210df.s3.amazonaws.com; worker-src 'self';"
  }
]

export default withPlausibleProxy({
  customDomain: process.env.PLAUSIBLE_URL
})(withNextra({
  reactStrictMode: true,
  env: {
    SITEMAP_PAGES: getFoldersWithPageFiles("app")
      .map(folder => folder.substring("app".length))
      .join("|")
  },
  images: {
    remotePatterns: [{
      hostname: 'avatars.githubusercontent.com',
      protocol: 'https',
    }, {
      hostname: 'github.com',
      protocol: 'https',
    }]
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
    ]
  },
  async rewrites() {
    return [
      {
        source: '/va/:match*',
        destination: '/_vercel/insights/:match*',
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders
      }
    ]
  }
}))
