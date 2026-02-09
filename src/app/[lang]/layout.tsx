import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { RootProvider } from "fumadocs-ui/provider/next";
import { defineI18nUI } from "fumadocs-ui/i18n";
import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { Organization, WithContext } from "schema-dts";
import { Toaster } from "sonner";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { JsonLd } from "@/components/json-ld";
import { getRequiredEnv } from "@/lib/env";
import { i18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: "English",
    },
    de: {
      displayName: "Deutsch",
      search: "Dokumentation durchsuchen",
    },
  },
});

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

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}

export default async function LangLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;

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
    <html lang={lang} suppressHydrationWarning>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "flex size-full min-h-svh flex-col antialiased",
        )}
        suppressHydrationWarning
      >
        <NuqsAdapter>
          <RootProvider i18n={provider(lang)}>
            <JsonLd data={organizationJsonLd} />
            {children}
            <CookieConsentBanner />
            <Toaster richColors />
          </RootProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
