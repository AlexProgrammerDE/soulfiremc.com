import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type {
  BreadcrumbList,
  CollectionPage,
  FAQPage,
  ItemList,
  WithContext,
} from "schema-dts";
import { proxiesFaqItems } from "@/app/(home)/get-proxies/proxies-faq";
import { JsonLd } from "@/components/json-ld";
import { imageMetadata } from "@/lib/metadata";
import { PROVIDERS } from "@/lib/proxies-data";
import { getAggregateRatingJsonLd, getReviewSummaries } from "@/lib/reviews";
import { GetProxiesClient } from "./page.client";

export const metadata: Metadata = {
  title: "Get Proxies",
  description:
    "Best proxy providers for Minecraft bot testing. Compare residential, datacenter, ISP, and mobile proxies. Free tiers available, with coupon codes and bulk pricing from top providers.",
  ...imageMetadata("/og/site/get-proxies/image.webp"),
};

export default async function GetProxiesPage() {
  "use cache";
  cacheLife("hours");

  const reviewSummaries = await getReviewSummaries(
    "proxy",
    PROVIDERS.map((provider) => provider.slug),
  );

  const faqJsonLd: WithContext<FAQPage> = {
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

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
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

  const pageJsonLd: WithContext<CollectionPage> = {
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

  const itemListJsonLd: WithContext<ItemList> = {
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

  return (
    <>
      <JsonLd data={pageJsonLd} />
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <GetProxiesClient initialSummaries={reviewSummaries} />
    </>
  );
}
