"use client";

import { BookOpen, ExternalLink, Filter, Heart, Info } from "lucide-react";
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
import { CouponCode } from "./coupon-code";
import { type BADGES, proxiesSearchParams } from "./search-params";

type FilterableBadge = (typeof BADGES)[number];

type Badge = FilterableBadge | "sponsor";

export type Provider = {
  name: string;
  logo?: string;
  testimonial: string;
  url: string;
  badges: Badge[];
  sponsor?: boolean;
  couponCode?: string;
  couponDiscount?: string;
};

const BADGE_CONFIG: Record<
  Badge,
  { label: string; className: string; description: string }
> = {
  "free-tier": {
    label: "Free Tier",
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
    description:
      "This provider offers a free tier, allowing you to test their service before committing to a paid plan.",
  },
  "high-quality": {
    label: "High Quality",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    description:
      "Premium proxies with high reliability, fast speeds, and excellent uptime. Best for demanding use cases.",
  },
  residential: {
    label: "Residential",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    description:
      "Real residential IP addresses from ISPs. Harder to detect and block, ideal for realistic testing scenarios.",
  },
  datacenter: {
    label: "Datacenter",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    description:
      "Fast and affordable proxies from data centers. Great for high-volume testing where speed matters most.",
  },
  "unlimited-bandwidth": {
    label: "Unlimited Bandwidth",
    className: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    description:
      "No data caps or bandwidth limits. Perfect for extensive bot testing without worrying about usage.",
  },
  sponsor: {
    label: "Sponsor",
    className: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    description:
      "This provider sponsors SoulFire monthly, helping fund the development of the project.",
  },
  "budget-friendly": {
    label: "Budget Friendly",
    className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    description:
      "Affordable pricing with good value for money. Great for smaller projects or those on a tight budget.",
  },
  enterprise: {
    label: "Enterprise",
    className: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    description:
      "Enterprise-grade solution with advanced features, compliance certifications, and dedicated support.",
  },
  isp: {
    label: "ISP",
    className: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    description:
      "Static ISP proxies that combine datacenter speed with residential trust levels.",
  },
  mobile: {
    label: "Mobile",
    className: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    description:
      "Mobile carrier IP addresses. Highest trust level, ideal for mobile app testing.",
  },
};

// Filterable badges (excluding sponsor)
const FILTER_BADGES: FilterableBadge[] = [
  "residential",
  "datacenter",
  "isp",
  "mobile",
  "free-tier",
  "unlimited-bandwidth",
  "budget-friendly",
  "enterprise",
  "high-quality",
];

function ProviderBadge({ badge }: { badge: Badge }) {
  const config = BADGE_CONFIG[badge];
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className={`inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
        >
          {badge === "sponsor" && <Heart className="h-3 w-3 fill-current" />}
          {config.label}
          <Info className="h-3 w-3 opacity-60" />
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

function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Card
      className={`transition-all duration-300 hover:shadow-lg ${
        provider.sponsor
          ? "ring-2 ring-pink-500/50 bg-gradient-to-r from-pink-500/5 to-purple-500/5"
          : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-6">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ProviderLogo provider={provider} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold">{provider.name}</h3>
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
          <Button asChild>
            <a
              href={provider.url}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              Get Proxies
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function GetProxiesClient({ providers }: { providers: Provider[] }) {
  const [{ badges }, setParams] = useQueryStates(proxiesSearchParams, {
    shallow: false,
  });

  const toggleFilter = (badge: FilterableBadge) => {
    const newBadges = badges.includes(badge)
      ? badges.filter((b) => b !== badge)
      : [...badges, badge];
    setParams({ badges: newBadges });
  };

  const clearFilters = () => {
    setParams({ badges: [] });
  };

  const filteredProviders = useMemo(() => {
    // Sponsors always first (in their original order)
    const sponsors = providers.filter((p) => p.sponsor);
    const nonSponsors = providers.filter((p) => !p.sponsor);

    const filtered =
      badges.length === 0
        ? nonSponsors
        : nonSponsors.filter((provider) =>
            badges.every((filter) => provider.badges.includes(filter)),
          );

    return [...sponsors, ...filtered];
  }, [providers, badges]);

  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto space-y-10">
      <div className="space-y-4 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Get Proxies
        </h1>
        <p className="text-lg text-muted-foreground">
          High-quality proxies help distribute your load tests and avoid rate
          limits. Here are trusted providers we recommend.
        </p>
        <p className="text-sm text-muted-foreground">
          <BookOpen className="inline h-4 w-4 align-text-bottom" /> For more
          information on how to use proxies with SoulFire, read the{" "}
          <Link
            href="/docs/usage/proxies"
            className="underline hover:text-foreground"
          >
            Proxy Guide
          </Link>
          .
        </p>
      </div>

      {/* Filter Section */}
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter by type:</span>
          {badges.length > 0 && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-muted-foreground hover:text-foreground underline ml-auto"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTER_BADGES.map((badge) => {
            const config = BADGE_CONFIG[badge];
            const isActive = badges.includes(badge);
            return (
              <button
                type="button"
                key={badge}
                onClick={() => toggleFilter(badge)}
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

      <div className="max-w-5xl mx-auto w-full">
        {filteredProviders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No providers match the selected filters. Try removing some
              filters.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.name} provider={provider} />
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-6 max-w-5xl mx-auto text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          <strong>Disclosure:</strong> This page contains affiliate links. When
          you purchase through these links, we may earn a commission at no extra
          cost to you. These commissions help fund the development of SoulFire.
        </p>
        <p className="text-sm text-muted-foreground">
          Inaccurate information or broken links? Submit a pull request on{" "}
          <a
            href="https://github.com/AlexProgrammerDE/soulfiremc.com/edit/main/src/app/(home)/get-proxies/page.tsx"
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
