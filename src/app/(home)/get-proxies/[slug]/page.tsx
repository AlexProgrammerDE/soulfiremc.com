import {
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  Heart,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BreadcrumbList, Product, WithContext } from "schema-dts";
import { cacheLife } from "next/cache";
import { CouponCode } from "@/app/(home)/get-proxies/coupon-code";
import { JsonLd } from "@/components/json-ld";
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
  type Provider,
  PROVIDERS,
  SPONSOR_THEMES,
  getProviderBySlug,
} from "@/lib/proxies-data";

export function generateStaticParams() {
  return PROVIDERS.map((provider) => ({ slug: provider.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const provider = getProviderBySlug(params.slug);
  if (!provider) notFound();

  return {
    title: `${provider.name} - Proxy Provider for SoulFire`,
    description: provider.testimonial,
    alternates: {
      canonical: "./",
    },
  };
}

function ProviderLogo({ provider }: { provider: Provider }) {
  if (provider.logo) {
    return (
      <Image
        src={provider.logo}
        alt={`${provider.name} logo`}
        fill
        className="object-contain p-3"
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
          className={`inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${classNameOverride ?? config.className}`}
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

export default async function ProxyProviderPage(props: {
  params: Promise<{ slug: string }>;
}) {
  "use cache";
  cacheLife("hours");

  const params = await props.params;
  const provider = getProviderBySlug(params.slug);
  if (!provider) notFound();

  const theme = provider.sponsorTheme
    ? SPONSOR_THEMES[provider.sponsorTheme]
    : undefined;

  const productJsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: provider.name,
    description: provider.testimonial,
    image: provider.logo
      ? `https://soulfiremc.com${provider.logo}`
      : "https://soulfiremc.com/logo.png",
    brand: {
      "@type": "Brand",
      name: provider.name,
    },
    category: "Proxy Service",
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
        name: "Get Proxies",
        item: "https://soulfiremc.com/get-proxies",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: provider.name,
        item: `https://soulfiremc.com/get-proxies/${provider.slug}`,
      },
    ],
  };

  return (
    <main className="px-4 py-12 w-full max-w-5xl mx-auto space-y-8">
      <JsonLd data={productJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href="/get-proxies"
          className="hover:text-foreground transition-colors"
        >
          Get Proxies
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground truncate">{provider.name}</span>
      </nav>

      {/* Main content card */}
      <Card
        className={`p-6 space-y-5 ${
          theme ? `ring-2 ${theme.ring} ${theme.bg}` : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row gap-6">
          <div
            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted ${
              theme ? `ring-2 ${theme.ring}` : ""
            }`}
          >
            <ProviderLogo provider={provider} />
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                {provider.name}
              </h1>
              {provider.sponsor && (
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
                    theme?.badge ??
                    "bg-pink-500/10 text-pink-600 dark:text-pink-400"
                  }`}
                >
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  Sponsor
                </span>
              )}
            </div>
            <p className="text-lg text-muted-foreground">
              {provider.testimonial}
            </p>
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
            {provider.couponCode && (
              <CouponCode
                code={provider.couponCode}
                discount={provider.couponDiscount}
              />
            )}
            <Button asChild size="lg">
              <a
                href={provider.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                Get Proxies from {provider.name}
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Back link */}
      <Link
        href="/get-proxies"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Compare all providers
      </Link>
    </main>
  );
}
