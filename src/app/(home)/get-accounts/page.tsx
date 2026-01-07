import { ExternalLink, BookOpen, Info } from "lucide-react";
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

type Badge = "high-quality" | "instant-delivery" | "lifetime-warranty" | "bulk-discount";

type Provider = {
  name: string;
  logo: string;
  testimonial: string;
  url: string;
  badges: Badge[];
};

const BADGE_CONFIG: Record<
  Badge,
  { label: string; className: string; description: string }
> = {
  "high-quality": {
    label: "High Quality",
    className: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    description:
      "Premium accounts with high reliability and low ban rates. Best for demanding use cases.",
  },
  "instant-delivery": {
    label: "Instant Delivery",
    className: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    description:
      "Accounts are delivered automatically and instantly after purchase - no waiting required.",
  },
  "lifetime-warranty": {
    label: "Lifetime Warranty",
    className: "bg-green-500/10 text-green-600 dark:text-green-400",
    description:
      "Accounts come with lifetime warranty - get a replacement if your account stops working.",
  },
  "bulk-discount": {
    label: "Bulk Discount",
    className: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
    description:
      "Significant discounts available when purchasing accounts in bulk quantities.",
  },
};

const PROVIDERS: Provider[] = [
  {
    name: "StarixAlts",
    logo: "/providers/starixalts.png",
    testimonial:
      "4.1 stars on Trustpilot with lifetime warranty. Full access accounts with guides on securing them included.",
    url: "https://starixalts.com/?ref=soulfire",
    badges: ["high-quality", "instant-delivery", "lifetime-warranty"],
  },
  {
    name: "AltsGreat",
    logo: "/providers/altsgreat.webp",
    testimonial:
      "Reliable source with 220+ Trustpilot reviews. Accounts reported working for months with responsive support.",
    url: "https://altsgreat.com/?ref=soulfire",
    badges: ["instant-delivery", "lifetime-warranty"],
  },
];

export const metadata: Metadata = {
  title: "Get Minecraft Accounts",
  description:
    "Find reliable Minecraft account providers for stress testing with SoulFire.",
};

function ProviderBadge({ badge }: { badge: Badge }) {
  const config = BADGE_CONFIG[badge];
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span
          className={`inline-flex cursor-help items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${config.className}`}
        >
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

export default function GetAccountsPage() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto space-y-10">
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Get Minecraft Accounts
        </h1>
        <p className="text-lg text-muted-foreground">
          SoulFire works best with quality Minecraft accounts. Here are trusted
          providers we recommend for stress testing.
        </p>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <BookOpen className="h-4 w-4" />
          For more information on how to use accounts with SoulFire, read the{" "}
          <Link href="/docs/usage/accounts" className="underline hover:text-foreground">
            Account Guide
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-3xl mx-auto w-full">
        {PROVIDERS.map((provider) => (
          <Card
            key={provider.name}
            className="transition-all duration-300 hover:shadow-lg"
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
                <Button asChild>
                  <a
                    href={provider.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Accounts
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
