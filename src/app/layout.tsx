import "@/style.css";
import { Banner } from "fumadocs-ui/components/banner";
import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { Organization, WithContext } from "schema-dts";
import { Toaster } from "sonner";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { JsonLd } from "@/components/json-ld";
import { getRequiredEnv } from "@/lib/env";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL("https://soulfiremc.com"),
  title: {
    default: "SoulFire - Advanced Minecraft Bot Tool",
    template: "%s - SoulFire",
  },
  description:
    "Advanced Minecraft bot tool for testing, automation, and development. Run bot sessions on your servers.",
  applicationName: "SoulFire",
  generator: "Next.js",
  appleWebApp: {
    title: "SoulFire",
  },
  other: {
    "msapplication-TileColor": "#3289BF",
  },
  twitter: {
    site: "https://soulfiremc.com",
    card: "summary",
    images: "/logo.png",
  },
  openGraph: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    url: "./",
    siteName: "SoulFire",
    locale: "en_US",
    type: "website",
    images: "/logo.png",
  },
  alternates: {
    // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
    canonical: "./",
    types: {
      "application/rss+xml": [
        {
          title: "SoulFire Blog Feed",
          url: "/blog/feed.xml",
        },
      ],
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#3289BF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SoulFire",
    url: "https://soulfiremc.com",
    logo: "https://soulfiremc.com/logo.png",
    description:
      "Advanced Minecraft bot tool for testing, automation, and development.",
    sameAs: [
      "https://github.com/AlexProgrammerDE/SoulFire",
      getRequiredEnv("NEXT_PUBLIC_DISCORD_LINK"),
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Technical Support",
      url: getRequiredEnv("NEXT_PUBLIC_DISCORD_LINK"),
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "flex size-full min-h-svh flex-col antialiased",
        )}
        suppressHydrationWarning
      >
        <NuqsAdapter>
          <RootProvider>
            <JsonLd data={organizationJsonLd} />
            {/* <Banner id={"v2"}>SoulFire v2 is out now!</Banner> */}
            {children}
            <CookieConsentBanner />
            <Toaster richColors />
          </RootProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
