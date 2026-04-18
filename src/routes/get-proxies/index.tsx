import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { proxiesFaqItems } from "@/app/(home)/get-proxies/proxies-faq";
import { GetProxiesClient } from "@/app/(home)/get-proxies/page-grid";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site-shell";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";
import { PROVIDERS } from "@/lib/proxies-data";
import { getAggregateRatingJsonLd, getReviewSummaries } from "@/lib/reviews";

const proxiesPageLoader = createServerFn({ method: "GET" }).handler(
  async () => {
    const reviewSummaries = await getReviewSummaries(
      "proxy",
      PROVIDERS.map((provider) => provider.slug),
    ).catch(
      () =>
        ({} as Record<
          string,
          { averageRating: number | null; reviewCount: number }
        >),
    );

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: proxiesFaqItems.map((item) => ({
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
      "@id": "https://soulfiremc.com/get-proxies#breadcrumb",
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
      ],
    };

    const pageJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Get Proxies",
      description:
        "Best proxy providers for Minecraft bot testing. Compare residential, datacenter, ISP, and mobile proxies.",
      url: "https://soulfiremc.com/get-proxies",
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "SoulFire",
        url: "https://soulfiremc.com",
      },
      breadcrumb: {
        "@id": "https://soulfiremc.com/get-proxies#breadcrumb",
      },
      mainEntity: {
        "@id": "https://soulfiremc.com/get-proxies#provider-list",
      },
    };

    const itemListJsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://soulfiremc.com/get-proxies#provider-list",
      name: "Proxy Providers for SoulFire",
      description:
        "Trusted proxy providers for Minecraft bot testing with SoulFire. Compare residential, datacenter, ISP, and mobile proxies.",
      numberOfItems: PROVIDERS.length,
      itemListElement: PROVIDERS.map((provider, index) => {
        const aggregateRating = getAggregateRatingJsonLd(
          reviewSummaries[provider.slug] ?? {
            averageRating: null,
            reviewCount: 0,
          },
        );

        return {
          "@type": "ListItem",
          position: index + 1,
          url: `https://soulfiremc.com/get-proxies/${provider.slug}`,
          item: {
            "@type": "Product",
            name: provider.name,
            description: provider.summary,
            url: `https://soulfiremc.com/get-proxies/${provider.slug}`,
            ...(aggregateRating && { aggregateRating }),
          },
        };
      }),
    };

    return {
      breadcrumbJsonLd: JSON.stringify(breadcrumbJsonLd),
      faqJsonLd: JSON.stringify(faqJsonLd),
      itemListJsonLd: JSON.stringify(itemListJsonLd),
      pageJsonLd: JSON.stringify(pageJsonLd),
      reviewSummaries,
    };
  },
);

export const Route = createFileRoute("/get-proxies/")({
  head: () => ({
    meta: getPageMeta({
      title: "Get Proxies - SoulFire",
      description:
        "Best proxy providers for Minecraft bot testing. Compare residential, datacenter, ISP, and mobile proxies. Free tiers available, with coupon codes and bulk pricing from top providers.",
      path: "/get-proxies",
      imageUrl: "/og/site/get-proxies/image.webp",
      imageAlt: "SoulFire proxy providers page preview",
    }),
    links: getCanonicalLinks("/get-proxies"),
  }),
  loader: async () => proxiesPageLoader(),
  component: GetProxiesPage,
});

function GetProxiesPage() {
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
      <GetProxiesClient initialSummaries={data.reviewSummaries} />
    </SiteShell>
  );
}
