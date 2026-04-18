import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { accountFaqItems } from "@/app/(home)/get-accounts/accounts-faq";
import { GetAccountsClient } from "@/app/(home)/get-accounts/page-grid";
import { SiteShell } from "@/components/site-shell";
import {
  getDiscordInviteUrl,
  getShopBySlug,
  PROVIDERS,
} from "@/lib/accounts-data";
import {
  getListingOffer,
  getLiveShopData,
  getShopAggregateOffer,
} from "@/lib/accounts-offers";
import { fetchDiscordInvite } from "@/lib/discord";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";
import { getAggregateRatingJsonLd, getReviewSummaries } from "@/lib/reviews";

const accountsPageLoader = createServerFn({ method: "GET" }).handler(
  async () => {
    const providersBySlug = [
      ...new Map(PROVIDERS.map((provider) => [provider.slug, provider])).values(),
    ];
    const reviewSummaries = await getReviewSummaries("account", [
      ...new Set(PROVIDERS.map((provider) => provider.slug)),
    ]).catch(
      () =>
        ({} as Record<
          string,
          { averageRating: number | null; reviewCount: number }
        >),
    );
    const liveShopDataEntries = await Promise.all(
      providersBySlug.map(async (provider) => {
        const shop = getShopBySlug(provider.slug);
        if (!shop) return [provider.slug, {}] as const;
        return [provider.slug, await getLiveShopData(shop).catch(() => ({}))] as const;
      }),
    );
    const liveShopDataBySlug = Object.fromEntries(liveShopDataEntries);

    const discordInvites = Object.fromEntries(
      await Promise.all(
        providersBySlug.map(async (provider) => {
          const discordInviteUrl = getDiscordInviteUrl(provider);
          return [
            provider.slug,
            discordInviteUrl
              ? await fetchDiscordInvite(discordInviteUrl).catch(() => null)
              : null,
          ] as const;
        }),
      ),
    );

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: accountFaqItems.map((item) => ({
        "@type": "Question" as const,
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer" as const,
          text: item.answerHtml,
        },
      })),
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": "https://soulfiremc.com/get-accounts#breadcrumb",
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
      ],
    };

    const pageJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Minecraft Alts, MFA & NFA Accounts",
      description:
        "Compare Minecraft alt shops and account providers for SoulFire. Browse MFA full-access accounts, NFA temporary accounts, and token or cookie alts with current pricing and delivery details.",
      url: "https://soulfiremc.com/get-accounts",
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "SoulFire",
        url: "https://soulfiremc.com",
      },
      breadcrumb: {
        "@id": "https://soulfiremc.com/get-accounts#breadcrumb",
      },
      mainEntity: {
        "@id": "https://soulfiremc.com/get-accounts#provider-list",
      },
    };

    const itemListJsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://soulfiremc.com/get-accounts#provider-list",
      name: "Minecraft Alt Shops and Account Providers",
      description:
        "Trusted Minecraft alt shops for SoulFire bot testing. Compare MFA full-access accounts, NFA temporary accounts, and token or cookie account options.",
      numberOfItems: providersBySlug.length,
      itemListElement: providersBySlug.map((provider, index) => {
        const aggregateRating = getAggregateRatingJsonLd(
          reviewSummaries[provider.slug] ?? {
            averageRating: null,
            reviewCount: 0,
          },
        );
        const shop = getShopBySlug(provider.slug);

        return {
          "@type": "ListItem",
          position: index + 1,
          url: `https://soulfiremc.com/get-accounts/${provider.slug}`,
          item: {
            "@type": "Product",
            name: provider.name,
            description: provider.summary,
            url: `https://soulfiremc.com/get-accounts/${provider.slug}`,
            category:
              provider.category === "mfa-accounts"
                ? "MFA full-access Minecraft accounts"
                : "NFA temporary Minecraft accounts",
            ...(shop && {
              aggregateOffer: getShopAggregateOffer(
                shop,
                liveShopDataBySlug[provider.slug],
              ),
              offers: getListingOffer(
                shop,
                provider.category,
                provider.priceValue,
                liveShopDataBySlug[provider.slug],
              ),
            }),
            ...(aggregateRating && { aggregateRating }),
          },
        };
      }),
    };

    return {
      breadcrumbJsonLd: JSON.stringify(breadcrumbJsonLd),
      discordInvites,
      faqJsonLd: JSON.stringify(faqJsonLd),
      itemListJsonLd: JSON.stringify(itemListJsonLd),
      pageJsonLd: JSON.stringify(pageJsonLd),
      reviewSummaries,
    };
  },
);

export const Route = createFileRoute("/get-accounts/")({
  head: () => ({
    meta: getPageMeta({
      title: "Minecraft Alts, MFA & NFA Accounts - SoulFire",
      description:
        "Compare Minecraft alt shops and account providers for SoulFire. Browse MFA full-access accounts, NFA temporary accounts, and token or cookie alts with current pricing and delivery details.",
      path: "/get-accounts",
      imageUrl: "/og/site/get-accounts/image.webp",
      imageAlt: "SoulFire account providers page preview",
    }),
    links: getCanonicalLinks("/get-accounts"),
  }),
  loader: async () => accountsPageLoader(),
  component: GetAccountsPage,
});

function GetAccountsPage() {
  const data = Route.useLoaderData();

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload
        dangerouslySetInnerHTML={{ __html: data.pageJsonLd }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload
        dangerouslySetInnerHTML={{ __html: data.itemListJsonLd }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload
        dangerouslySetInnerHTML={{ __html: data.faqJsonLd }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD payload
        dangerouslySetInnerHTML={{ __html: data.breadcrumbJsonLd }}
      />
      <GetAccountsClient
        discordInvites={data.discordInvites}
        initialSummaries={data.reviewSummaries}
      />
    </SiteShell>
  );
}
