import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Code,
  Download,
  ExternalLink,
  User,
} from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type {
  BreadcrumbList,
  SoftwareApplication,
  WithContext,
} from "schema-dts";
import { GallerySection } from "@/app/(home)/components/gallery-section";
import { TestimonialsSection } from "@/app/(home)/components/testimonials-section";
import { DetailUpvote } from "@/components/detail-upvote";
import { JsonLd } from "@/components/json-ld";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { imageMetadata } from "@/lib/metadata";
import {
  BADGE_CONFIG,
  type Badge,
  getResourceBySlug,
  RESOURCES,
  type Resource,
} from "@/lib/resources-data";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return RESOURCES.map((resource) => ({ slug: resource.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const resource = getResourceBySlug(params.slug);
  if (!resource) notFound();

  return {
    title: `${resource.name} - SoulFire ${resource.category === "plugin" ? "Plugin" : "Script"}`,
    description: resource.description,
    alternates: {
      canonical: "./",
    },
    ...imageMetadata(resource.logo),
  };
}

function ResourceLogo({ resource }: { resource: Resource }) {
  if (resource.logo) {
    return (
      <Image
        src={resource.logo}
        alt={`${resource.name} logo`}
        fill
        className="object-contain p-3"
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

export default async function ResourceDetailPage(props: {
  params: Promise<{ slug: string }>;
}) {
  "use cache";
  cacheLife("hours");

  const params = await props.params;
  const resource = getResourceBySlug(params.slug);
  if (!resource) notFound();

  const softwareJsonLd: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: resource.name,
    description: resource.description,
    applicationCategory: resource.category === "plugin" ? "Plugin" : "Script",
    author: { "@type": "Person", name: resource.author },
    ...(resource.version && { softwareVersion: resource.version }),
    ...(resource.startDate && { dateCreated: resource.startDate }),
    image: resource.logo
      ? `https://soulfiremc.com${resource.logo}`
      : "https://soulfiremc.com/logo.png",
    url: resource.url,
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://soulfiremc.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Resources",
        item: "https://soulfiremc.com/resources",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: resource.name,
        item: `https://soulfiremc.com/resources/${resource.slug}`,
      },
    ],
  };

  return (
    <main className="px-4 py-12 w-full max-w-5xl mx-auto space-y-8">
      <JsonLd data={softwareJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href="/resources"
          className="hover:text-foreground transition-colors"
        >
          Resources
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground truncate">{resource.name}</span>
      </nav>

      {/* Main content card */}
      <Card className="p-6 gap-5">
        <div className="flex flex-col sm:flex-row gap-6">
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
              {resource.version && (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Code className="h-3.5 w-3.5" />v{resource.version}
                </span>
              )}
              {resource.startDate && (
                <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  Since {resource.startDate}
                </span>
              )}
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
              {resource.sourceUrl && (
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
              )}
              <DetailUpvote itemType="resource" slug={resource.slug} />
            </div>
          </div>
        </div>
      </Card>

      {/* Testimonials */}
      {resource.testimonials && resource.testimonials.length > 0 && (
        <TestimonialsSection testimonials={resource.testimonials} />
      )}

      {/* Gallery */}
      {resource.gallery && resource.gallery.length > 0 && (
        <GallerySection images={resource.gallery} />
      )}

      {/* Back link */}
      <Link
        href="/resources"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Browse all resources
      </Link>
    </main>
  );
}
