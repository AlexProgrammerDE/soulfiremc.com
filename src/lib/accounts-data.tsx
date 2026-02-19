import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Check,
  Gift,
  Package,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import type { DiscordInviteResponse } from "@/lib/discord";

export type Badge =
  | "free"
  | "high-quality"
  | "instant-delivery"
  | "lifetime-warranty"
  | "12h-warranty"
  | "bulk-discount"
  | "soulfire-compatible";

export type Category = "nfa-accounts" | "mfa-accounts";

export type SortOption = "default" | "price-asc" | "price-desc";

export type Listing = {
  testimonial: string;
  badges: Badge[];
  price: string;
  priceValue: number;
  couponCode?: string;
  couponDiscount?: string;
};

export type Shop = {
  slug: string;
  name: string;
  logo?: string;
  logoUnoptimized?: boolean;
  url: string;
  websiteUrl?: string;
  discordUrl?: string;
  listings: Partial<Record<Category, Listing>>;
};

export type Provider = {
  slug: string;
  name: string;
  logo?: string;
  logoUnoptimized?: boolean;
  testimonial: string;
  url: string;
  websiteUrl?: string;
  discordUrl?: string;
  badges: Badge[];
  category: Category;
  price: string;
  priceValue: number;
  couponCode?: string;
  couponDiscount?: string;
  discordInvite: DiscordInviteResponse | null;
};

export const BADGE_CONFIG: Record<
  Badge,
  {
    label: string;
    className: string;
    description: string;
    icon: React.ReactNode;
  }
> = {
  free: {
    label: "Free",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    description:
      "Accounts are available completely for free - no purchase required.",
    icon: <Gift className="h-3 w-3" />,
  },
  "soulfire-compatible": {
    label: "SoulFire Compatible",
    className: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    description:
      "This account type is directly supported by SoulFire. You can use these accounts with SoulFire right away.",
    icon: <Check className="h-3 w-3" />,
  },
  "high-quality": {
    label: "High Quality",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    description:
      "Premium accounts with high reliability and low ban rates. Best for demanding use cases.",
    icon: <Star className="h-3 w-3" />,
  },
  "instant-delivery": {
    label: "Instant Delivery",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    description:
      "Accounts are delivered automatically and instantly after purchase - no waiting required.",
    icon: <Zap className="h-3 w-3" />,
  },
  "lifetime-warranty": {
    label: "Lifetime Warranty",
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
    description:
      "Accounts come with lifetime warranty - get a replacement if your account stops working.",
    icon: <Shield className="h-3 w-3" />,
  },
  "12h-warranty": {
    label: "12 Hour Warranty",
    className: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    description:
      "Accounts come with a 12 hour warranty - get a replacement if your account stops working within 12 hours of purchase.",
    icon: <Shield className="h-3 w-3" />,
  },
  "bulk-discount": {
    label: "Bulk Discount",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    description:
      "Significant discounts available when purchasing accounts in bulk quantities.",
    icon: <Package className="h-3 w-3" />,
  },
};

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; description: string }
> = {
  "nfa-accounts": {
    label: "NFA Accounts",
    description: "Temporary accounts - budget to premium tiers",
  },
  "mfa-accounts": {
    label: "MFA Accounts",
    description: "Full access permanent accounts you own forever",
  },
};

export const SORT_CONFIG: Record<
  SortOption,
  { label: string; icon?: React.ReactNode }
> = {
  default: { label: "Recommended" },
  "price-asc": {
    label: "Price: Low to High",
    icon: <ArrowUpNarrowWide className="h-3 w-3" />,
  },
  "price-desc": {
    label: "Price: High to Low",
    icon: <ArrowDownNarrowWide className="h-3 w-3" />,
  },
};

export const FILTER_BADGES: Badge[] = [
  "free",
  "soulfire-compatible",
  "high-quality",
  "instant-delivery",
  "lifetime-warranty",
  "bulk-discount",
];

export const FILTER_CATEGORIES: Category[] = ["mfa-accounts", "nfa-accounts"];

export const SORT_OPTIONS: SortOption[] = ["default", "price-asc", "price-desc"];

// Shop order is arranged to preserve the recommended sort order
// within both NFA and MFA category sections when derived into PROVIDERS.
export const SHOPS: Shop[] = [
  {
    slug: "ravealts",
    name: "Ravealts",
    logo: "/accounts/ravealts.gif",
    logoUnoptimized: true,
    url: "https://dash.ravealts.com",
    websiteUrl: "https://ravealts.com",
    discordUrl: "https://discord.gg/ravealts2",
    listings: {
      "nfa-accounts": {
        testimonial:
          "Fresh cookie accounts with good quality. Partnered with Rise client and Mint MM. Previously known as Yolk.",
        badges: ["high-quality", "instant-delivery", "bulk-discount"],
        price: "10-15¢",
        priceValue: 0.1,
        couponCode: "SOULFIRE",
        couponDiscount: "10% off",
      },
      "mfa-accounts": {
        testimonial:
          "Permanent accounts with full access. You can change the email, password, and username.",
        badges: ["high-quality", "lifetime-warranty", "soulfire-compatible"],
        price: "$5.67",
        priceValue: 5.67,
        couponCode: "SOULFIRE",
        couponDiscount: "10% off",
      },
    },
  },
  {
    slug: "luma-mfa",
    name: "Luma MFA",
    logo: "/accounts/luma.png",
    url: "https://discord.gg/5Wc4tA2ypY",
    listings: {
      "mfa-accounts": {
        testimonial:
          "Full access accounts that work well as mains or long-term alts.",
        badges: ["high-quality", "instant-delivery", "12h-warranty", "soulfire-compatible"],
        price: "$5.00",
        priceValue: 4.5,
      },
    },
  },
  {
    slug: "mori",
    name: "mori's alternative world",
    logo: "/accounts/mori.png",
    url: "https://discord.gg/logs",
    listings: {
      "nfa-accounts": {
        testimonial:
          "Offers completely free temporary Minecraft tokens and credentials. Reliable instant delivery with a high daily cap of 75 accounts.",
        badges: ["free", "instant-delivery", "soulfire-compatible"],
        price: "Free",
        priceValue: 0,
      },
    },
  },
  {
    slug: "nicealts",
    name: "Nicealts",
    logo: "/accounts/nicealts.png",
    url: "https://discord.gg/nicealts",
    websiteUrl: "https://status.nicealts.com",
    listings: {
      "nfa-accounts": {
        testimonial:
          "Multiple tiers from budget tokens to high-quality cookies. Responsive support.",
        badges: ["high-quality", "instant-delivery", "bulk-discount"],
        price: "5-10¢",
        priceValue: 0.05,
      },
      "mfa-accounts": {
        testimonial:
          "Also sells permanent MFA accounts alongside their token/cookie selection. Known for responsive support.",
        badges: ["high-quality", "lifetime-warranty", "soulfire-compatible"],
        price: "$5.00",
        priceValue: 5.0,
      },
    },
  },
  {
    slug: "aqua-mfa",
    name: "Aqua MFA",
    logo: "/accounts/aquamfa.png",
    url: "https://discord.gg/87XFhsS35V",
    listings: {
      "mfa-accounts": {
        testimonial:
          "Cheap MFA accounts with instant delivery and lifetime warranty.",
        badges: ["instant-delivery", "lifetime-warranty", "soulfire-compatible"],
        price: "$4.00-$5.50",
        priceValue: 4.0,
        couponCode: "SOULFIRE",
        couponDiscount: "5% off",
      },
    },
  },
  {
    slug: "zzxgp",
    name: "ZZXGP",
    logo: "/accounts/zzxgp.png",
    url: "https://zzxgp.me",
    websiteUrl: "https://zzxgp.me",
    discordUrl: "https://discord.gg/gycmTvrfnj",
    listings: {
      "nfa-accounts": {
        testimonial:
          "Multiple tiers from budget tokens to premium cookies. Good entry point for new users.",
        badges: ["instant-delivery", "bulk-discount"],
        price: "5-12¢",
        priceValue: 0.05,
      },
      "mfa-accounts": {
        testimonial:
          "Cheap MFA accounts. Note: likely Hypixel banned and may have higher pullback rates.",
        badges: ["instant-delivery", "soulfire-compatible"],
        price: "$4.50",
        priceValue: 4.5,
      },
    },
  },
  {
    slug: "yyy",
    name: "YYY",
    logo: "/accounts/yyy.png",
    url: "https://discord.gg/rmxayvwc5K",
    listings: {
      "nfa-accounts": {
        testimonial:
          "Cookie and token accounts with their own delivery platform.",
        badges: ["high-quality", "instant-delivery"],
        price: "12¢",
        priceValue: 0.12,
      },
    },
  },
  {
    slug: "mog-alts",
    name: "Mog Alts",
    logo: "/accounts/mogalts.png",
    url: "https://mogalts.win",
    websiteUrl: "https://mogalts.win",
    discordUrl: "https://discord.gg/mogalts",
    listings: {
      "nfa-accounts": {
        testimonial:
          "Cheap token accounts starting at 5¢. No frills, just alts.",
        badges: ["instant-delivery", "bulk-discount"],
        price: "5¢",
        priceValue: 0.05,
      },
    },
  },
  {
    slug: "localts",
    name: "Localts",
    logo: "/accounts/luma.png",
    url: "https://localts.store",
    websiteUrl: "https://localts.store",
    discordUrl: "https://discord.gg/B4xkxHwmd4",
    listings: {
      "nfa-accounts": {
        testimonial:
          "Higher price point, but accounts are known to last longer. Quality over quantity.",
        badges: ["high-quality", "lifetime-warranty"],
        price: "25¢",
        priceValue: 0.25,
      },
    },
  },
  {
    slug: "less-unbanned",
    name: "Less | Unbanned",
    logo: "/accounts/lessunbanned.png",
    url: "https://discord.gg/teMqsB3PYG",
    listings: {
      "nfa-accounts": {
        testimonial:
          "Sells unbanned accounts specifically. Useful if you need clean accounts with no existing bans.",
        badges: ["instant-delivery"],
        price: "5¢",
        priceValue: 0.05,
      },
    },
  },
  {
    slug: "brano",
    name: "Brano",
    logo: "/accounts/brano.png",
    url: "https://discord.gg/EsbhHkm9e4",
    listings: {
      "mfa-accounts": {
        testimonial:
          "OG usernames, Minecon capes, and rare collectible accounts. Premium pricing for exclusive items.",
        badges: ["high-quality", "lifetime-warranty", "soulfire-compatible"],
        price: "$50.00+",
        priceValue: 50.0,
      },
    },
  },
];

export function getShopBySlug(slug: string): Shop | undefined {
  return SHOPS.find((shop) => shop.slug === slug);
}

export const PROVIDERS: Omit<Provider, "discordInvite">[] = (
  ["nfa-accounts", "mfa-accounts"] as const
).flatMap((category) =>
  SHOPS.flatMap((shop) => {
    const listing = shop.listings[category];
    if (!listing) return [];
    return [
      {
        slug: shop.slug,
        name: shop.name,
        logo: shop.logo,
        logoUnoptimized: shop.logoUnoptimized,
        url: shop.url,
        websiteUrl: shop.websiteUrl,
        discordUrl: shop.discordUrl,
        category,
        ...listing,
      },
    ];
  }),
);
