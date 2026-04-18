import { createFileRoute } from "@tanstack/react-router";
import CookiePolicyContent from "@/app/(home)/cookie-policy/page";
import { SiteShell } from "@/components/site-shell";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/cookie-policy")({
  head: () => ({
    meta: getPageMeta({
      title: "Cookie Policy - SoulFire",
      description: "SoulFire Cookie Policy.",
      path: "/cookie-policy",
    }),
    links: getCanonicalLinks("/cookie-policy"),
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <SiteShell>
      <CookiePolicyContent />
    </SiteShell>
  );
}
