import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  ExternalLink,
  Globe,
} from "lucide-react";
import { Suspense } from "react";
import { GallerySection } from "@/app/(home)/components/gallery-section";
import { DiscordMemberBadge } from "@/app/(home)/get-accounts/discord-badge";
import { CouponCode, LinkDiscountNotice } from "@/app/(home)/get-proxies/coupon-code";
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
import { SiteShell } from "@/components/site-shell";
import {
  BADGE_CONFIG,
  CATEGORY_CONFIG,
  getDiscordInviteUrl,
  getShopBySlug,
  PROVIDERS,
  PROVIDER_THEMES,
  type Badge,
  type Category,
  type SocialLink,
} from "@/lib/accounts-data";
import {
  getListingOffer,
  getLiveShopData,
  getShopAggregateOffer,
} from "@/lib/accounts-offers";
import { fetchDiscordInvite } from "@/lib/discord";
import { getAccountPageImage } from "@/lib/og";
import {
  emptyReviewSummary,
  getAggregateRatingJsonLd,
  getPaginatedWrittenReviews,
  getReviewJsonLd,
  getReviewSummaries,
} from "@/lib/reviews";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

const accountDetailLoader = createServerFn({ method: "GET" })
  .inputValidator((value: { slug: string }) => value)
  .handler(async ({ data }) => {
    const shop = getShopBySlug(data.slug);
    if (!shop) {
      throw notFound();
    }

    const providers = PROVIDERS.filter((provider) => provider.slug === shop.slug);
    const reviewSummaries = await getReviewSummaries("account", [shop.slug]).catch(
      () =>
        ({} as Record<
          string,
          { averageRating: number | null; reviewCount: number }
        >),
    );
    const reviewSummary = reviewSummaries[shop.slug] ?? emptyReviewSummary();
    const writtenReviews = await getPaginatedWrittenReviews(
      "account",
      shop.slug,
      reviewSummary.reviewCount,
      { page: 1 },
    ).catch(() => ({
      entries: [],
      page: 1,
      pageSize: 8,
      totalCount: 0,
      totalPages: 0,
    }));
    const liveShopData = await getLiveShopData(shop).catch(() => ({}));
    const discordInviteUrl = getDiscordInviteUrl(shop);
    const discordInvite = discordInviteUrl
      ? await fetchDiscordInvite(discordInviteUrl).catch(() => null)
      : null;

    const productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `https://soulfiremc.com/get-accounts/${shop.slug}#product`,
      name: shop.name,
      description: providers.map((provider) => provider.summary).join(" "),
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
      ...(getShopAggregateOffer(shop, liveShopData) && {
        aggregateOffer: getShopAggregateOffer(shop, liveShopData),
      }),
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `https://soulfiremc.com/get-accounts/${shop.slug}#breadcrumb`,
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

    const pageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `https://soulfiremc.com/get-accounts/${shop.slug}#webpage`,
      name: `${shop.name} - Minecraft Alt Shop`,
      description: providers.map((provider) => provider.summary).join(" "),
      url: `https://soulfiremc.com/get-accounts/${shop.slug}`,
      inLanguage: "en-US",
      breadcrumb: {
        "@id": `https://soulfiremc.com/get-accounts/${shop.slug}#breadcrumb`,
      },
      mainEntity: {
        "@id": `https://soulfiremc.com/get-accounts/${shop.slug}#product`,
      },
      isPartOf: {
        "@type": "WebSite",
        name: "SoulFire",
        url: "https://soulfiremc.com",
      },
    };

    return {
      breadcrumbJsonLd: JSON.stringify(breadcrumbJsonLd),
      discordInvite,
      liveShopData,
      pageJsonLd: JSON.stringify(pageJsonLd),
      productJsonLd: JSON.stringify(productJsonLd),
      providers,
      reviewSummary,
      shop,
      writtenReviews: JSON.parse(JSON.stringify(writtenReviews)),
    };
  });

function ProviderBadge({ badge }: { badge: Badge }) {
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

function ShopLogo({
  src,
  name,
}: {
  src?: string;
  name: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={`${name} logo`}
        className="size-full object-contain p-3"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-4xl font-bold text-primary">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

function SocialLinkButtons({ links }: { links?: SocialLink[] }) {
  if (!links?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link) => (
        <Button key={link.url} asChild variant="secondary" size="sm">
          <a href={link.url} target="_blank" rel="noopener noreferrer nofollow">
            {link.platform}
          </a>
        </Button>
      ))}
    </div>
  );
}

export const Route = createFileRoute("/get-accounts/$slug")({
  loader: async ({ params }) => accountDetailLoader({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    const data = loaderData as any;

    if (!data) {
      return { meta: [] };
    }

    return {
      meta: getPageMeta({
        title: `${data.shop.name} - Minecraft Alt Shop`,
        description: data.providers
          .map((provider: any) => provider.summary)
          .join(" "),
        path: `/get-accounts/${data.shop.slug}`,
        imageUrl: getAccountPageImage(data.shop.slug).url,
        imageAlt: `${data.shop.name} preview`,
      }),
      links: getCanonicalLinks(`/get-accounts/${data.shop.slug}`),
    };
  },
  component: AccountDetailPage,
});

function AccountDetailPage() {
  const data = Route.useLoaderData() as any;
  const theme = data.shop.theme ? PROVIDER_THEMES[data.shop.theme] : undefined;

  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-(--fd-layout-width) space-y-8 px-4 py-12">
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload
          dangerouslySetInnerHTML={{ __html: data.pageJsonLd }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload
          dangerouslySetInnerHTML={{ __html: data.productJsonLd }}
        />
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload
          dangerouslySetInnerHTML={{ __html: data.breadcrumbJsonLd }}
        />

        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link
            to="/get-accounts"
            className="transition-colors hover:text-foreground"
          >
            Get Accounts
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-foreground">{data.shop.name}</span>
        </nav>

        <Card
          className={cn("gap-5 p-6", theme && ["ring-2", theme.ring, theme.bg])}
        >
          <div className="flex flex-col gap-6 sm:flex-row">
            <div
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted",
                theme?.logo,
              )}
            >
              <ShopLogo src={data.shop.logo} name={data.shop.name} />
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight">
                  {data.shop.name}
                </h1>
                {data.shop.startDate ? (
                  <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Since {data.shop.startDate}
                  </span>
                ) : null}
                <DiscordMemberBadge info={data.discordInvite} />
              </div>
              <p className="text-lg text-muted-foreground">
                {data.providers
                  .map((provider: any) => provider.summary)
                  .join(" ")}
              </p>

              <div className="flex flex-wrap gap-2">
                {[
                  ...new Set(
                    data.providers.flatMap((provider: any) => provider.badges),
                  ),
                ].map((badge: any) => (
                    <ProviderBadge key={badge} badge={badge} />
                  ))}
              </div>

              <SocialLinkButtons links={data.shop.socialLinks} />

              <div className="flex flex-wrap gap-2">
                {data.shop.websiteUrl ? (
                  <Button asChild variant="outline">
                    <a
                      href={data.shop.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Visit Website
                    </a>
                  </Button>
                ) : null}
                <ReviewSummaryBadge summary={data.reviewSummary} />
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {data.providers.map((provider: any) => {
            const listing = data.shop.listings[provider.category as Category];
            if (!listing) {
              return null;
            }

            const liveOffer = getListingOffer(
              data.shop,
              provider.category,
              provider.priceValue,
              data.liveShopData,
            );

            return (
              <Card key={provider.category} className="gap-4 p-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">
                    {CATEGORY_CONFIG[provider.category as Category].label}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_CONFIG[provider.category as Category].description}
                  </p>
                </div>
                <div className="text-3xl font-bold">{provider.price}</div>
                {provider.priceDetails ? (
                  <p className="text-sm text-muted-foreground">
                    {provider.priceDetails}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {listing.badges.map((badge: any) => (
                    <ProviderBadge key={badge} badge={badge} />
                  ))}
                </div>
                {provider.couponCode ? (
                  <CouponCode
                    code={provider.couponCode}
                    discount={provider.couponDiscount}
                  />
                ) : null}
                {provider.linkDiscountMessage ? (
                  <LinkDiscountNotice message={provider.linkDiscountMessage} />
                ) : null}
                <p className="text-sm text-muted-foreground">
                  Availability:{" "}
                  {String(liveOffer.availability).includes("OutOfStock")
                    ? "Out of stock"
                    : "In stock"}
                </p>
                <Button asChild>
                  <a
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    Buy {CATEGORY_CONFIG[provider.category as Category].label}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </Card>
            );
          })}
        </div>

        <Suspense>
          <ItemReviewsSection
            itemType="account"
            slug={data.shop.slug}
            initialSummary={data.reviewSummary}
            initialWrittenReviews={data.writtenReviews}
          />
        </Suspense>

        {data.shop.gallery && data.shop.gallery.length > 0 ? (
          <GallerySection images={data.shop.gallery} />
        ) : null}

        <Link
          to="/get-accounts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Browse all account providers
        </Link>
      </main>
    </SiteShell>
  );
}
