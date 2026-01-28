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
    name: "Vox Alts",
    testimonial:
      "Affordable token accounts sold by multiple shops. Budget-friendly option for high volume needs.",
    url: "https://discord.gg/voxalts",
    badges: ["instant-delivery", "bulk-discount"],
    category: "low-quality-alts",
    price: "5¢",
  },
  {
    name: "Mog Alts",
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
    name: "Ravealts",
    testimonial:
      "Token accounts at a slightly higher price point than the cheapest options. Balance of cost and reliability.",
    url: "https://discord.gg/ravealts",
    badges: ["instant-delivery", "bulk-discount"],
    category: "low-quality-alts",
    price: "10-15¢",
    couponCode: "SOULFIRE",
    couponDiscount: "10% off",
  },
  {
    name: "Less | Unbanned",
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
    name: "Fernan",
    testimonial:
      "Quality-focused provider with slightly higher prices reflecting account reliability and longevity.",
    url: "https://discord.gg/x3JvgAbNG9",
    badges: ["high-quality"],
    category: "high-quality-alts",
    price: "15¢",
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
    name: "Aqua MFA",
    logo: "/accounts/aquamfa.png",
    testimonial:
      "Best value for permanent full access accounts. Change all account info as you want - it's truly yours.",
    url: "https://discord.gg/87XFhsS35V",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$4-$5.5",
  },
  {
    name: "ZZXGP",
    logo: "/accounts/zzxgp.png",
    testimonial:
      "Also offers permanent MFA accounts alongside their token/cookie selection. Competitive pricing for full access accounts.",
    url: "https://discord.gg/gycmTvrfnj",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$4.50",
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
    name: "Ravealts",
    logo: "/accounts/nicealts.png",
    testimonial:
      "Trusted MFA provider offering permanent accounts with full access and info change capabilities.",
    url: "https://discord.gg/ravealts",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$5.67",
    couponCode: "SOULFIRE",
    couponDiscount: "10% off",
  },
  {
    name: "Brano",
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
