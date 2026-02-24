import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type { FAQPage, ItemList, WithContext } from "schema-dts";
import { resourcesFaqItems } from "@/app/(home)/resources/resources-faq";
import { JsonLd } from "@/components/json-ld";
import { RESOURCES } from "@/lib/resources-data";
import { getUpvoteCounts } from "@/lib/upvotes";
import { ResourcesClient } from "./page.client";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Community SoulFire plugins and scripts. Browse the registry to find plugins and scripts that extend your Minecraft bot automation.",
};

export default async function ResourcesPage() {
  "use cache";
  cacheLife("hours");

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
    itemListElement: RESOURCES.map((resource, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: resource.name,
      description: resource.description,
      url: resource.url,
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
      <ResourcesClient
        initialCounts={await getUpvoteCounts(
          "resource",
          RESOURCES.map((r) => r.slug),
        )}
      />
    </>
  );
}
