import '~/style.css';
import PlausibleProvider from 'next-plausible';
import { Metadata, Viewport } from 'next';
import { RootProvider } from 'fumadocs-ui/provider';
import { Banner } from 'fumadocs-ui/components/banner';

export const metadata: Metadata = {
  metadataBase: new URL('https://soulfiremc.com'),
  title: {
    default: 'SoulFire - Advanced Minecraft Server-Stresser Tool',
    template: '%s - SoulFire',
  },
  description:
    'Advanced Minecraft Server-Stresser Tool. Launch bot attacks on your servers to measure performance.',
  applicationName: 'SoulFire',
  generator: 'Next.js',
  appleWebApp: {
    title: 'SoulFire',
  },
  other: {
    'msapplication-TileColor': '#3289BF',
  },
  twitter: {
    site: 'https://soulfiremc.com',
    card: 'summary_large_image',
  },
  openGraph: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    url: './',
    siteName: 'SoulFire',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    canonical: './',
  },
};

export const viewport: Viewport = {
  themeColor: '#3289BF',
};

export default async function RootLayout({ children }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen" suppressHydrationWarning>
        <RootProvider>
          <Banner id="v2">
            🎉 SoulFire v2 is out now!
          </Banner>
          {children}
        </RootProvider>
        <PlausibleProvider
          trackOutboundLinks
          trackFileDownloads
          scriptProps={{ 'add-file-types': 'jar' } as never}
          domain="soulfiremc.com"
        />
      </body>
    </html>
  );
}
