"use client";

import { BookOpen, ExternalLink, Filter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { Suspense, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { proxiesFaqItems } from "@/app/(home)/get-proxies/proxies-faq";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  BADGE_CONFIG,
  type Badge,
  FILTER_BADGES,
  type FilterableBadge,
  PROVIDERS,
  type Provider,
  SPONSOR_THEMES,
} from "@/lib/proxies-data";
import { CouponCode } from "./coupon-code";
import { proxiesSearchParams } from "./search-params";

function ProviderBadge({
  badge,
  classNameOverride,
}: {
  badge: Badge;
  classNameOverride?: string;
}) {
  const config = BADGE_CONFIG[badge];
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className={cn("inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", classNameOverride ?? config.className)}
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

function ProviderCard({ provider }: { provider: Provider }) {
  const theme = provider.sponsorTheme
    ? SPONSOR_THEMES[provider.sponsorTheme]
    : undefined;

  return (
    <Card
      className={cn("transition-all duration-300 hover:shadow-lg",
        theme && ["ring-2", theme.ring, theme.bg]
      )}
    >
      <div className="flex flex-col sm:flex-row gap-4 p-6">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ProviderLogo provider={provider} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold">
              <Link
                href={`/get-proxies/${provider.slug}`}
                className="hover:underline"
              >
                {provider.name}
              </Link>
            </h3>
            <div className="flex flex-wrap gap-2">
              {provider.badges.map((badge) => (
                <ProviderBadge
                  key={badge}
                  badge={badge}
                  classNameOverride={
                    badge === "sponsor" ? theme?.badge : undefined
                  }
                />
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

function MainContent() {
  const providers = PROVIDERS;
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
  }, [badges]);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const filterContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter by type</span>
        {badges.length > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline ml-auto"
          >
            Clear
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
              className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium outline-none transition-all",
                isActive
                  ? cn(config.className, "ring-2 ring-offset-2 ring-offset-background ring-current")
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto w-full">
      {/* Mobile filter toggle */}
      <button
        type="button"
        onClick={() => setFiltersOpen(!filtersOpen)}
        className="lg:hidden inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors self-start"
      >
        <Filter className="h-4 w-4" />
        Filters
        {badges.length > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
            {badges.length}
          </span>
        )}
      </button>

      {/* Mobile filter panel */}
      {filtersOpen && (
        <div className="lg:hidden rounded-lg border p-4">{filterContent}</div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block lg:w-56 lg:shrink-0">
        <div className="lg:sticky lg:top-20 lg:self-start">{filterContent}</div>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        {filteredProviders.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              No providers match the selected filters. Try removing some
              filters.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredProviders.map((provider) => (
              <ProviderCard key={provider.name} provider={provider} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function GetProxiesClient() {
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

      <Suspense>
        <MainContent />
      </Suspense>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto w-full space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground">
            Common questions about proxies for SoulFire
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {proxiesFaqItems.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answerElement}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
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
            href="https://github.com/AlexProgrammerDE/soulfiremc.com/edit/main/src/lib/proxies-data.tsx"
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
