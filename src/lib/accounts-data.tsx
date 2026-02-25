import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Gift,
  Package,
  Shield,
  Star,
  ThumbsUp,
  Zap,
} from "lucide-react";
import { extractInviteCode } from "@/lib/discord";

export type Badge =
  | "free"
  | "high-quality"
  | "instant-delivery"
  | "lifetime-warranty"
  | "12h-warranty"
  | "bulk-discount";

export type Category = "nfa-accounts" | "mfa-accounts";

export type SortOption = "default" | "price-asc" | "price-desc";

export type Listing = {
  testimonial: string;
  badges: Badge[];
  price: string;
  priceValue: number;
  couponCode?: string;
  couponDiscount?: string;
  priceDetails?: string;
};

export type Shop = {
  slug: string;
  name: string;
  logo?: string;
  logoUnoptimized?: boolean;
  url: string;
  websiteUrl?: string;
  discordUrl?: string;
  trustpilotUrl?: string;
  startDate?: string;
  testimonials?: { quote: string; author: string }[];
  gallery?: { src: string; alt: string }[];
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
  trustpilotUrl?: string;
  startDate?: string;
  testimonials?: { quote: string; author: string }[];
  gallery?: { src: string; alt: string }[];
  badges: Badge[];
  category: Category;
  price: string;
  priceValue: number;
  couponCode?: string;
  couponDiscount?: string;
  priceDetails?: string;
};

export function extractDiscordInviteCode(provider: Provider): string | null {
  const discordLink = provider.discordUrl ?? provider.url;
  return discordLink.includes("discord.gg")
    ? extractInviteCode(discordLink)
    : null;
}

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
    label: "Fair Warranty",
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
  default: {
    label: "Most Upvoted",
    icon: <ThumbsUp className="h-3 w-3" />,
  },
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
  "high-quality",
  "instant-delivery",
  "lifetime-warranty",
  "bulk-discount",
];

export const FILTER_CATEGORIES: Category[] = ["mfa-accounts", "nfa-accounts"];

export const SORT_OPTIONS: SortOption[] = [
  "default",
  "price-asc",
  "price-desc",
];

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
    trustpilotUrl: "https://trustpilot.com/review/ravealts.com",
    startDate: "Jul 2025",
    testimonials: [
      {
        quote:
          "Their alts are good quality and they have amazing support. Once I contacted support and they responded in less than a minute. Their services are really cheap. They are constantly running giveaways and ways to get free items. 10/10 would recommend!",
        author: "mindcrafter",
      },
      {
        quote:
          "Great alts, and their best quality: their customer support, they were amazing at helping with very fast response time. I had an issue getting my 500 credits, but they helped me, and I got them.",
        author: "stormcph",
      },
      {
        quote:
          "Ravealts offered me a great experience in buying alt accounts, their service is stupidly fast and their support is one of the best I've seen in years.",
        author: "Miguel Lopez Falcon",
      },
      {
        quote:
          "Cookie alt has lasted me a whole month and I haven't gotten banned.",
        author: "jhyjjgy",
      },
    ],
    listings: {
      "nfa-accounts": {
        testimonial:
          "Hypixel, DonutSMP, cookie logs, session tokens and more. All accounts are prechecked before delivery. Partnered with Rise Client and AutoMint MM. Also has a Dispenser (gen) subscription for daily bulk generation.",
        badges: ["high-quality", "instant-delivery", "bulk-discount"],
        price: "10-15¢",
        priceValue: 0.1,
        couponCode: "SOULFIRE",
        couponDiscount: "10% off",
        priceDetails:
          "10-15¢ per account. Dispenser keys for daily generation: $14.99/mo, $10/mo (3mo), $8.33/mo (6mo), $5.83/mo (1yr). Invalid accounts auto-refunded.",
      },
      "mfa-accounts": {
        testimonial:
          "Permanent accounts with full access. Change email, password and username. Also sells Microsoft/Xbox accounts with Game Pass and Bedrock. Accepts crypto, card, Klarna and more.",
        badges: ["high-quality", "lifetime-warranty"],
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
    startDate: "Nov 2025",
    listings: {
      "mfa-accounts": {
        testimonial:
          "Full access accounts that work well as mains or long-term alts. Over 100 accounts sold since launch.",
        badges: [
          "high-quality",
          "instant-delivery",
          "12h-warranty",
        ],
        price: "$5.00",
        priceValue: 4.5,
        couponCode: "SOULFIRE",
        couponDiscount: "5% off",
      },
    },
  },
  {
    slug: "mori",
    name: "mori's alternative world",
    logo: "/accounts/mori.png",
    url: "https://discord.gg/logs",
    startDate: "Dec 2025",
    gallery: [
      {
        src: "/accounts/gallery/mori-account-listing.png",
        alt: "Account listing with Hypixel, DonutSMP and CubeCraft status checks",
      },
      {
        src: "/accounts/gallery/mori-statistics.png",
        alt: "Statistics showing 489+ alternatives, 174 Hypixel unbanned and 281 premium users",
      },
      {
        src: "/accounts/gallery/mori-growth.png",
        alt: "Discord growth chart showing steady member joins since launch",
      },
    ],
    listings: {
      "nfa-accounts": {
        testimonial:
          "Free accounts with Hypixel, DonutSMP and CubeCraft status checks. Premium tier also free. Nothing is sold, runs on occasional Linkvertise links. Up to 75 accounts per day with hourly restocks.",
        badges: ["free", "instant-delivery"],
        price: "Free",
        priceValue: 0,
        priceDetails:
          "Grab accounts from #alternatives for free. Optional premium channel (also free via a short Linkvertise link) gives 24h access to Hypixel ranked accounts and DonutSMP accounts with extra money/playtime.",
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
        badges: [
          "instant-delivery",
          "lifetime-warranty",
        ],
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
        badges: ["instant-delivery"],
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
    slug: "skycron",
    name: "Skycron",
    logo: "/accounts/skycron.png",
    url: "https://discord.gg/5sZNDb4UMy",
    websiteUrl: "https://skycron-gen.sellhub.cx/product/Gen-access/",
    discordUrl: "https://discord.gg/5sZNDb4UMy",
    startDate: "Feb 2026",
    testimonials: [
      {
        quote:
          "This is just so good man because you literally get free alts, I spent $20 on lifetime and never need to buy an alt again. W service!",
        author: "Jet",
      },
      {
        quote: "Best Gen and good quality products. Best Gen.",
        author: "CraftyJuli",
      },
      {
        quote: "Very responsive support and good quality products.",
        author: "thecrocraft",
      },
      {
        quote:
          "Best alt Shop/Gen, first customer, would never buy somewhere else. Skycron on top.",
        author: "Cupcake",
      },
    ],
    listings: {
      "nfa-accounts": {
        testimonial:
          "NFA generator with a web dashboard. Hypixel unbanned, DonutSMP unbanned, Nitro and banned alts. Short cooldowns (2 min banned, 4 min unbanned).",
        badges: ["instant-delivery"],
        price: "Subscription",
        priceValue: 0,
        couponCode: "SOULFIRE",
        couponDiscount: "5% off",
        priceDetails:
          "One-time key for lifetime dashboard access. One account at a time with short cooldowns (2 min banned, 4 min unbanned).",
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
        badges: ["high-quality", "lifetime-warranty"],
        price: "$50.00+",
        priceValue: 50.0,
      },
    },
  },
];

export function getShopBySlug(slug: string): Shop | undefined {
  return SHOPS.find((shop) => shop.slug === slug);
}

export const PROVIDERS: Provider[] = (
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
        trustpilotUrl: shop.trustpilotUrl,
        startDate: shop.startDate,
        testimonials: shop.testimonials,
        gallery: shop.gallery,
        category,
        ...listing,
      },
    ];
  }),
);
