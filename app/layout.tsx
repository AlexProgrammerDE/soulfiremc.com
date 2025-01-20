import {Footer, Layout, Navbar} from 'nextra-theme-docs'
import {Banner, Head} from 'nextra/components'
import {getPageMap} from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import '~/style.css'
import PlausibleProvider from "next-plausible";
import Image from "next/image";
import {Metadata, Viewport} from "next";

export const metadata = {
  metadataBase: new URL('https://soulfiremc.com'),
  title: {
    default: 'SoulFire - Advanced Minecraft Server-Stresser Tool',
    template: '%s - SoulFire'
  },
  description: 'Advanced Minecraft Server-Stresser Tool. Launch bot attacks on your servers to measure performance.',
  applicationName: 'SoulFire',
  generator: 'Next.js',
  appleWebApp: {
    title: 'SoulFire'
  },
  other: {
    'msapplication-TileColor': "#3289BF"
  },
  twitter: {
    site: 'https://soulfiremc.com'
  },
  openGraph: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    url: './',
    siteName: 'SkinsRestorer',
    locale: 'en_US',
    type: 'website'
  },
  alternates: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    canonical: './'
  }
} satisfies Metadata

export const viewport = {
  themeColor: "#3289BF"
} satisfies Viewport

export default async function RootLayout({children}) {
  const navbar = (
    <Navbar
      logo={
        <div style={{display: "flex", alignItems: "center", gap: "4px"}}>
          <Image src={"/logo.png"} width={32} height={32} alt="SoulFire Logo"/>
          <span>SoulFire</span>
        </div>
      }
      chatLink={process.env.NEXT_PUBLIC_DISCORD_LINK}
      chatIcon={
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" height="24" fill="currentColor">
          <title>Discord</title>
          <path
            d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"/>
        </svg>
      }
      projectLink={process.env.NEXT_PUBLIC_GITHUB_LINK}
    />
  )
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
    <Head faviconGlyph="✦">
      <PlausibleProvider trackOutboundLinks trackFileDownloads scriptProps={{"add-file-types": "jar"} as never}
                         domain="soulfiremc.com"/>
    </Head>
    <body>
    <Layout
      toc={{
        float: true
      }}
      feedback={{
        content: 'Question? Give us feedback →',
        labels: 'feedback'
      }}
      banner={
        <Banner storageKey="new-client">
          <a href="https://github.com/AlexProgrammerDE/SoulFireClient/releases" target="_blank" rel="noreferrer">
            🎉 SoulFire has a brand new client. Download →
          </a>
        </Banner>
      }
      navbar={navbar}
      footer={<Footer>
        <div className="flex w-full flex-col items-center sm:items-start">
          <div>
            <a
              className="flex items-center gap-1 text-current"
              target="_blank"
              rel="noopener noreferrer"
              title="vercel.com homepage"
              href="https://vercel.com/?utm_source=soulfire&utm_campaign=oss"
            >
              <span>Powered by</span>
              <svg height={20} viewBox="0 0 283 64" fill="none">
                <title>Vercel</title>
                <path
                  fill="currentColor"
                  d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z"
                />
              </svg>
            </a>
          </div>
          <p className="mt-6 text-xs">
            © {new Date().getFullYear()} SoulFire
          </p>
        </div>
      </Footer>}
      editLink="Edit this page on GitHub →"
      docsRepositoryBase="https://github.com/AlexProgrammerDE/soulfiremc.com/blob/main"
      sidebar={{defaultMenuCollapseLevel: 1, toggleButton: true}}
      pageMap={await getPageMap()}
    >
      {children}
    </Layout>
    </body>
    </html>
  )
}
