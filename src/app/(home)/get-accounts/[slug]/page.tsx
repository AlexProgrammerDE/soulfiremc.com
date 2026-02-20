import { SiDiscord, SiTrustpilot } from "@icons-pack/react-simple-icons";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  ExternalLink,
  Globe,
} from "lucide-react";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import type {
  BreadcrumbList,
  ImageObject,
  Product,
  Review,
  WithContext,
} from "schema-dts";
import { GallerySection } from "@/app/(home)/components/gallery-section";
import { PriceInfoBadge } from "@/app/(home)/components/price-info-badge";
import { TestimonialsSection } from "@/app/(home)/components/testimonials-section";
import { DiscordMemberBadge } from "@/app/(home)/get-accounts/discord-badge";
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
  BADGE_CONFIG,
  type Badge,
  CATEGORY_CONFIG,
  type Category,
  getShopBySlug,
  SHOPS,
  type Shop,
} from "@/lib/accounts-data";
import {
  type DiscordInviteResponse,
  extractInviteCode,
  fetchDiscordInvite,
} from "@/lib/discord";
import { imageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return SHOPS.map((shop) => ({ slug: shop.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const shop = getShopBySlug(params.slug);
  if (!shop) notFound();

  const firstListing = Object.values(shop.listings)[0];
  const description =
    firstListing?.testimonial ??
    `${shop.name} - Minecraft account provider. Compare prices and features.`;

  return {
    title: `${shop.name} - Minecraft Account Provider`,
    description,
    alternates: {
      canonical: "./",
    },
    ...imageMetadata(shop.logo),
  };
}

function ShopLogo({ shop }: { shop: Shop }) {
  if (shop.logo) {
    return (
      <Image
        src={shop.logo}
        unoptimized={shop.logoUnoptimized}
        alt={`${shop.name} logo`}
        fill
        className="object-contain p-3"
      />
    );
  }
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-4xl font-bold text-primary">
      {shop.name.charAt(0).toUpperCase()}
    </div>
  );
}

async function DiscordMemberBadgeLoader({
  discordInvite,
}: {
  discordInvite: Promise<DiscordInviteResponse | null>;
}) {
  const info = await discordInvite;
  return <DiscordMemberBadge info={info} />;
}

function ProviderBadge({ badge }: { badge: Badge }) {
  const config = BADGE_CONFIG[badge];
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className={cn("inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium", config.className)}
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

export default async function AccountProviderPage(props: {
  params: Promise<{ slug: string }>;
}) {
  "use cache";
  cacheLife("hours");

  const params = await props.params;
  const shop = getShopBySlug(params.slug);
  if (!shop) notFound();

  const categories = Object.entries(shop.listings) as [
    Category,
    NonNullable<Shop["listings"][Category]>,
  ][];

  const discordLink = shop.discordUrl ?? shop.url;
  const hasDiscord = discordLink.includes("discord.gg");
  const discordInvitePromise = hasDiscord
    ? fetchDiscordInvite(extractInviteCode(discordLink))
    : null;

  const productJsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: shop.name,
    description:
      Object.values(shop.listings)[0]?.testimonial ??
      `${shop.name} Minecraft accounts`,
    image: shop.logo
      ? `https://soulfiremc.com${shop.logo}`
      : "https://soulfiremc.com/logo.png",
    brand: {
      "@type": "Brand",
      name: shop.name,
    },
    category: "Minecraft Accounts",
    ...(shop.startDate && { dateCreated: shop.startDate }),
    ...(shop.testimonials &&
      shop.testimonials.length > 0 && {
        review: shop.testimonials.map(
          (t): Review => ({
            "@type": "Review",
            reviewBody: t.quote,
            author: { "@type": "Person", name: t.author },
          }),
        ),
      }),
    ...(shop.gallery &&
      shop.gallery.length > 0 && {
        image: shop.gallery.map(
          (img): ImageObject => ({
            "@type": "ImageObject",
            url: `https://soulfiremc.com${img.src}`,
            name: img.alt,
          }),
        ),
      }),
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
        name: "Get Accounts",
        item: "https://soulfiremc.com/get-accounts",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: shop.name,
        item: `https://soulfiremc.com/get-accounts/${shop.slug}`,
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
          href="/get-accounts"
          className="hover:text-foreground transition-colors"
        >
          Get Accounts
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground truncate">{shop.name}</span>
      </nav>

      {/* Hero */}
      <div className="flex flex-col sm:flex-row gap-6 items-start">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
          <ShopLogo shop={shop} />
        </div>
        <div className="flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tight">{shop.name}</h1>
            {shop.startDate && (
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Since {shop.startDate}
              </span>
            )}
            {discordInvitePromise ? (
              <Suspense fallback={<DiscordMemberBadge info={null} />}>
                <DiscordMemberBadgeLoader
                  discordInvite={discordInvitePromise}
                />
              </Suspense>
            ) : (
              <DiscordMemberBadge info={null} />
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <a href={shop.url} target="_blank" rel="noopener nofollow">
                Get Accounts
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            {shop.websiteUrl && (
              <Button asChild variant="secondary">
                <a
                  href={shop.websiteUrl}
                  target="_blank"
                  rel="noopener nofollow"
                >
                  Website
                  <Globe className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {hasDiscord && (
              <Button asChild variant="secondary">
                <a
                  href={shop.discordUrl ?? shop.url}
                  target="_blank"
                  rel="noopener nofollow"
                >
                  Discord
                  <SiDiscord className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
            {shop.trustpilotUrl && (
              <Button asChild variant="secondary">
                <a
                  href={shop.trustpilotUrl}
                  target="_blank"
                  rel="noopener nofollow"
                >
                  Trustpilot
                  <SiTrustpilot className="ml-2 h-4 w-4" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div
        className={cn("grid gap-6", categories.length > 1 ? "md:grid-cols-2" : "grid-cols-1")}
      >
        {categories.map(([category, listing]) => {
          const catConfig = CATEGORY_CONFIG[category];
          return (
            <Card key={category} className="p-6 gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold">{catConfig.label}</h2>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
                  {listing.price}
                  {listing.priceDetails && (
                    <PriceInfoBadge details={listing.priceDetails} />
                  )}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {catConfig.description}
              </p>
              <p className="text-muted-foreground">{listing.testimonial}</p>
              <div className="flex flex-wrap gap-2">
                {listing.badges.map((badge) => (
                  <ProviderBadge key={badge} badge={badge} />
                ))}
              </div>
              {listing.couponCode && (
                <CouponCode
                  code={listing.couponCode}
                  discount={listing.couponDiscount}
                />
              )}
            </Card>
          );
        })}
      </div>

      {/* Testimonials */}
      {shop.testimonials && shop.testimonials.length > 0 && (
        <TestimonialsSection testimonials={shop.testimonials} />
      )}

      {/* Gallery */}
      {shop.gallery && shop.gallery.length > 0 && (
        <GallerySection images={shop.gallery} />
      )}

      {/* Back link */}
      <Link
        href="/get-accounts"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Compare all providers
      </Link>
    </main>
  );
}
