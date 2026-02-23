import { AccountView } from "@daveyplate/better-auth-ui";
import { accountViewPaths } from "@daveyplate/better-auth-ui/server";

export const dynamicParams = false;

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
    <main className="mx-auto max-w-3xl p-4 md:p-6">
      <AccountView path={path} />
    </main>
  );
}
