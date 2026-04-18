import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { resourcesFaqItems } from "@/app/(home)/resources/resources-faq";
import { ResourcesClient } from "@/app/(home)/resources/page-grid";
import { SiteShell } from "@/components/site-shell";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";
import { RESOURCES } from "@/lib/resources-data";
import { getAggregateRatingJsonLd, getReviewSummaries } from "@/lib/reviews";

const resourcesPageLoader = createServerFn({ method: "GET" }).handler(
  async () => {
    const reviewSummaries = await getReviewSummaries(
      "resource",
      RESOURCES.map((resource) => resource.slug),
    ).catch(() => ({} as Record<string, { averageRating: number | null; reviewCount: number }>));

    const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: resourcesFaqItems.map((item) => ({
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
      "@id": "https://soulfiremc.com/resources#breadcrumb",
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
      ],
    };

    const pageJsonLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "SoulFire Resources",
      description:
        "Community SoulFire plugins and scripts. Browse the registry to find plugins and scripts that extend your Minecraft bot automation.",
      url: "https://soulfiremc.com/resources",
      inLanguage: "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "SoulFire",
        url: "https://soulfiremc.com",
      },
      breadcrumb: {
        "@id": "https://soulfiremc.com/resources#breadcrumb",
      },
      mainEntity: {
        "@id": "https://soulfiremc.com/resources#resource-list",
      },
    };

    const itemListJsonLd = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": "https://soulfiremc.com/resources#resource-list",
      name: "SoulFire Plugins & Scripts",
      description:
        "Community plugins and scripts for SoulFire Minecraft bot automation.",
      numberOfItems: RESOURCES.length,
      itemListElement: RESOURCES.map((resource, index) => {
        const aggregateRating = getAggregateRatingJsonLd(
          reviewSummaries[resource.slug] ?? {
            averageRating: null,
            reviewCount: 0,
          },
        );

        return {
          "@type": "ListItem",
          position: index + 1,
          url: `https://soulfiremc.com/resources/${resource.slug}`,
          item: {
            "@type": "SoftwareApplication",
            name: resource.name,
            description: resource.description,
            url: `https://soulfiremc.com/resources/${resource.slug}`,
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

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: getPageMeta({
      title: "Resources - SoulFire",
      description:
        "Community SoulFire plugins and scripts. Browse the registry to find plugins and scripts that extend your Minecraft bot automation.",
      path: "/resources",
      imageUrl: "/og/site/resources/image.webp",
      imageAlt: "SoulFire resources page preview",
    }),
    links: getCanonicalLinks("/resources"),
  }),
  loader: async () => resourcesPageLoader(),
  component: ResourcesPage,
});

function ResourcesPage() {
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
      <ResourcesClient initialSummaries={data.reviewSummaries} />
    </SiteShell>
  );
}
