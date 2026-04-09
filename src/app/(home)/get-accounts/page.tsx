import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type {
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  ItemList,
  Offer,
  WithContext,
} from "schema-dts";
import { accountFaqItems } from "@/app/(home)/get-accounts/accounts-faq";
import { JsonLd } from "@/components/json-ld";
import { getDiscordInviteUrl, PROVIDERS } from "@/lib/accounts-data";
import { fetchDiscordInvite } from "@/lib/discord";
import { imageMetadata } from "@/lib/metadata";
import { getAggregateRatingJsonLd, getReviewSummaries } from "@/lib/reviews";
import { GetAccountsClient } from "./page.client";

export const metadata: Metadata = {
  title: "Minecraft Alts, MFA & NFA Accounts",
  description:
    "Compare Minecraft alt shops and account providers for SoulFire. Browse MFA full-access accounts, NFA temporary accounts, and token or cookie alts with current pricing and delivery details.",
  keywords: [
    "minecraft alts",
    "minecraft accounts",
    "minecraft alt shop",
    "mfa accounts",
    "nfa accounts",
    "temporary minecraft alts",
    "token alts",
    "cookie alts",
  ],
  alternates: {
    canonical: "./",
  },
  ...imageMetadata("/og/site/get-accounts/image.webp"),
};

export default async function GetAccountsPage() {
  "use cache";
  cacheLife("hours");

  const providersBySlug = [
    ...new Map(PROVIDERS.map((provider) => [provider.slug, provider])).values(),
  ];
  const reviewSummaries = await getReviewSummaries("account", [
    ...new Set(PROVIDERS.map((provider) => provider.slug)),
  ]);
  const discordInvites = Promise.all(
    providersBySlug.map(async (provider) => {
      const discordInviteUrl = getDiscordInviteUrl(provider);
      return [
        provider.slug,
        discordInviteUrl ? await fetchDiscordInvite(discordInviteUrl) : null,
      ] as const;
    }),
  ).then((entries) => Object.fromEntries(entries));

  const faqJsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: accountFaqItems.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answerHtml,
      },
    })),
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://soulfiremc.com/get-accounts#breadcrumb",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://soulfiremc.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Get Accounts",
        item: "https://soulfiremc.com/get-accounts",
      },
    ],
  };

  const pageJsonLd: WithContext<CollectionPage> = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Minecraft Alts, MFA & NFA Accounts",
    description:
      "Compare Minecraft alt shops and account providers for SoulFire. Browse MFA full-access accounts, NFA temporary accounts, and token or cookie alts with current pricing and delivery details.",
    url: "https://soulfiremc.com/get-accounts",
    inLanguage: "en-US",
    isPartOf: {
      "@type": "WebSite",
      name: "SoulFire",
      url: "https://soulfiremc.com",
    },
    breadcrumb: {
      "@id": "https://soulfiremc.com/get-accounts#breadcrumb",
    },
    mainEntity: {
      "@id": "https://soulfiremc.com/get-accounts#provider-list",
    },
  };

  const itemListJsonLd: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": "https://soulfiremc.com/get-accounts#provider-list",
    name: "Minecraft Alt Shops and Account Providers",
    description:
      "Trusted Minecraft alt shops for SoulFire bot testing. Compare MFA full-access accounts, NFA temporary accounts, and token or cookie account options.",
    numberOfItems: providersBySlug.length,
    itemListElement: providersBySlug.map((provider, index) => {
      const aggregateRating = getAggregateRatingJsonLd(
        reviewSummaries[provider.slug] ?? {
          averageRating: null,
          reviewCount: 0,
        },
      );

      return {
        "@type": "ListItem",
        position: index + 1,
        url: `https://soulfiremc.com/get-accounts/${provider.slug}`,
        item: {
          "@type": "Product",
          name: provider.name,
          description: provider.summary,
          url: `https://soulfiremc.com/get-accounts/${provider.slug}`,
          category:
            provider.category === "mfa-accounts"
              ? "MFA full-access Minecraft accounts"
              : "NFA temporary Minecraft accounts",
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            price: provider.priceValue.toFixed(2),
            availability: "https://schema.org/InStock",
            url: `https://soulfiremc.com/get-accounts/${provider.slug}`,
          } satisfies Offer,
          ...(aggregateRating && { aggregateRating }),
        },
      };
    }),
  };

  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <GetAccountsClient
        discordInvites={discordInvites}
        initialSummaries={reviewSummaries}
      />
    </>
  );
}
