import type { Metadata } from "next";
import Link from "next/link";
import type { FAQPage, ItemList, WithContext } from "schema-dts";
import { JsonLd } from "@/components/json-ld";
import { extractInviteCode, fetchDiscordInvite } from "@/lib/discord";
import { GetAccountsClient, type Provider } from "./page.client";
import { cacheLife } from 'next/cache';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Get Accounts",
  description:
    "Buy cheap Minecraft accounts for bot testing. Compare MFA and NFA accounts from trusted providers. Prices from 5¢ per alt with instant delivery and bulk discounts.",
};

const PROVIDERS: Omit<Provider, "discordInvite">[] = [
  // NFA Accounts (Temporary)
  {
    name: "Ravealts",
    logo: "/accounts/ravealts.gif",
    logoUnoptimized: true,
    testimonial:
      "Fresh cookie accounts with good quality. Partnered with Rise client and Mint MM. Previously known as Yolk.",
    url: "https://dash.ravealts.com",
    websiteUrl: "https://ravealts.com",
    discordUrl: "https://discord.gg/ravealts2",
    badges: ["high-quality", "instant-delivery", "bulk-discount"],
    category: "nfa-accounts",
    price: "10-15¢",
    priceValue: 0.1,
    couponCode: "SOULFIRE",
    couponDiscount: "10% off",
  },
  {
    name: "mori's alternative world",
    logo: "/accounts/mori.png",
    url: "https://discord.gg/logs",
    testimonial:
      "Offers completely free temporary Minecraft tokens and credentials. Reliable instant delivery with a high daily cap of 75 accounts.",
    badges: ["free", "instant-delivery", "soulfire-compatible"],
    category: "nfa-accounts",
    price: "Free",
    priceValue: 0,
  },
  {
    name: "Nicealts",
    logo: "/accounts/nicealts.png",
    testimonial:
      "Multiple tiers from budget tokens to high-quality cookies. Responsive support.",
    url: "https://discord.gg/nicealts",
    websiteUrl: "https://status.nicealts.com",
    badges: ["high-quality", "instant-delivery", "bulk-discount"],
    category: "nfa-accounts",
    price: "5-10¢",
    priceValue: 0.05,
  },
  {
    name: "ZZXGP",
    logo: "/accounts/zzxgp.png",
    testimonial:
      "Multiple tiers from budget tokens to premium cookies. Good entry point for new users.",
    url: "https://zzxgp.me",
    websiteUrl: "https://zzxgp.me",
    discordUrl: "https://discord.gg/gycmTvrfnj",
    badges: ["instant-delivery", "bulk-discount"],
    category: "nfa-accounts",
    price: "5-12¢",
    priceValue: 0.05,
  },
  {
    name: "YYY",
    logo: "/accounts/yyy.png",
    testimonial:
      "Cookie and token accounts with their own delivery platform.",
    url: "https://discord.gg/rmxayvwc5K",
    badges: ["high-quality", "instant-delivery"],
    category: "nfa-accounts",
    price: "12¢",
    priceValue: 0.12,
  },
  {
    name: "Mog Alts",
    logo: "/accounts/mogalts.png",
    testimonial:
      "Cheap token accounts starting at 5¢. No frills, just alts.",
    url: "https://mogalts.win",
    websiteUrl: "https://mogalts.win",
    discordUrl: "https://discord.gg/mogalts",
    badges: ["instant-delivery", "bulk-discount"],
    category: "nfa-accounts",
    price: "5¢",
    priceValue: 0.05,
  },
  {
    name: "Localts",
    logo: "/accounts/luma.png",
    testimonial:
      "Higher price point, but accounts are known to last longer. Quality over quantity.",
    url: "https://localts.store",
    websiteUrl: "https://localts.store",
    discordUrl: "https://discord.gg/B4xkxHwmd4",
    badges: ["high-quality", "lifetime-warranty"],
    category: "nfa-accounts",
    price: "25¢",
    priceValue: 0.25,
  },
  {
    name: "Less | Unbanned",
    logo: "/accounts/lessunbanned.png",
    testimonial:
      "Sells unbanned accounts specifically. Useful if you need clean accounts with no existing bans.",
    url: "https://discord.gg/teMqsB3PYG",
    badges: ["instant-delivery"],
    category: "nfa-accounts",
    price: "5¢",
    priceValue: 0.05,
  },
  // MFA (Permanent Full Access) Accounts
  {
    name: "Ravealts",
    logo: "/accounts/ravealts.gif",
    testimonial:
      "Permanent accounts with full access. You can change the email, password, and username.",
    url: "https://dash.ravealts.com",
    websiteUrl: "https://ravealts.com",
    discordUrl: "https://discord.gg/ravealts2",
    badges: ["high-quality", "lifetime-warranty", "soulfire-compatible"],
    category: "mfa-accounts",
    price: "$5.67",
    priceValue: 5.67,
    couponCode: "SOULFIRE",
    couponDiscount: "10% off",
  },
  {
    name: "Luma MFA",
    logo: "/accounts/luma.png",
    testimonial:
      "Full access accounts that work well as mains or long-term alts.",
    url: "https://discord.gg/5Wc4tA2ypY",
    badges: ["high-quality", "lifetime-warranty", "soulfire-compatible"],
    category: "mfa-accounts",
    price: "$4.50",
    priceValue: 4.5,
  },
  {
    name: "Nicealts",
    logo: "/accounts/nicealts.png",
    testimonial:
      "Also sells permanent MFA accounts alongside their token/cookie selection. Known for responsive support.",
    url: "https://discord.gg/nicealts",
    websiteUrl: "https://status.nicealts.com",
    badges: ["high-quality", "lifetime-warranty", "soulfire-compatible"],
    category: "mfa-accounts",
    price: "$5.00",
    priceValue: 5.0,
  },
  {
    name: "Aqua MFA",
    logo: "/accounts/aquamfa.png",
    testimonial:
      "Cheap MFA accounts. Note: may be sourced from public breaches, so expect higher pullback rates.",
    url: "https://discord.gg/87XFhsS35V",
    badges: ["instant-delivery", "soulfire-compatible"],
    category: "mfa-accounts",
    price: "$4.00-$5.50",
    priceValue: 4.0,
  },
  {
    name: "ZZXGP",
    logo: "/accounts/zzxgp.png",
    testimonial:
      "Cheap MFA accounts. Note: likely Hypixel banned and may have higher pullback rates.",
    url: "https://zzxgp.me",
    websiteUrl: "https://zzxgp.me",
    discordUrl: "https://discord.gg/gycmTvrfnj",
    badges: ["instant-delivery", "soulfire-compatible"],
    category: "mfa-accounts",
    price: "$4.50",
    priceValue: 4.5,
  },
  {
    name: "Brano",
    logo: "/accounts/brano.png",
    testimonial:
      "OG usernames, Minecon capes, and rare collectible accounts. Premium pricing for exclusive items.",
    url: "https://discord.gg/EsbhHkm9e4",
    badges: ["high-quality", "lifetime-warranty", "soulfire-compatible"],
    category: "mfa-accounts",
    price: "$50.00+",
    priceValue: 50.0,
  },
];

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
