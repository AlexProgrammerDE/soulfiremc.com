import { BookOpen, ExternalLink, Info } from "lucide-react";
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

type Badge =
  | "high-quality"
  | "instant-delivery"
  | "lifetime-warranty"
  | "bulk-discount";

type Provider = {
  name: string;
  logo?: string;
  testimonial: string;
  url: string;
  badges: Badge[];
  category: "high-quality-alts" | "mfa-accounts";
  price: string;
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
  // High Quality Account Shops (ranked by value)
  {
    name: "Nicealts",
    testimonial:
      "Best value for high quality accounts. Offers both temporary tokens/cookies and permanent MFA accounts with responsive support.",
    url: "https://discord.gg/nicealts",
    badges: ["high-quality", "instant-delivery", "bulk-discount"],
    category: "high-quality-alts",
    price: "10¢",
  },
  {
    name: "ZZXGP",
    testimonial:
      "Versatile shop offering multiple tiers from budget to premium. Known for reliable cookie/token accounts and competitive MFA pricing.",
    url: "https://discord.gg/gycmTvrfnj",
    badges: ["instant-delivery", "bulk-discount"],
    category: "high-quality-alts",
    price: "12¢",
  },
  {
    name: "YYY",
    testimonial:
      "High quality cookie and token accounts at competitive prices. Reliable delivery through their dedicated platform.",
    url: "https://yyy.watchdog.gay",
    badges: ["high-quality", "instant-delivery"],
    category: "high-quality-alts",
    price: "12¢",
  },
  {
    name: "Fernan",
    testimonial:
      "Quality-focused provider with slightly higher prices reflecting account reliability and longevity.",
    url: "https://discord.gg/x3JvgAbNG9",
    badges: ["high-quality"],
    category: "high-quality-alts",
    price: "15¢",
  },
  {
    name: "Localts",
    testimonial:
      "Premium tier accounts with emphasis on quality over quantity. Higher price point but accounts known to last longer.",
    url: "https://discord.gg/B4xkxHwmd4",
    badges: ["high-quality", "lifetime-warranty"],
    category: "high-quality-alts",
    price: "25¢",
  },
  // MFA (Permanent Full Access) Accounts
  {
    name: "Aqua MFA",
    testimonial:
      "Best value for permanent full access accounts. Change all account info as you want - it's truly yours.",
    url: "https://discord.gg/87XFhsS35V",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$4",
  },
  {
    name: "Luma MFA",
    testimonial:
      "Permanent Minecraft accounts with full access. Reliable option for mains or long-term alts.",
    url: "https://discord.gg/B4xkxHwmd4",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$4.50",
  },
  {
    name: "Yolk",
    testimonial:
      "Trusted MFA provider offering permanent accounts with full access and info change capabilities.",
    url: "https://discord.gg/Ceheh2VNdh",
    badges: ["high-quality", "lifetime-warranty"],
    category: "mfa-accounts",
    price: "$5.67",
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

function ProviderLogo({ provider }: { provider: Provider }) {
  if (provider.logo) {
    return (
      <Image
        src={provider.logo}
        alt={`${provider.name} logo`}
        fill
        className="object-contain p-2"
      />
    );
  }
  // Default: show first letter of provider name
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-bold text-primary">
      {provider.name.charAt(0).toUpperCase()}
    </div>
  );
}

function ProviderCard({ provider }: { provider: Provider }) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col sm:flex-row gap-4 p-6">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <ProviderLogo provider={provider} />
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-xl font-semibold">{provider.name}</h3>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
              {provider.price}
            </span>
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
  );
}

export default function GetAccountsPage() {
  const highQualityProviders = PROVIDERS.filter(
    (p) => p.category === "high-quality-alts"
  );
  const mfaProviders = PROVIDERS.filter((p) => p.category === "mfa-accounts");

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
          <Link
            href="/docs/usage/accounts"
            className="underline hover:text-foreground"
          >
            Account Guide
          </Link>
          .
        </p>
      </div>

      {/* High Quality Alts Section */}
      <div className="max-w-3xl mx-auto w-full space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">High Quality Alts</h2>
          <p className="text-sm text-muted-foreground">
            Cookie and token accounts - temporary but affordable. Prices shown are per account.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {highQualityProviders.map((provider) => (
            <ProviderCard key={provider.name} provider={provider} />
          ))}
        </div>
      </div>

      {/* MFA Accounts Section */}
      <div className="max-w-3xl mx-auto w-full space-y-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">MFA Accounts (Permanent)</h2>
          <p className="text-sm text-muted-foreground">
            Full access accounts you own forever. Change email, password, and username as you want.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {mfaProviders.map((provider) => (
            <ProviderCard key={provider.name} provider={provider} />
          ))}
        </div>
      </div>

      <div className="border-t pt-6 max-w-3xl mx-auto text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          <strong>Source:</strong> Provider list curated from{" "}
          <a
            href="https://alts.watchdog.gay"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            alts.watchdog.gay
          </a>
          . Rankings based on community feedback and value.
        </p>
        <p className="text-sm text-muted-foreground">
          <strong>Disclaimer:</strong> We are not affiliated with any of these providers.
          Always do your own research before making purchases.
        </p>
      </div>
    </main>
  );
}
