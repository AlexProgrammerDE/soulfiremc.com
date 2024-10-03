import nextra from 'nextra'
import {withPlausibleProxy} from "next-plausible";

const withNextra = nextra({
    theme: 'nextra-theme-docs',
    themeConfig: './theme.config.tsx',
    staticImage: true,
    latex: true,
    defaultShowCopyCode: true
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
    cleanDistDir: true,
    i18n: {
        locales: ['en-US'],
        defaultLocale: 'en-US'
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
    },
    images: {
        unoptimized: true
    }
}))
