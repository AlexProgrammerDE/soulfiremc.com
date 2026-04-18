import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  ExternalLink,
  Heart,
} from "lucide-react";
import { Suspense } from "react";
import type {
  BreadcrumbList,
  ImageObject,
  Product,
  WebPage,
  WithContext,
} from "schema-dts";
import { GallerySection } from "@/app/(home)/components/gallery-section";
import { CouponCode } from "@/app/(home)/get-proxies/coupon-code";
import { ItemReviewsSection } from "@/components/item-reviews-section";
import { JsonLd } from "@/components/json-ld";
import { ReviewSummaryBadge } from "@/components/review-summary-badge";
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
  type Provider,
  SPONSOR_THEMES,
} from "@/lib/proxies-data";
import type {
  PaginatedPublicReviewRecords,
  ReviewSummary,
} from "@/lib/review-core";
import { cn } from "@/lib/utils";

export type ProxyDetailPageData = {
  breadcrumbJsonLd: WithContext<BreadcrumbList>;
  pageJsonLd: WithContext<WebPage>;
  productJsonLd: WithContext<Product>;
  provider: Provider;
  reviewSummary: ReviewSummary;
  writtenReviews: PaginatedPublicReviewRecords;
};

function ProviderLogo({ provider }: { provider: Provider }) {
  if (provider.logo) {
    return (
      <img
        src={provider.logo}
        alt={`${provider.name} logo`}
        className="size-full object-contain p-3"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-4xl font-bold text-primary">
      {provider.name.charAt(0).toUpperCase()}
    </div>
  );
}

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
          className={cn(
            "inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
            classNameOverride ?? config.className,
          )}
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

export default function ProxyProviderPageContent({
  breadcrumbJsonLd,
  pageJsonLd,
  productJsonLd,
  provider,
  reviewSummary,
  writtenReviews,
}: ProxyDetailPageData) {
  const theme = provider.sponsorTheme
    ? SPONSOR_THEMES[provider.sponsorTheme]
    : undefined;

  return (
    <main className="mx-auto w-full max-w-(--fd-layout-width) space-y-8 px-4 py-12">
      <JsonLd data={pageJsonLd} />
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          to="/get-proxies"
          className="transition-colors hover:text-foreground"
        >
          Get Proxies
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{provider.name}</span>
      </nav>

      <Card
        className={cn("gap-5 p-6", theme && ["ring-2", theme.ring, theme.bg])}
      >
        <div className="flex flex-col gap-6 sm:flex-row">
          <div
            className={cn(
              "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted",
              theme && ["ring-2", theme.ring],
            )}
          >
            <ProviderLogo provider={provider} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                {provider.name}
              </h1>
              {provider.startDate ? (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Since {provider.startDate}
                </span>
              ) : null}
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
            <p className="text-lg text-muted-foreground">{provider.summary}</p>
            {provider.couponCode ? (
              <CouponCode
                code={provider.couponCode}
                discount={provider.couponDiscount}
              />
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button asChild size="lg">
                <a
                  href={provider.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  Get Proxies
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <ReviewSummaryBadge summary={reviewSummary} />
            </div>
          </div>
        </div>
      </Card>

      <Suspense>
        <ItemReviewsSection
          itemType="proxy"
          slug={provider.slug}
          initialSummary={reviewSummary}
          initialWrittenReviews={writtenReviews}
        />
      </Suspense>

      {provider.gallery && provider.gallery.length > 0 ? (
        <GallerySection images={provider.gallery} />
      ) : null}

      <Link
        to="/get-proxies"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Browse all proxy providers
      </Link>
    </main>
  );
}
