import { createFileRoute } from "@tanstack/react-router";
import HomePageContent from "@/app/(home)/page";
import { SiteShell } from "@/components/site-shell";
import {
  createStructuredDataGraph,
  createWebPageStructuredData,
  getCanonicalLinks,
  getPageMeta,
  jsonLdScript,
  siteDescription,
} from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: getPageMeta({
      title: "SoulFire - Advanced Minecraft Bot Tool",
      description: siteDescription,
      path: "/",
      imageUrl: "/og/site/home/image.webp",
      imageAlt: "SoulFire home page preview",
    }),
    links: getCanonicalLinks("/"),
    scripts: [
      jsonLdScript(
        createStructuredDataGraph([
          createWebPageStructuredData({
            path: "/",
            title: "SoulFire - Advanced Minecraft Bot Tool",
            description: siteDescription,
            imageUrl: "/og/site/home/image.webp",
          }),
        ]),
      ),
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteShell>
      <HomePageContent />
    </SiteShell>
  );
}
