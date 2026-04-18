import { createFileRoute } from "@tanstack/react-router";
import TermsOfServiceContent from "@/app/(home)/terms-of-service/page";
import { SiteShell } from "@/components/site-shell";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: getPageMeta({
      title: "Terms of Service - SoulFire",
      description: "SoulFire Terms of Service.",
      path: "/terms-of-service",
    }),
    links: getCanonicalLinks("/terms-of-service"),
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <SiteShell>
      <TermsOfServiceContent />
    </SiteShell>
  );
}
