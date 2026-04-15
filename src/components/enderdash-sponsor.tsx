import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EnderDashSponsorPlacement = "homepage" | "docs-footer" | "blog-footer";

type EnderDashSponsorProps = {
  className?: string;
  placement: EnderDashSponsorPlacement;
  variant?: "feature" | "footer";
};

const sponsorTitle =
  "Are you looking for an advanced administration panel for your server?";

const sponsorDescription =
  "EnderDash allows you to manage your existing Minecraft servers using an advanced dashboard by installing a single plugin, batteries included. Run commands with tab completion, read logs, manage files, invite your whole team, manage players, use Ocelot (AI Assistant), and keep working with your existing infrastructure and panels.";

const sponsorCampaignByPlacement = {
  homepage: "homepage-sponsor",
  "docs-footer": "docs-sponsored-footer",
  "blog-footer": "blog-sponsored-footer",
} satisfies Record<EnderDashSponsorPlacement, string>;

function getSponsorHref(placement: EnderDashSponsorPlacement) {
  const url = new URL("https://enderdash.com/");
  url.searchParams.set("utm_source", "soulfiremc.com");
  url.searchParams.set("utm_medium", "sponsored");
  url.searchParams.set("utm_campaign", sponsorCampaignByPlacement[placement]);
  return url.toString();
}

function SponsorLogo({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="flex size-20 shrink-0 items-center justify-center rounded-lg border bg-background p-3 sm:size-24"
    >
      <Image
        src="/sponsors/enderdash-logo.png"
        alt="EnderDash logo"
        width={96}
        height={96}
        className="h-auto w-full"
      />
    </a>
  );
}

export function EnderDashSponsor({
  className,
  placement,
  variant = "footer",
}: EnderDashSponsorProps) {
  const href = getSponsorHref(placement);

  if (variant === "feature") {
    return (
      <section
        aria-label="Sponsored by EnderDash"
        className={cn("rounded-xl border bg-card/50", className)}
      >
        <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium text-muted-foreground">
              Sponsored by EnderDash
            </p>
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {sponsorTitle}
              </h2>
              <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
                {sponsorDescription}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-fit gap-2"
              >
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                >
                  Check it out
                  <ArrowUpRight />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                Single-plugin setup with commands, logs, files, team access, and
                AI assistance.
              </p>
            </div>
          </div>
          <div className="flex justify-start lg:justify-end">
            <SponsorLogo href={href} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <aside
      aria-label="Sponsored by EnderDash"
      className={cn("rounded-lg border bg-card/50 p-4 sm:p-5", className)}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <SponsorLogo href={href} />
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Sponsored
            </p>
            <p className="text-base font-semibold tracking-tight">
              {sponsorTitle}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {sponsorDescription}
            </p>
          </div>
        </div>
        <Button asChild variant="outline" className="w-fit gap-2 self-start">
          <a href={href} target="_blank" rel="noopener noreferrer sponsored">
            Check it out
            <ArrowUpRight />
          </a>
        </Button>
      </div>
    </aside>
  );
}
