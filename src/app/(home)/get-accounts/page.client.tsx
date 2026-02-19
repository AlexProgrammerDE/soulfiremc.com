"use client";

import { SiDiscord } from "@icons-pack/react-simple-icons";
import {
  BookOpen,
  ExternalLink,
  Filter,
  Globe,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { DiscordMemberBadge } from "@/app/(home)/get-accounts/discord-badge";
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
  type Badge,
  BADGE_CONFIG,
  type Category,
  CATEGORY_CONFIG,
  FILTER_BADGES,
  FILTER_CATEGORIES,
  type Provider,
  SORT_CONFIG,
  SORT_OPTIONS,
  type SortOption,
} from "@/lib/accounts-data";
import { CouponCode } from "../get-proxies/coupon-code";
import { accountsSearchParams } from "./search-params";

type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

type Props = {
  providers: Provider[];
  faqItems: FaqItem[];
};

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
        unoptimized={provider.logoUnoptimized}
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
    <Card className="transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 p-6">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ProviderLogo provider={provider} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold">
              <Link
                href={`/get-accounts/${provider.slug}`}
                className="hover:underline"
              >
                {provider.name}
              </Link>
            </h3>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
              {provider.price}
            </span>
            <DiscordMemberBadge info={provider.discordInvite} />
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
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={provider.url} target="_blank" rel="noopener nofollow">
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
            {(provider.discordUrl || provider.url.includes("discord.gg")) && (
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

export function GetAccountsClient(props: Props) {
  const { providers, faqItems } = props;
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

  const nfaProviders = sortProviders(
    filteredProviders.filter((p) => p.category === "nfa-accounts"),
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
                  />
                ))}
              </div>
            </div>
          )}

          {/* NFA Accounts Section */}
          {nfaProviders.length > 0 && (
            <div className="max-w-5xl mx-auto w-full space-y-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-semibold">
                  NFA Accounts (Temporary)
                </h2>
                <p className="text-sm text-muted-foreground">
                  Temporary accounts that may stop working over time. Prices
                  shown are per account.
                </p>
                <p className="text-sm text-yellow-600 dark:text-yellow-500">
                  <strong>Note:</strong> SoulFire does not support cookie/access
                  token auth. However, SoulFire does support refresh token auth.
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {nfaProviders.map((provider, index) => (
                  <ProviderCard
                    key={`${provider.name}-${index}`}
                    provider={provider}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto w-full space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground">
            Common questions about Minecraft accounts
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, i) => (
            <AccordionItem key={item.question} value={`faq-${i}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

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
            href="https://github.com/AlexProgrammerDE/soulfiremc.com/edit/main/src/lib/accounts-data.tsx"
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
