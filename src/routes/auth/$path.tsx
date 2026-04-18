import { AuthView } from "@daveyplate/better-auth-ui";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site-shell";

export const Route = createFileRoute("/auth/$path")({
  component: AuthPage,
});

function AuthPage() {
  const { path } = Route.useParams();

  return (
    <SiteShell>
      <main className="flex min-h-[60vh] items-center justify-center p-4">
        <AuthView path={path} />
      </main>
    </SiteShell>
  );
}
