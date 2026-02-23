"use client";

import {
  BookOpen,
  Calendar,
  Code,
  Download,
  ExternalLink,
  Filter,
  ImageIcon,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { Suspense, useMemo, useState } from "react";
import { resourcesFaqItems } from "@/app/(home)/resources/resources-faq";
import { UpvoteButton } from "@/components/upvote-button";
import { useUpvotes } from "@/hooks/use-upvotes";
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
  CATEGORIES,
  type Category,
  FILTER_TAGS,
  type FilterableTag,
  RESOURCES,
  type Resource,
} from "@/lib/resources-data";
import { cn } from "@/lib/utils";
import { resourcesSearchParams } from "./search-params";

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

function ResourceLogo({ resource }: { resource: Resource }) {
  if (resource.logo) {
    return (
      <Image
        src={resource.logo}
        alt={`${resource.name} logo`}
        fill
        className="object-contain p-2"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-bold text-primary">
      {resource.name.charAt(0).toUpperCase()}
    </div>
  );
}

function ResourceCard({
  resource,
  upvoteCount,
  isUpvoted,
  upvoteLoading,
  onToggleUpvote,
}: {
  resource: Resource;
  upvoteCount: number;
  isUpvoted: boolean;
  upvoteLoading: boolean;
  onToggleUpvote: (slug: string) => Promise<{ error: "unauthorized" | null } | undefined>;
}) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 p-6">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ResourceLogo resource={resource} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold">
              <Link
                href={`/resources/${resource.slug}`}
                className="hover:underline"
              >
                {resource.name}
              </Link>
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              {resource.author}
            </span>
            {resource.version && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Code className="h-3 w-3" />v{resource.version}
              </span>
            )}
            {resource.startDate && (
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                Since {resource.startDate}
              </span>
            )}
            <div className="flex flex-wrap gap-2">
              {resource.badges.map((badge) => (
                <ResourceBadge key={badge} badge={badge} />
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">{resource.description}</p>
          {resource.gallery && resource.gallery.length > 0 && (
            <Link
              href={`/resources/${resource.slug}`}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ImageIcon className="h-3 w-3" />
              {resource.gallery.length} photo
              {resource.gallery.length !== 1 && "s"}
            </Link>
          )}
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </a>
            </Button>
            {resource.sourceUrl && (
              <Button variant="outline" asChild>
                <a
                  href={resource.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Source
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            <UpvoteButton
              slug={resource.slug}
              count={upvoteCount}
              isUpvoted={isUpvoted}
              loading={upvoteLoading}
              onToggle={onToggleUpvote}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

function MainContent() {
  const resources = RESOURCES;
  const slugs = useMemo(
    () => resources.map((r) => r.slug),
    [resources],
  );
  const {
    counts,
    userUpvotes,
    loading: upvoteLoading,
    toggleUpvote,
  } = useUpvotes("resource", slugs);
  const [{ category, tags }, setParams] = useQueryStates(
    resourcesSearchParams,
    {
      shallow: false,
    },
  );

  const toggleCategory = (cat: Category) => {
    setParams({ category: category === cat ? null : cat });
  };

  const toggleTag = (tag: FilterableTag) => {
    const newTags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setParams({ tags: newTags });
  };

  const clearFilters = () => {
    setParams({ category: null, tags: [] });
  };

  const activeFilterCount =
    tags.length + (category !== null && category !== undefined ? 1 : 0);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      if (category && resource.category !== category) return false;
      if (
        tags.length > 0 &&
        !tags.every((tag) => resource.badges.includes(tag))
      )
        return false;
      return true;
    });
  }, [category, tags]);

  const [filtersOpen, setFiltersOpen] = useState(false);

  const filterContent = (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-muted-foreground hover:text-foreground underline ml-auto"
          >
            Clear
          </button>
        )}
      </div>
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Category
        </span>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const config = BADGE_CONFIG[cat.value];
            const isActive = category === cat.value;
            return (
              <button
                type="button"
                key={cat.value}
                onClick={() => toggleCategory(cat.value)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium outline-none transition-all",
                  isActive
                    ? cn(
                        config.className,
                        "ring-2 ring-offset-2 ring-offset-background ring-current",
                      )
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Tags
        </span>
        <div className="flex flex-wrap gap-2">
          {FILTER_TAGS.map((tag) => {
            const config = BADGE_CONFIG[tag];
            const isActive = tags.includes(tag);
            return (
              <button
                type="button"
                key={tag}
                onClick={() => toggleTag(tag)}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium outline-none transition-all",
                  isActive
                    ? cn(
                        config.className,
                        "ring-2 ring-offset-2 ring-offset-background ring-current",
                      )
                    : "bg-muted text-muted-foreground hover:bg-muted/80",
                )}
              >
                {config.label}
              </button>
            );
          })}
        </div>
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
        {activeFilterCount > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-primary px-1.5 text-xs text-primary-foreground">
            {activeFilterCount}
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
        {filteredResources.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">
              {resources.length === 0
                ? "No resources have been added yet. Be the first to contribute!"
                : "No resources match the selected filters. Try removing some filters."}
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {filteredResources.map((resource) => (
              <ResourceCard
                key={resource.slug}
                resource={resource}
                upvoteCount={counts[resource.slug] ?? 0}
                isUpvoted={userUpvotes.has(resource.slug)}
                upvoteLoading={upvoteLoading}
                onToggleUpvote={toggleUpvote}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function ResourcesClient() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto space-y-10">
      <div className="space-y-4 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Resources
        </h1>
        <p className="text-lg text-muted-foreground">
          Community plugins and scripts to extend your SoulFire bots. Browse the
          registry to find tools built by the community.
        </p>
        <p className="text-sm text-muted-foreground">
          <BookOpen className="inline h-4 w-4 align-text-bottom" /> Learn how to
          create your own in the{" "}
          <Link
            href="/docs/plugins"
            className="underline hover:text-foreground"
          >
            Plugin Documentation
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
            Common questions about SoulFire plugins and scripts
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {resourcesFaqItems.map((item, i) => (
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
          Want to add your plugin or script? Submit a pull request on{" "}
          <a
            href="https://github.com/AlexProgrammerDE/soulfiremc.com/edit/main/src/lib/resources-data.tsx"
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
