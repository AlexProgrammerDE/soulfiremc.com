import { createFileRoute } from "@tanstack/react-router";
import PrivacyPolicyContent from "@/app/(home)/privacy-policy/page";
import { SiteShell } from "@/components/site-shell";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: getPageMeta({
      title: "Privacy Policy - SoulFire",
      description: "SoulFire Privacy Policy.",
      path: "/privacy-policy",
    }),
    links: getCanonicalLinks("/privacy-policy"),
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <SiteShell>
      <PrivacyPolicyContent />
    </SiteShell>
  );
}
