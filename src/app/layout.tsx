import "@/style.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { Organization, WithContext } from "schema-dts";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { JsonLd } from "@/components/json-ld";
import { getRequiredEnv } from "@/lib/env";
import { imageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const viewport: Viewport = {
  themeColor: "#3289BF",
};

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
  other: {
    "msapplication-TileColor": "#3289BF",
  },
  ...imageMetadata(),
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

export default function RootLayout({
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
      "https://github.com/soulfiremc-com/SoulFire",
      getRequiredEnv(
        process.env.NEXT_PUBLIC_DISCORD_LINK,
        "NEXT_PUBLIC_DISCORD_LINK",
      ),
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Technical Support",
      url: getRequiredEnv(
        process.env.NEXT_PUBLIC_DISCORD_LINK,
        "NEXT_PUBLIC_DISCORD_LINK",
      ),
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="qRgsfQEDB7kSuRdyL3PfiA"
          async
        ></script>
      </head>
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
            <AuthProvider>
              <JsonLd data={organizationJsonLd} />
              {children}
              <CookieConsentBanner />
              <Toaster richColors />
            </AuthProvider>
          </RootProvider>
        </NuqsAdapter>
        <script src='https://storage.ko-fi.com/cdn/scripts/overlay-widget.js'></script>
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: Setup widget */}
        <script dangerouslySetInnerHTML={{
          __html: `
          kofiWidgetOverlay.draw('alexprogrammerde', {
            'type': 'floating-chat',
            'floating-chat.donateButton.text': 'Support me',
            'floating-chat.donateButton.background-color': '#794bc4',
            'floating-chat.donateButton.text-color': '#fff'
          });
        `
        }}/>
      </body>
    </html>
  );
}
