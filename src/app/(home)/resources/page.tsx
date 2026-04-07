import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type { FAQPage, ItemList, WithContext } from "schema-dts";
import { resourcesFaqItems } from "@/app/(home)/resources/resources-faq";
import { JsonLd } from "@/components/json-ld";
import { imageMetadata } from "@/lib/metadata";
import { getAggregateRatingJsonLd, getReviewSummaries } from "@/lib/reviews";
import { RESOURCES } from "@/lib/resources-data";
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

  const itemListJsonLd: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
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
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
      <ResourcesClient initialSummaries={reviewSummaries} />
    </>
  );
}
