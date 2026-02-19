import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import type { FAQPage, ItemList, WithContext } from "schema-dts";
import { JsonLd } from "@/components/json-ld";
import { PROVIDERS } from "@/lib/proxies-data";
import { GetProxiesClient } from "./page.client";

export const metadata: Metadata = {
  title: "Get Proxies",
  description:
    "Best proxy providers for Minecraft bot testing. Compare residential, datacenter, ISP, and mobile proxies. Free tiers available, with coupon codes and bulk pricing from top providers.",
};

const faqItems: {
  question: string;
  answerHtml: string;
  answerElement: React.ReactNode;
}[] = [
  {
    question: "Why do I need proxies for SoulFire?",
    answerHtml:
      'When running multiple bots, servers may block your IP. Proxies give each bot a different IP address, avoiding rate limits and IP bans. Learn more in the <a href="https://soulfiremc.com/docs/usage/proxies">Proxy Guide</a>.',
    answerElement: (
      <>
        When running multiple bots, servers may block your IP. Proxies give each
        bot a different IP address, avoiding rate limits and IP bans. Learn more
        in the{" "}
        <Link href="/docs/usage/proxies" className="underline text-primary">
          Proxy Guide
        </Link>
        .
      </>
    ),
  },
  {
    question: "What type of proxy should I use?",
    answerHtml:
      'Residential proxies are the hardest to detect but cost more. Datacenter proxies are faster and cheaper but easier to block. ISP proxies offer a middle ground. See the <a href="https://soulfiremc.com/docs/usage/proxies">Proxy Guide</a> for recommendations.',
    answerElement: (
      <>
        Residential proxies are the hardest to detect but cost more. Datacenter
        proxies are faster and cheaper but easier to block. ISP proxies offer a
        middle ground. See the{" "}
        <Link href="/docs/usage/proxies" className="underline text-primary">
          Proxy Guide
        </Link>{" "}
        for recommendations.
      </>
    ),
  },
  {
    question: 'What does "unlimited bandwidth" mean?',
    answerHtml:
      "Some providers don't charge per GB of data transferred. This is useful for long-running bot sessions that generate lots of traffic.",
    answerElement: (
      <>
        Some providers don't charge per GB of data transferred. This is useful
        for long-running bot sessions that generate lots of traffic.
      </>
    ),
  },
  {
    question: "Are these affiliate links?",
    answerHtml:
      "Yes, some links are affiliate links. Purchases through them help fund SoulFire development at no extra cost to you.",
    answerElement: (
      <>
        Yes, some links are affiliate links. Purchases through them help fund
        SoulFire development at no extra cost to you.
      </>
    ),
  },
  {
    question: "Can I use free proxies with SoulFire?",
    answerHtml:
      "Some providers like Webshare offer a free tier. Free public proxy lists are not recommended since they're slow, unreliable, and often already blocked.",
    answerElement: (
      <>
        Some providers like Webshare offer a free tier. Free public proxy lists
        are not recommended since they're slow, unreliable, and often already
        blocked.
      </>
    ),
  },
];

export default async function GetProxiesPage() {
  "use cache";
  cacheLife("hours");

  const faqJsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
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
      <Suspense>
        <GetProxiesClient
          providers={PROVIDERS}
          faqItems={faqItems.map((item) => ({
            question: item.question,
            answer: item.answerElement,
          }))}
        />
      </Suspense>
    </>
  );
}
