"use client";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  BookOpen,
  Check,
  ExternalLink,
  Filter,
  Gift,
  Globe,
  Package,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CouponCode } from "../get-proxies/coupon-code";
import { accountsSearchParams } from "./search-params";

type Badge =
  | "free"
  | "high-quality"
  | "instant-delivery"
  | "lifetime-warranty"
  | "bulk-discount"
  | "soulfire-compatible";

type Category = "token-accounts" | "mfa-accounts";

type SortOption = "default" | "price-asc" | "price-desc";

export type Provider = {
  name: string;
  logo?: string;
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
};

type Props = {
  providers: Provider[];
  discordBadges: Record<string, React.ReactNode>;
};

const BADGE_CONFIG: Record<
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
  "bulk-discount": {
    label: "Bulk Discount",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    description:
      "Significant discounts available when purchasing accounts in bulk quantities.",
    icon: <Package className="h-3 w-3" />,
  },
};

const CATEGORY_CONFIG: Record<
  Category,
  { label: string; description: string }
> = {
  "token-accounts": {
    label: "Token/Cookie Accounts",
    description: "Temporary accounts - budget to premium tiers",
  },
  "mfa-accounts": {
    label: "MFA Accounts",
    description: "Full access permanent accounts you own forever",
  },
};

const SORT_CONFIG: Record<
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

const FILTER_BADGES: Badge[] = [
  "free",
  "soulfire-compatible",
  "high-quality",
  "instant-delivery",
  "lifetime-warranty",
  "bulk-discount",
];

const FILTER_CATEGORIES: Category[] = ["mfa-accounts", "token-accounts"];

const SORT_OPTIONS: SortOption[] = ["default", "price-asc", "price-desc"];

function ProviderBadge({ badge }: { badge: Badge }) {
  const config = BADGE_CONFIG[badge];
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className={`inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
        >
          {config.icon}
          {config.label}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 text-sm">
        <p>{config.description}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

function ProviderLogo({ provider }: { provider: Provider }) {
  if (provider.logo) {
    return (
      <Image
        src={provider.logo}
        alt={`${provider.name} logo`}
        fill
        className="object-contain p-2"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-bold text-primary">
      {provider.name.charAt(0).toUpperCase()}
    </div>
  );
}

function ProviderCard({
  provider,
  discordBadge,
}: {
  provider: Provider;
  discordBadge?: React.ReactNode;
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 p-6">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ProviderLogo provider={provider} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold">{provider.name}</h3>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
              {provider.price}
            </span>
            {discordBadge}
            <div className="flex flex-wrap gap-2">
              {provider.badges.map((badge) => (
                <ProviderBadge key={badge} badge={badge} />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">{provider.testimonial}</p>
          {provider.couponCode && (
            <CouponCode
              code={provider.couponCode}
              discount={provider.couponDiscount}
            />
          )}
          <div className="flex gap-2">
            <Button asChild>
              <a
                href={provider.url}
                target="_blank"
                rel="noopener nofollow"
              >
                Get Accounts
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            {provider.websiteUrl && (
              <Button asChild variant="secondary">
                <a
                  href={provider.websiteUrl}
                  target="_blank"
                  rel="noopener nofollow"
                >
                  Website
                  <Globe className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {(provider.discordUrl ||
              provider.url.includes("discord.gg")) && (
              <Button asChild variant="secondary">
                <a
                  href={provider.discordUrl ?? provider.url}
                  target="_blank"
                  rel="noopener nofollow"
                >
                  Discord
                  <SiDiscord className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

function sortProviders(providers: Provider[], sort: SortOption): Provider[] {
  if (sort === "default") return providers;
  return [...providers].sort((a, b) =>
    sort === "price-asc"
      ? a.priceValue - b.priceValue
      : b.priceValue - a.priceValue,
  );
}

export function GetAccountsClient({ providers, discordBadges }: Props) {
  const [{ category, badges, sort }, setParams] = useQueryStates(
    accountsSearchParams,
    { shallow: false },
  );

  const toggleBadge = (badge: Badge) => {
    const newBadges = badges.includes(badge)
      ? badges.filter((b) => b !== badge)
      : [...badges, badge];
    setParams({ badges: newBadges });
  };

  const toggleCategory = (cat: Category) => {
    setParams({ category: category === cat ? null : cat });
  };

  const setSort = (newSort: SortOption) => {
    setParams({ sort: newSort });
  };

  const clearFilters = () => {
    setParams({ category: null, badges: [], sort: "default" });
  };

  const filteredProviders = useMemo(() => {
    return providers.filter((provider) => {
      const matchesCategory = category ? provider.category === category : true;
      const matchesBadges =
        badges.length === 0 ||
        badges.every((filter) => provider.badges.includes(filter));
      return matchesCategory && matchesBadges;
    });
  }, [providers, badges, category]);

  const tokenProviders = sortProviders(
    filteredProviders.filter((p) => p.category === "token-accounts"),
    sort,
  );
  const mfaProviders = sortProviders(
    filteredProviders.filter((p) => p.category === "mfa-accounts"),
    sort,
  );

  const hasActiveFilters =
    badges.length > 0 || category !== null || sort !== "default";

  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto space-y-10">
      <div className="space-y-4 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Get Minecraft Accounts
        </h1>
        <p className="text-lg text-muted-foreground">
          SoulFire works best with quality Minecraft accounts. Here are trusted
          providers we recommend for bot testing.
        </p>
        <p className="text-sm text-muted-foreground">
          <BookOpen className="inline h-4 w-4 align-text-bottom" /> For more
          information on how to use accounts with SoulFire, read the{" "}
          <Link
            href="/docs/usage/accounts"
            className="underline hover:text-foreground"
          >
            Account Guide
          </Link>
          .
        </p>
      </div>

      {/* Filter Section */}
      <div className="max-w-5xl mx-auto w-full space-y-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters:</span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground underline ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Category Filter */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Category:</span>
          <div className="flex flex-wrap gap-2">
            {FILTER_CATEGORIES.map((cat) => {
              const config = CATEGORY_CONFIG[cat];
              const isActive = category === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-offset-background ring-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Badge Filter */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Features:</span>
          <div className="flex flex-wrap gap-2">
            {FILTER_BADGES.map((badge) => {
              const config = BADGE_CONFIG[badge];
              const isActive = badges.includes(badge);
              return (
                <button
                  type="button"
                  key={badge}
                  onClick={() => toggleBadge(badge)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? `${config.className} ring-2 ring-offset-2 ring-offset-background ring-current`
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-2">
          <span className="text-xs text-muted-foreground">Sort:</span>
          <div className="flex flex-wrap gap-2">
            {SORT_OPTIONS.map((option) => {
              const config = SORT_CONFIG[option];
              const isActive = sort === option;
              return (
                <button
                  type="button"
                  key={option}
                  onClick={() => setSort(option)}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground ring-2 ring-offset-2 ring-offset-background ring-primary"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {config.icon}
                  {config.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredProviders.length === 0 ? (
        <div className="max-w-5xl mx-auto w-full">
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No providers match the selected filters. Try removing some
              filters.
            </p>
          </Card>
        </div>
      ) : (
        <>
          {/* MFA Accounts Section */}
          {mfaProviders.length > 0 && (
            <div className="max-w-5xl mx-auto w-full space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">
                  MFA Accounts (Permanent)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Full access accounts you own forever. Change email, password,
                  and username as you want.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mfaProviders.map((provider, index) => (
                  <ProviderCard
                    key={`${provider.name}-${index}`}
                    provider={provider}
                    discordBadge={discordBadges[provider.discordUrl ?? provider.url]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Token/Cookie Accounts Section */}
          {tokenProviders.length > 0 && (
            <div className="max-w-5xl mx-auto w-full space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">
                  Token/Cookie Accounts (Temporary)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Temporary accounts ranging from budget tokens to premium
                  cookies. Prices shown are per account.
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  <strong>Note:</strong> SoulFire does not currently support
                  token/cookie accounts. Only MFA accounts are supported.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {tokenProviders.map((provider, index) => (
                  <ProviderCard
                    key={`${provider.name}-${index}`}
                    provider={provider}
                    discordBadge={discordBadges[provider.discordUrl ?? provider.url]}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="border-t pt-6 max-w-5xl mx-auto text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          <strong>Source:</strong> Provider list curated from{" "}
          <a
            href="https://alts.watchdog.gay"
            target="_blank"
            rel="noopener nofollow"
            className="underline hover:text-foreground"
          >
            alts.watchdog.gay
          </a>
          . Rankings based on community feedback and value.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> We are not affiliated with any of these
          providers. Always do your own research before making purchases.
        </p>
        <p className="text-sm text-muted-foreground">
          Inaccurate information or broken links? Submit a pull request on{" "}
          <a
            href="https://github.com/AlexProgrammerDE/soulfiremc.com/edit/main/src/app/(home)/get-accounts/page.tsx"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            GitHub
          </a>{" "}
          or contact us in our{" "}
          <Link href="/discord" className="underline hover:text-foreground">
            Discord
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
