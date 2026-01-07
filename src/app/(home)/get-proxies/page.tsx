import { BookOpen, ExternalLink, Heart, Info } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CouponCode } from "./coupon-code";

type Badge =
  | "free-tier"
  | "high-quality"
  | "residential"
  | "datacenter"
  | "unlimited-bandwidth"
  | "sponsor";

type Provider = {
  name: string;
  logo: string;
  testimonial: string;
  url: string;
  badges: Badge[];
  sponsor?: boolean;
  couponCode?: string;
  couponDiscount?: string;
};

const BADGE_CONFIG: Record<
  Badge,
  { label: string; className: string; description: string }
> = {
  "free-tier": {
    label: "Free Tier",
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
    description:
      "This provider offers a free tier, allowing you to test their service before committing to a paid plan.",
  },
  "high-quality": {
    label: "High Quality",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    description:
      "Premium proxies with high reliability, fast speeds, and excellent uptime. Best for demanding use cases.",
  },
  residential: {
    label: "Residential",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    description:
      "Real residential IP addresses from ISPs. Harder to detect and block, ideal for realistic testing scenarios.",
  },
  datacenter: {
    label: "Datacenter",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    description:
      "Fast and affordable proxies from data centers. Great for high-volume testing where speed matters most.",
  },
  "unlimited-bandwidth": {
    label: "Unlimited Bandwidth",
    className: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
    description:
      "No data caps or bandwidth limits. Perfect for extensive stress testing without worrying about usage.",
  },
  sponsor: {
    label: "Sponsor",
    className: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    description:
      "This provider sponsors SoulFire monthly, helping fund the development of the project.",
  },
};

const PROVIDERS: Provider[] = [
  {
    name: "Thordata",
    logo: "/providers/thordata.png",
    testimonial:
      "60M+ residential IPs across 190+ countries with 99.9% uptime. Offers residential, mobile, datacenter, and static ISP proxies.",
    url: "https://affiliate.thordata.com/soulfire",
    badges: ["sponsor", "high-quality", "residential"],
    sponsor: true,
    couponCode: "THORDATA",
    couponDiscount: "20% off",
  },
  {
    name: "Webshare",
    logo: "/providers/webshare.svg",
    testimonial:
      "80M+ rotating residential IPs from 195 countries, plus fast datacenter proxies. Offers 10 free proxies to get started.",
    url: "https://www.webshare.io/?referral_code=36gneippfiwt",
    badges: ["free-tier", "residential", "datacenter"],
  },
  {
    name: "ProxyScrape",
    logo: "/providers/proxyscrape.svg",
    testimonial:
      "55M+ residential IPs with 99.9% success rate. Unlimited bandwidth plans available for high-volume stress testing.",
    url: "https://proxyscrape.com/?ref=mge4mtc",
    badges: ["unlimited-bandwidth", "residential"],
  },
];

export const metadata: Metadata = {
  title: "Get Proxies",
  description:
    "Find high-quality proxy providers for stress testing with SoulFire.",
};

function ProviderBadge({ badge }: { badge: Badge }) {
  const config = BADGE_CONFIG[badge];
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className={`inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
        >
          {badge === "sponsor" && <Heart className="h-3 w-3 fill-current" />}
          {config.label}
          <Info className="h-3 w-3 opacity-60" />
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 text-sm">
        <p>{config.description}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

export default function GetProxiesPage() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto space-y-10">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Get Proxies
        </h1>
        <p className="text-lg text-muted-foreground">
          High-quality proxies help distribute your load tests and avoid rate
          limits. Here are trusted providers we recommend.
        </p>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <BookOpen className="h-4 w-4" />
          For more information on how to use proxies with SoulFire, read the{" "}
          <Link
            href="/docs/usage/proxies"
            className="underline hover:text-foreground"
          >
            Proxy Guide
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        {PROVIDERS.map((provider) => (
          <Card
            key={provider.name}
            className={`transition-all duration-300 hover:shadow-lg ${
              provider.sponsor
                ? "ring-2 ring-pink-500/50 bg-gradient-to-r from-pink-500/5 to-purple-500/5"
                : ""
            }`}
          >
            <div className="flex flex-col sm:flex-row gap-4 p-6">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={provider.logo}
                  alt={`${provider.name} logo`}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-semibold">{provider.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {provider.badges.map((badge) => (
                      <ProviderBadge key={badge} badge={badge} />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground">{provider.testimonial}</p>
                {provider.couponCode && (
                  <CouponCode
                    code={provider.couponCode}
                    discount={provider.couponDiscount}
                  />
                )}
                <Button asChild>
                  <a
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Proxies
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="border-t pt-6 max-w-3xl mx-auto text-center">
        <p className="text-sm text-muted-foreground">
          <strong>Disclosure:</strong> This page contains affiliate links. When
          you purchase through these links, we may earn a commission at no extra
          cost to you. These commissions help fund the development of SoulFire.
        </p>
      </div>
    </main>
  );
}
