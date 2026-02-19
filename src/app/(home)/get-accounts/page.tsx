import type { Metadata } from "next";
import Link from "next/link";
import type { FAQPage, ItemList, WithContext } from "schema-dts";
import { JsonLd } from "@/components/json-ld";
import { extractInviteCode, fetchDiscordInvite } from "@/lib/discord";
import { PROVIDERS } from "@/lib/accounts-data";
import { GetAccountsClient } from "./page.client";
import { cacheLife } from 'next/cache';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Get Accounts",
  description:
    "Buy cheap Minecraft accounts for bot testing. Compare MFA and NFA accounts from trusted providers. Prices from 5¢ per alt with instant delivery and bulk discounts.",
};

const faqItems: {
  question: string;
  answerHtml: string;
  answerElement: React.ReactNode;
}[] = [
  {
    question: "What are MFA accounts?",
    answerHtml:
      'MFA (Multi-Factor Authentication) accounts are permanent Minecraft accounts with full access. You can change the email, password, and username. They\'re more secure and stable, which makes them pricier. Learn more in the <a href="https://soulfiremc.com/docs/usage/accounts">Account Guide</a>.',
    answerElement: (
      <>
        MFA (Multi-Factor Authentication) accounts are permanent Minecraft
        accounts with full access. You can change the email, password, and
        username. They're more secure and stable, which makes them pricier.
        Learn more in the{" "}
        <Link href="/docs/usage/accounts" className="underline text-primary">
          Account Guide
        </Link>
        .
      </>
    ),
  },
  {
    question: "What are NFA accounts?",
    answerHtml:
      'NFA (Non-Full Access) accounts are temporary accounts that may stop working over time. They\'re cheaper but come with a higher risk of losing access. See the <a href="https://soulfiremc.com/docs/usage/accounts">Account Guide</a> for details on supported account types.',
    answerElement: (
      <>
        NFA (Non-Full Access) accounts are temporary accounts that may stop
        working over time. They're cheaper but come with a higher risk of losing
        access. See the{" "}
        <Link href="/docs/usage/accounts" className="underline text-primary">
          Account Guide
        </Link>{" "}
        for details on supported account types.
      </>
    ),
  },
  {
    question: "Which account type works with SoulFire?",
    answerHtml:
      'MFA accounts are fully supported by SoulFire. For NFA accounts, SoulFire supports refresh token auth but does not support cookie/access token auth. Read the <a href="https://soulfiremc.com/docs/usage/accounts">Account Guide</a> for setup instructions.',
    answerElement: (
      <>
        MFA accounts are fully supported by SoulFire. For NFA accounts, SoulFire
        supports refresh token auth but does not support cookie/access token
        auth. Read the{" "}
        <Link href="/docs/usage/accounts" className="underline text-primary">
          Account Guide
        </Link>{" "}
        for setup instructions.
      </>
    ),
  },
  {
    question: "Are these providers affiliated with SoulFire?",
    answerHtml:
      "No. This is a community-curated list. We recommend doing your own research before purchasing. Some providers offer coupon codes for SoulFire users.",
    answerElement: (
      <>
        No. This is a community-curated list. We recommend doing your own
        research before purchasing. Some providers offer coupon codes for
        SoulFire users.
      </>
    ),
  },
  {
    question: 'What does the "Free" badge mean?',
    answerHtml:
      "Providers with the Free badge offer accounts at no cost. These are typically temporary tokens with daily limits.",
    answerElement: (
      <>
        Providers with the Free badge offer accounts at no cost. These are
        typically temporary tokens with daily limits.
      </>
    ),
  },
];

export default async function GetAccountsPage() {
  "use cache";
  cacheLife("hours");

  const faqJsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
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
      <Suspense>
        <GetAccountsClient
          providers={
            await Promise.all(
              PROVIDERS.map(async (provider) => {
                const discordLink = provider.discordUrl ?? provider.url;
                return {
                  ...provider,
                  discordInvite: discordLink.includes("discord.gg")
                    ? await fetchDiscordInvite(extractInviteCode(discordLink))
                    : null,
                };
              }),
            )
          }
          faqItems={faqItems.map((item) => ({
            question: item.question,
            answer: item.answerElement,
          }))}
        />
      </Suspense>
    </>
  );
}
