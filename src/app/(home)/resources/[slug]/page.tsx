import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Code,
  Download,
  ExternalLink,
  User,
} from "lucide-react";
import { Suspense } from "react";
import type {
  BreadcrumbList,
  SoftwareApplication,
  WebPage,
  WithContext,
} from "schema-dts";
import { GallerySection } from "@/app/(home)/components/gallery-section";
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
  type Resource,
} from "@/lib/resources-data";
import type {
  PaginatedPublicReviewRecords,
  ReviewSummary,
} from "@/lib/review-core";
import { cn } from "@/lib/utils";

export type ResourceDetailPageData = {
  breadcrumbJsonLd: WithContext<BreadcrumbList>;
  pageJsonLd: WithContext<WebPage>;
  resource: Resource;
  reviewSummary: ReviewSummary;
  softwareJsonLd: WithContext<SoftwareApplication>;
  writtenReviews: PaginatedPublicReviewRecords;
};

function ResourceLogo({ resource }: { resource: Resource }) {
  if (resource.logo) {
    return (
      <img
        src={resource.logo}
        alt={`${resource.name} logo`}
        className="size-full object-contain p-3"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-4xl font-bold text-primary">
      {resource.name.charAt(0).toUpperCase()}
    </div>
  );
}

function ResourceBadge({ badge }: { badge: Badge }) {
  const config = BADGE_CONFIG[badge];
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className={cn(
            "inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
            config.className,
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

export default function ResourceDetailPageContent({
  breadcrumbJsonLd,
  pageJsonLd,
  resource,
  reviewSummary,
  softwareJsonLd,
  writtenReviews,
}: ResourceDetailPageData) {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-4 py-12">
      <JsonLd data={pageJsonLd} />
      <JsonLd data={softwareJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          to="/resources"
          className="transition-colors hover:text-foreground"
        >
          Resources
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{resource.name}</span>
      </nav>

      <Card className="gap-5 p-6">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
            <ResourceLogo resource={resource} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                {resource.name}
              </h1>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <User className="h-3.5 w-3.5" />
                {resource.author}
              </span>
              {resource.version ? (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Code className="h-3.5 w-3.5" />v{resource.version}
                </span>
              ) : null}
              {resource.startDate ? (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Since {resource.startDate}
                </span>
              ) : null}
            </div>
            <p className="text-lg text-muted-foreground">
              {resource.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {resource.badges.map((badge) => (
                <ResourceBadge key={badge} badge={badge} />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button asChild size="lg">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download {resource.name}
                </a>
              </Button>
              {resource.sourceUrl ? (
                <Button variant="outline" size="lg" asChild>
                  <a
                    href={resource.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Source
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              ) : null}
              <ReviewSummaryBadge summary={reviewSummary} />
            </div>
          </div>
        </div>
      </Card>

      <Suspense>
        <ItemReviewsSection
          itemType="resource"
          slug={resource.slug}
          initialSummary={reviewSummary}
          initialWrittenReviews={writtenReviews}
        />
      </Suspense>

      {resource.gallery && resource.gallery.length > 0 ? (
        <GallerySection images={resource.gallery} />
      ) : null}

      <Link
        to="/resources"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Browse all resources
      </Link>
    </main>
  );
}
