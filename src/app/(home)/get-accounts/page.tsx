import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type { FAQPage, ItemList, WithContext } from "schema-dts";
import { accountFaqItems } from "@/app/(home)/get-accounts/accounts-faq";
import { JsonLd } from "@/components/json-ld";
import { extractDiscordInviteCode, PROVIDERS } from "@/lib/accounts-data";
import { fetchDiscordInvite } from "@/lib/discord";
import { getUpvoteCounts } from "@/lib/upvotes";
import { GetAccountsClient } from "./page.client";

export const metadata: Metadata = {
  title: "Get Accounts",
  description:
    "Buy cheap Minecraft accounts for bot testing. Compare MFA and NFA accounts from trusted providers. Prices from 5¢ per alt with instant delivery and bulk discounts.",
};

export default async function GetAccountsPage() {
  "use cache";
  cacheLife("hours");

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
    name: "Minecraft Account Providers",
    description:
      "Trusted Minecraft account providers for bot testing with SoulFire. Compare MFA, high-quality, and budget accounts.",
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
        discordInvites={Promise.all(
          PROVIDERS.map((provider) => {
            const discordCode = extractDiscordInviteCode(provider);
            return discordCode ? fetchDiscordInvite(discordCode) : null;
          }),
        ).then()}
        initialCounts={await getUpvoteCounts(
          "account",
          [...new Set(PROVIDERS.map((p) => p.slug))],
        )}
      />
    </>
  );
}
