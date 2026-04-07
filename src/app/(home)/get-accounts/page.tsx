import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type { FAQPage, ItemList, WithContext } from "schema-dts";
import { accountFaqItems } from "@/app/(home)/get-accounts/accounts-faq";
import { JsonLd } from "@/components/json-ld";
import { getDiscordInviteUrl, PROVIDERS } from "@/lib/accounts-data";
import { fetchDiscordInvite } from "@/lib/discord";
import { imageMetadata } from "@/lib/metadata";
import { getUpvoteCounts } from "@/lib/upvotes";
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

  const itemListJsonLd: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Minecraft Alt Shops and Account Providers",
    description:
      "Trusted Minecraft alt shops for SoulFire bot testing. Compare MFA full-access accounts, NFA temporary accounts, and token or cookie account options.",
    numberOfItems: PROVIDERS.length,
    itemListElement: PROVIDERS.map((provider, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: provider.name,
      description: provider.testimonial,
      url: provider.websiteUrl ?? provider.url,
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
      <GetAccountsClient
        discordInvites={discordInvites}
        initialCounts={
          await getUpvoteCounts("account", [
            ...new Set(PROVIDERS.map((p) => p.slug)),
          ])
        }
      />
    </>
  );
}
