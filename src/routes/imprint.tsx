import { createFileRoute } from "@tanstack/react-router";
import ImprintContent from "@/app/(home)/imprint/page";
import { SiteShell } from "@/components/site-shell";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/imprint")({
  head: () => ({
    meta: getPageMeta({
      title: "Imprint - SoulFire",
      description: "SoulFire Legal Notice (Impressum).",
      path: "/imprint",
    }),
    links: getCanonicalLinks("/imprint"),
  }),
  component: ImprintPage,
});

function ImprintPage() {
  return (
    <SiteShell>
      <ImprintContent />
    </SiteShell>
  );
}
