import {
  SiDiscord,
  SiTelegram,
  SiTiktok,
  SiTrustpilot,
  SiX,
  SiYoutube,
} from "@icons-pack/react-simple-icons";
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
  WithContext,
} from "schema-dts";
import { GallerySection } from "@/app/(home)/components/gallery-section";
import { PriceInfoBadge } from "@/app/(home)/components/price-info-badge";
import { DiscordMemberBadge } from "@/app/(home)/get-accounts/discord-badge";
import {
  CouponCode,
  LinkDiscountNotice,
} from "@/app/(home)/get-proxies/coupon-code";
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
  CATEGORY_CONFIG,
  type Category,
  getDiscordInviteUrl,
  getShopBySlug,
  PROVIDER_THEMES,
  SHOPS,
  type Shop,
  type SocialLink,
} from "@/lib/accounts-data";
import { type DiscordInviteResponse, fetchDiscordInvite } from "@/lib/discord";
import { imageMetadata } from "@/lib/metadata";
import { getAccountPageImage } from "@/lib/og";
import {
  emptyReviewSummary,
  getAggregateRatingJsonLd,
  getPaginatedWrittenReviews,
  getReviewJsonLd,
  getReviewSummaries,
} from "@/lib/reviews";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return SHOPS.map((shop) => ({ slug: shop.slug }));
}

function describeCategory(category: Category): string {
  return category === "mfa-accounts"
    ? "MFA full-access accounts"
    : "NFA temporary accounts";
}

function joinPhrases(phrases: string[]): string {
  if (phrases.length <= 1) {
    return phrases[0] ?? "";
  }

  if (phrases.length === 2) {
    return `${phrases[0]} and ${phrases[1]}`;
  }

  return `${phrases.slice(0, -1).join(", ")}, and ${phrases.at(-1)}`;
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const shop = getShopBySlug(params.slug);
  if (!shop) notFound();

  const categories = Object.keys(shop.listings) as Category[];
  const categorySummary = joinPhrases(categories.map(describeCategory));
  const firstListing = Object.values(shop.listings)[0];
  const description =
    firstListing?.summary ??
    `${shop.name} is a Minecraft alt shop offering ${categorySummary}. Compare prices, delivery, and account formats for SoulFire.`;

  return {
    title: `${shop.name} | Minecraft Alt Shop`,
    description,
    keywords: [
      shop.name,
      "minecraft alt shop",
      "minecraft accounts",
      "minecraft alts",
      ...categories.map(describeCategory),
    ],
    alternates: {
      canonical: "./",
    },
    ...imageMetadata(getAccountPageImage(shop.slug).url),
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

function ProviderThemeDecoration() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div className="absolute -right-12 -top-14 h-36 w-36 rounded-full bg-rose-500/18 blur-3xl dark:bg-rose-400/18" />
      <div className="absolute -bottom-10 left-6 h-28 w-28 rounded-full bg-orange-400/18 blur-2xl dark:bg-orange-300/12" />
    </div>
  );
}

function SocialLinkButtons({
  socialLinks,
  className,
}: {
  socialLinks?: SocialLink[];
  className?: string;
}) {
  if (!socialLinks?.length) {
    return null;
  }

  const icons = {
    youtube: SiYoutube,
    tiktok: SiTiktok,
    telegram: SiTelegram,
    x: SiX,
  } as const;

  const labels = {
    youtube: "YouTube",
    tiktok: "TikTok",
    telegram: "Telegram",
    x: "X",
  } as const;

  return (
    <>
      {socialLinks.map((socialLink) => {
        const Icon = icons[socialLink.platform];
        return (
          <Button
            key={`${socialLink.platform}-${socialLink.url}`}
            asChild
            variant="secondary"
            size="icon-sm"
            className={className}
          >
            <a
              href={socialLink.url}
              target="_blank"
              rel="noopener nofollow"
              aria-label={labels[socialLink.platform]}
              title={labels[socialLink.platform]}
            >
              <Icon className="h-4 w-4" />
            </a>
          </Button>
        );
      })}
    </>
  );
}

export default async function AccountProviderPage(props: {
  params: Promise<{ slug: string }>;
}) {
  "use cache";
  cacheLife("hours");

  const params = await props.params;
  const slug = params.slug;
  const shop = getShopBySlug(slug);
  if (!shop) notFound();

  const categories = Object.entries(shop.listings) as [
    Category,
    NonNullable<Shop["listings"][Category]>,
  ][];
  const categorySummary = joinPhrases(
    categories.map(([category]) => describeCategory(category)),
  );
  const seoSummary = `${shop.name} is a Minecraft alt shop offering ${categorySummary} for SoulFire bot testing.`;
  const theme = shop.theme ? PROVIDER_THEMES[shop.theme] : undefined;
  const hasAffiliate = categories.some(([, listing]) =>
    listing.badges.includes("affiliate"),
  );
  const reviewSummaries = await getReviewSummaries("account", [shop.slug]);
  const reviewSummary = reviewSummaries[shop.slug] ?? emptyReviewSummary();
  const writtenReviews = await getPaginatedWrittenReviews(
    "account",
    shop.slug,
    reviewSummary.reviewCount,
    { page: 1 },
  );

  const discordInviteUrl = getDiscordInviteUrl(shop);
  const hasDiscord = Boolean(discordInviteUrl);
  const discordInvitePromise = discordInviteUrl
    ? fetchDiscordInvite(discordInviteUrl)
    : null;

  const productJsonLd: WithContext<Product> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: shop.name,
    description:
      Object.values(shop.listings)[0]?.summary ??
      `${shop.name} Minecraft accounts`,
    image: shop.logo
      ? `https://soulfiremc.com${shop.logo}`
      : "https://soulfiremc.com/logo.png",
    brand: {
      "@type": "Brand",
      name: shop.name,
    },
    url: `https://soulfiremc.com/get-accounts/${shop.slug}`,
    category: "Minecraft Accounts",
    ...(shop.startDate && { dateCreated: shop.startDate }),
    ...(getAggregateRatingJsonLd(reviewSummary) && {
      aggregateRating: getAggregateRatingJsonLd(reviewSummary),
    }),
    ...(getReviewJsonLd(writtenReviews.entries) && {
      review: getReviewJsonLd(writtenReviews.entries),
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
    <main className="px-4 py-12 w-full max-w-(--fd-layout-width) mx-auto space-y-8">
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
      {theme ? (
        <Card
          className={cn(
            "relative overflow-hidden p-6 gap-5 ring-2 shadow-[0_24px_70px_-44px_rgba(244,63,94,0.55)]",
            theme.ring,
            theme.bg,
          )}
        >
          <ProviderThemeDecoration />
          <div className="relative flex flex-col gap-6 sm:flex-row">
            <div
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted",
                theme.logo,
              )}
            >
              <ShopLogo shop={shop} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight">
                  {shop.name}
                </h1>
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
              <p className="max-w-2xl text-sm text-muted-foreground">
                {seoSummary}
              </p>
              {hasAffiliate && (
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Buy with the RaveAlts code or link below and you directly help
                  support SoulFire.
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <Button asChild className={theme.primaryButton}>
                  <a href={shop.url} target="_blank" rel="noopener nofollow">
                    Get Accounts
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                {shop.websiteUrl && (
                  <Button
                    asChild
                    variant="secondary"
                    className={theme.secondaryButton}
                  >
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
                  <Button
                    asChild
                    variant="secondary"
                    className={theme.secondaryButton}
                  >
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
                  <Button
                    asChild
                    variant="secondary"
                    className={theme.secondaryButton}
                  >
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
                <SocialLinkButtons
                  socialLinks={shop.socialLinks}
                  className={theme.secondaryButton}
                />
                <ReviewSummaryBadge
                  summary={reviewSummary}
                  className={theme.secondaryButton}
                />
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex flex-col items-start gap-6 sm:flex-row">
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
            <p className="max-w-2xl text-sm text-muted-foreground">
              {seoSummary}
            </p>
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
                    href={discordInviteUrl ?? shop.url}
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
              <SocialLinkButtons socialLinks={shop.socialLinks} />
              <ReviewSummaryBadge summary={reviewSummary} />
            </div>
          </div>
        </div>
      )}

      {/* Category Cards */}
      <div
        className={cn(
          "grid gap-6",
          categories.length > 1 ? "md:grid-cols-2" : "grid-cols-1",
        )}
      >
        {categories.map(([category, listing]) => {
          const catConfig = CATEGORY_CONFIG[category];
          return (
            <Card
              key={category}
              className={cn(
                "p-6 gap-4",
                theme && ["relative overflow-hidden border", theme.panel],
              )}
            >
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-semibold">{catConfig.label}</h2>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary",
                    theme?.price,
                  )}
                >
                  {listing.price}
                  {listing.priceDetails && (
                    <PriceInfoBadge details={listing.priceDetails} />
                  )}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {catConfig.description}
              </p>
              <p className="text-muted-foreground">{listing.summary}</p>
              <div className="flex flex-wrap gap-2">
                {listing.badges.map((badge) => (
                  <ProviderBadge
                    key={badge}
                    badge={badge}
                    classNameOverride={
                      badge === "affiliate" ? theme?.badge : undefined
                    }
                  />
                ))}
              </div>
              {listing.couponCode ? (
                <CouponCode
                  code={listing.couponCode}
                  discount={listing.couponDiscount}
                />
              ) : listing.linkDiscountMessage ? (
                <LinkDiscountNotice message={listing.linkDiscountMessage} />
              ) : null}
            </Card>
          );
        })}
      </div>

      <Suspense>
        <ItemReviewsSection
          itemType="account"
          slug={shop.slug}
          initialSummary={reviewSummary}
          initialWrittenReviews={writtenReviews}
        />
      </Suspense>

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
