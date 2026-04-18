import { createFileRoute } from "@tanstack/react-router";
import PricingPageContent from "@/app/(home)/pricing/page";
import { SiteShell } from "@/components/site-shell";
import {
  createStructuredDataGraph,
  createWebPageStructuredData,
  getCanonicalLinks,
  getPageMeta,
  jsonLdScript,
} from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: getPageMeta({
      title: "Pricing - SoulFire",
      description:
        "SoulFire is free and open source. Support the project and get priority help.",
      path: "/pricing",
      imageUrl: "/og/site/pricing/image.webp",
      imageAlt: "SoulFire pricing preview",
    }),
    links: getCanonicalLinks("/pricing"),
    scripts: [
      jsonLdScript(
        createStructuredDataGraph([
          createWebPageStructuredData({
            path: "/pricing",
            title: "Pricing - SoulFire",
            description:
              "SoulFire is free and open source. Support the project and get priority help.",
            imageUrl: "/og/site/pricing/image.webp",
          }),
        ]),
      ),
    ],
  }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <SiteShell>
      <PricingPageContent />
    </SiteShell>
  );
}
