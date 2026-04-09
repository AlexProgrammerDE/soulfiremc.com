import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type {
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  ItemList,
  WithContext,
} from "schema-dts";
import { resourcesFaqItems } from "@/app/(home)/resources/resources-faq";
import { JsonLd } from "@/components/json-ld";
import { imageMetadata } from "@/lib/metadata";
import { RESOURCES } from "@/lib/resources-data";
import { getAggregateRatingJsonLd, getReviewSummaries } from "@/lib/reviews";
import { ResourcesClient } from "./page.client";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Community SoulFire plugins and scripts. Browse the registry to find plugins and scripts that extend your Minecraft bot automation.",
  ...imageMetadata("/og/site/resources/image.webp"),
};

export default async function ResourcesPage() {
  "use cache";
  cacheLife("hours");

  const reviewSummaries = await getReviewSummaries(
    "resource",
    RESOURCES.map((resource) => resource.slug),
  );

  const faqJsonLd: WithContext<FAQPage> = {
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

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
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

  const pageJsonLd: WithContext<CollectionPage> = {
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

  const itemListJsonLd: WithContext<ItemList> = {
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

  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ResourcesClient initialSummaries={reviewSummaries} />
    </>
  );
}
