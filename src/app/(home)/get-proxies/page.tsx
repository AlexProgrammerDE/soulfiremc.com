import type { Metadata } from "next";
import Link from "next/link";
import type { FAQPage, ItemList, WithContext } from "schema-dts";
import { JsonLd } from "@/components/json-ld";
import { GetProxiesClient, type Provider } from "./page.client";
import { cacheLife } from 'next/cache';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: "Get Proxies",
  description:
    "Best proxy providers for Minecraft bot testing. Compare residential, datacenter, ISP, and mobile proxies. Free tiers available, with coupon codes and bulk pricing from top providers.",
};

const PROVIDERS: Provider[] = [
  // Sponsor always first
  {
    name: "Thordata",
    logo: "/providers/thordata.png",
    testimonial:
      "60M+ residential IPs across 190+ countries with 99.9% uptime. Offers residential, mobile, datacenter, and static ISP proxies.",
    url: "https://affiliate.thordata.com/soulfire",
    badges: ["sponsor", "high-quality", "residential", "mobile", "isp"],
    sponsor: true,
    sponsorTheme: "pink",
    couponCode: "THORDATA",
    couponDiscount: "20% off",
  },
  {
    name: "Proxy-Seller",
    logo: "/providers/proxyseller.svg",
    testimonial:
      "Dedicated datacenter proxies in 40+ countries. Unlimited bandwidth with 72-hour refund policy. From $0.9/IP.",
    url: "https://proxy-seller.com/?partner=GRJY71PA3XWPPP",
    badges: [
      "sponsor",
      "budget-friendly",
      "datacenter",
      "isp",
      "mobile",
      "residential",
    ],
    sponsor: true,
    sponsorTheme: "amber",
    couponCode: "SOULFIREMC",
    couponDiscount:
      "15% off IPv4/IPv6/ISP - 39% off Residential - 10% off Mobile proxies",
  },
  // Higher recommends
  {
    name: "Webshare",
    logo: "/providers/webshare.svg",
    testimonial:
      "80M+ rotating residential IPs from 195 countries, plus fast datacenter proxies. Offers 10 free proxies to get started.",
    url: "https://www.webshare.io/?referral_code=36gneippfiwt",
    badges: ["free-tier", "residential", "datacenter", "budget-friendly"],
  },
  {
    name: "ProxyScrape",
    logo: "/providers/proxyscrape.svg",
    testimonial:
      "55M+ residential IPs with 99.9% success rate. Unlimited bandwidth plans available for high-volume bot testing.",
    url: "https://proxyscrape.com/?ref=mge4mtc",
    badges: ["unlimited-bandwidth", "residential"],
  },
  // User recommendation
  {
    name: "PYPROXY",
    logo: "/providers/pyproxy.png",
    testimonial:
      "90M+ residential IPs across 190+ countries with 99% availability. Offers residential, datacenter, and ISP proxies starting at $0.60/GB.",
    url: "https://www.pyproxy.com/reg/?ref=1Pcpve",
    badges: ["residential", "datacenter", "isp", "budget-friendly"],
    couponCode: "SOULFIRE9",
    couponDiscount: "10% off",
  },
  {
    name: "PlainProxies",
    logo: "/providers/plainproxies.png",
    testimonial:
      "German provider with 10M+ IPs. 10Gbps datacenter proxies and unlimited residential options with rate-limit free rotation.",
    url: "https://dashboard.plainproxies.com/?ref=wTOIS7dS",
    badges: ["unlimited-bandwidth", "residential", "datacenter", "isp"],
  },
  // Enterprise tier
  {
    name: "Bright Data",
    logo: "/providers/brightdata.png",
    testimonial:
      "Market leader with 770K+ datacenter IPs and massive residential network. ISO 27001 & SOC 2 certified with 99.99% uptime.",
    url: "https://get.brightdata.com/soulfire",
    badges: [
      "enterprise",
      "high-quality",
      "residential",
      "datacenter",
      "mobile",
    ],
  },
  {
    name: "Oxylabs",
    logo: "/providers/oxylabs.png",
    testimonial:
      "175M+ residential IPs across 195+ countries. Largest proxy network globally with 99.95% success rate and 0.6s avg response time.",
    url: "https://oxylabs.go2cloud.org/aff_c?offer_id=7&aff_id=1896&url_id=144",
    badges: ["enterprise", "high-quality", "residential", "datacenter"],
  },
  // Mid tier
  {
    name: "Decodo (formerly Smartproxy)",
    logo: "/providers/decodo.svg",
    testimonial:
      "115M+ ethically-sourced residential IPs across 195+ locations. User-friendly with 99.86% success rate. Great for SMBs.",
    url: "https://visit.decodo.com/K0rr7e",
    badges: ["high-quality", "residential", "datacenter"],
  },
  {
    name: "IPRoyal",
    logo: "/providers/iproyal.svg",
    testimonial:
      "32M+ residential IPs across 195+ countries. Non-expiring traffic with unlimited bandwidth and threads. Great value.",
    url: "https://iproyal.com/?r=soulfire",
    badges: ["budget-friendly", "residential", "datacenter", "isp"],
  },
  {
    name: "NetNut",
    logo: "/providers/netnut.svg",
    testimonial:
      "85M+ residential IPs with ISP-based network for fast speeds. Direct ISP connectivity reduces latency.",
    url: "https://netnut.io?ref=odblmzc",
    badges: ["high-quality", "residential", "isp"],
  },
];

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
