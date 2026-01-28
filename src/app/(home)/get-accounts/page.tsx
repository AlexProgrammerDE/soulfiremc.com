import { Suspense } from "react";
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
  },
  // High Quality Account Shops (ranked by value)
  {
    name: "Nicealts",
    logo: "/accounts/nicealts.png",
    testimonial:
      "Best value for high quality accounts. Offers both temporary tokens/cookies and permanent MFA accounts with responsive support.",
    url: "https://discord.gg/nicealts",
    badges: ["high-quality", "instant-delivery", "bulk-discount"],
    category: "high-quality-alts",
    price: "10¢",
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
  },
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
    couponCode: "SOULFIRE",
    couponDiscount: "10% off",
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
  },
  // MFA (Permanent Full Access) Accounts
  {
    name: "Ravealts",
    logo: "/accounts/ravealts.gif",
    testimonial:
      "Trusted MFA provider offering permanent accounts with full access and info change capabilities.",
    url: "https://discord.gg/ravealts",
    websiteUrl: "https://ravealts.com",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$5.67",
    couponCode: "SOULFIRE",
    couponDiscount: "10% off",
  },
  {
    name: "Luma MFA",
    logo: "/accounts/luma.png",
    testimonial:
      "Permanent Minecraft accounts with full access. Reliable option for mains or long-term alts.",
    url: "https://discord.gg/5Wc4tA2ypY",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$4.50",
  },
  {
    name: "Nicealts",
    logo: "/accounts/nicealts.png",
    testimonial:
      "Also offers permanent MFA accounts in addition to their popular token/cookie selection. Trusted provider with responsive support.",
    url: "https://discord.gg/nicealts",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$5",
  },
  {
    name: "Aqua MFA",
    logo: "/accounts/aquamfa.png",
    testimonial:
      "Budget MFA accounts at low prices. Note: accounts may be sourced from public breaches with higher pullback rates.",
    url: "https://discord.gg/87XFhsS35V",
    badges: ["instant-delivery"],
    category: "mfa-accounts",
    price: "$4-$5.5",
  },
  {
    name: "ZZXGP",
    logo: "/accounts/zzxgp.png",
    testimonial:
      "Budget MFA accounts at competitive prices. Note: accounts are likely Hypixel banned and may have higher pullback rates.",
    url: "https://discord.gg/gycmTvrfnj",
    badges: ["instant-delivery"],
    category: "mfa-accounts",
    price: "$4.50",
  },
  {
    name: "Brano",
    logo: "/accounts/brano.png",
    testimonial:
      "Specializes in premium OG usernames, Minecon capes, and rare collectible accounts. Higher price point for exclusive items.",
    url: "https://discord.gg/EsbhHkm9e4",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$50+",
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

  return (
    <GetAccountsClient providers={PROVIDERS} discordBadges={discordBadges} />
  );
}
