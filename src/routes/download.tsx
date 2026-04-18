import { createFileRoute } from "@tanstack/react-router";
import DownloadPageContent from "@/app/(home)/download/page";
import { SiteShell } from "@/components/site-shell";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: getPageMeta({
      title: "Download SoulFire - SoulFire",
      description: "Pick your OS and CPU to grab the right SoulFire build.",
      path: "/download",
      imageUrl: "/og/site/download/image.webp",
      imageAlt: "SoulFire download page preview",
    }),
    links: getCanonicalLinks("/download"),
  }),
  component: DownloadPage,
});

function DownloadPage() {
  return (
    <SiteShell>
      <DownloadPageContent />
    </SiteShell>
  );
}
