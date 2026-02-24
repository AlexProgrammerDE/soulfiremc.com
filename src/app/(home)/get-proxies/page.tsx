import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import type { FAQPage, ItemList, WithContext } from "schema-dts";
import { proxiesFaqItems } from "@/app/(home)/get-proxies/proxies-faq";
import { JsonLd } from "@/components/json-ld";
import { PROVIDERS } from "@/lib/proxies-data";
import { getUpvoteCounts } from "@/lib/upvotes";
import { GetProxiesClient } from "./page.client";

export const metadata: Metadata = {
  title: "Get Proxies",
  description:
    "Best proxy providers for Minecraft bot testing. Compare residential, datacenter, ISP, and mobile proxies. Free tiers available, with coupon codes and bulk pricing from top providers.",
};

export default async function GetProxiesPage() {
  "use cache";
  cacheLife("hours");

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

  const itemListJsonLd: WithContext<ItemList> = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Proxy Providers for SoulFire",
    description:
      "Trusted proxy providers for Minecraft bot testing with SoulFire. Compare residential, datacenter, ISP, and mobile proxies.",
    numberOfItems: PROVIDERS.length,
    itemListElement: PROVIDERS.map((provider, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: provider.name,
      description: provider.testimonial,
      url: provider.url,
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd data={faqJsonLd} />
      <GetProxiesClient
        initialCounts={await getUpvoteCounts(
          "proxy",
          PROVIDERS.map((p) => p.slug),
        )}
      />
    </>
  );
}
