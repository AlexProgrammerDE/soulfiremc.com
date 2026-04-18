import { AccountView } from "@daveyplate/better-auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/account/$path")({
  component: AccountPage,
});

function AccountPage() {
  const { path } = Route.useParams();

  return (
    <SiteShell>
      <main className="mx-auto max-w-(--fd-layout-width) p-4 md:p-6">
        <AccountView path={path} />
      </main>
    </SiteShell>
  );
}
