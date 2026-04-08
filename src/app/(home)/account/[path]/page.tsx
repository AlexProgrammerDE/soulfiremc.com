import { AccountView } from "@daveyplate/better-auth-ui";
import { accountViewPaths } from "@daveyplate/better-auth-ui/server";
import { AuthProvider } from "@/components/auth-provider";

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((path) => ({ path }));
}

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="mx-auto max-w-(--fd-layout-width) p-4 md:p-6">
      <AuthProvider>
        <AccountView path={path} />
      </AuthProvider>
    </main>
  );
}
