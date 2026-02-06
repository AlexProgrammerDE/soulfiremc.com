import { Suspense } from "react";
import type { ItemList, WithContext } from "schema-dts";
import { JsonLd } from "@/components/json-ld";
import {
  DiscordMemberBadge,
  DiscordMemberBadgeSkeleton,
} from "./discord-badge";
import { GetAccountsClient, type Provider } from "./page.client";

const PROVIDERS: Provider[] = [
  // Low Quality Account Shops (budget options)
  {
    name: "Nicealts",
    logo: "/accounts/nicealts.png",
    testimonial:
      "Budget token accounts at the lowest price point. Good for basic use cases where quality isn't critical.",
    url: "https://discord.gg/nicealts",
    badges: ["instant-delivery", "bulk-discount"],
    category: "low-quality-alts",
    price: "5¢",
    priceValue: 0.05,
  },
  {
    name: "Mog Alts",
    logo: "/accounts/mogalts.png",
    testimonial:
      "Low-cost token accounts for budget-conscious users. Basic accounts at competitive prices.",
    url: "https://discord.gg/PeThFREW4y",
    badges: ["instant-delivery", "bulk-discount"],
    category: "low-quality-alts",
    price: "5¢",
    priceValue: 0.05,
  },
  {
    name: "ZZXGP",
    logo: "/accounts/zzxgp.png",
    testimonial:
      "Budget tier token accounts alongside their premium offerings. Good entry point for new users.",
    url: "https://discord.gg/gycmTvrfnj",
    badges: ["instant-delivery", "bulk-discount"],
    category: "low-quality-alts",
    price: "5¢",
    priceValue: 0.05,
  },
  {
    name: "Less | Unbanned",
    logo: "/accounts/lessunbanned.png",
    testimonial:
      "Specializes in unbanned accounts. Good option if you need accounts without existing bans.",
    url: "https://discord.gg/teMqsB3PYG",
    badges: ["instant-delivery"],
    category: "low-quality-alts",
    price: "5¢",
    priceValue: 0.05,
  },
  // High Quality Account Shops (ranked by value)
  {
    name: "Ravealts",
    logo: "/accounts/ravealts.gif",
    testimonial:
      "Fresh cookie accounts with good quality. Partnered with Rise client and Mint MM. Previously known as Yolk.",
    url: "https://discord.gg/ravealts",
    websiteUrl: "https://ravealts.com",
    badges: ["high-quality", "instant-delivery", "bulk-discount"],
    category: "high-quality-alts",
    price: "10-15¢",
    priceValue: 0.1,
    couponCode: "SOULFIRE",
    couponDiscount: "10% off",
  },
  {
    name: "Nicealts",
    logo: "/accounts/nicealts.png",
    testimonial:
      "Best value for high quality accounts. Offers both temporary tokens/cookies and permanent MFA accounts with responsive support.",
    url: "https://discord.gg/nicealts",
    badges: ["high-quality", "instant-delivery", "bulk-discount"],
    category: "high-quality-alts",
    price: "10¢",
    priceValue: 0.1,
  },
  {
    name: "ZZXGP",
    logo: "/accounts/zzxgp.png",
    testimonial:
      "Versatile shop offering multiple tiers from budget to premium. Known for reliable cookie/token accounts and competitive MFA pricing.",
    url: "https://discord.gg/gycmTvrfnj",
    badges: ["instant-delivery", "bulk-discount"],
    category: "high-quality-alts",
    price: "12¢",
    priceValue: 0.12,
  },
  {
    name: "YYY",
    logo: "/accounts/yyy.png",
    testimonial:
      "High quality cookie and token accounts at competitive prices. Reliable delivery through their dedicated platform.",
    url: "https://discord.gg/rmxayvwc5K",
    badges: ["high-quality", "instant-delivery"],
    category: "high-quality-alts",
    price: "12¢",
    priceValue: 0.12,
  },
  {
    name: "Localts",
    logo: "/accounts/luma.png",
    testimonial:
      "Premium tier accounts with emphasis on quality over quantity. Higher price point but accounts known to last longer.",
    url: "https://discord.gg/B4xkxHwmd4",
    badges: ["high-quality", "lifetime-warranty"],
    category: "high-quality-alts",
    price: "25¢",
    priceValue: 0.25,
  },
  // MFA (Permanent Full Access) Accounts
  {
    name: "Ravealts",
    logo: "/accounts/ravealts.gif",
    testimonial:
      "Trusted MFA provider offering permanent accounts with full access and info change capabilities.",
    url: "https://discord.gg/ravealts",
    websiteUrl: "https://ravealts.com",
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
      "Permanent Minecraft accounts with full access. Reliable option for mains or long-term alts.",
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
      "Also offers permanent MFA accounts in addition to their popular token/cookie selection. Trusted provider with responsive support.",
    url: "https://discord.gg/nicealts",
    badges: ["high-quality", "lifetime-warranty", "soulfire-compatible"],
    category: "mfa-accounts",
    price: "$5.00",
    priceValue: 5.0,
  },
  {
    name: "Aqua MFA",
    logo: "/accounts/aquamfa.png",
    testimonial:
      "Budget MFA accounts at low prices. Note: accounts may be sourced from public breaches with higher pullback rates.",
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
      "Budget MFA accounts at competitive prices. Note: accounts are likely Hypixel banned and may have higher pullback rates.",
    url: "https://discord.gg/gycmTvrfnj",
    badges: ["instant-delivery", "soulfire-compatible"],
    category: "mfa-accounts",
    price: "$4.50",
    priceValue: 4.5,
  },
  {
    name: "Brano",
    logo: "/accounts/brano.png",
    testimonial:
      "Specializes in premium OG usernames, Minecon capes, and rare collectible accounts. Higher price point for exclusive items.",
    url: "https://discord.gg/EsbhHkm9e4",
    badges: ["high-quality", "lifetime-warranty", "soulfire-compatible"],
    category: "mfa-accounts",
    price: "$50.00+",
    priceValue: 50.0,
  },
];

function DiscordBadgeWrapper({ url }: { url: string }) {
  if (!url.includes("discord.gg")) return null;

  return (
    <Suspense fallback={<DiscordMemberBadgeSkeleton />}>
      <DiscordMemberBadge url={url} />
    </Suspense>
  );
}

export default function GetAccountsPage() {
  // Pre-render Discord badges for each unique Discord URL
  const discordBadges: Record<string, React.ReactNode> = {};
  for (const provider of PROVIDERS) {
    if (provider.url.includes("discord.gg") && !discordBadges[provider.url]) {
      discordBadges[provider.url] = <DiscordBadgeWrapper url={provider.url} />;
    }
  }

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
      <Suspense>
        <GetAccountsClient
          providers={PROVIDERS}
          discordBadges={discordBadges}
        />
      </Suspense>
    </>
  );
}
