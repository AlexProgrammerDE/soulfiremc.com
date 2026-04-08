import { AuthView } from "@daveyplate/better-auth-ui";
import { authViewPaths } from "@daveyplate/better-auth-ui/server";
import { AuthProvider } from "@/components/auth-provider";

export function generateStaticParams() {
  return Object.values(authViewPaths).map((path) => ({ path }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  return (
    <main className="flex min-h-[60vh] items-center justify-center p-4">
      <AuthProvider>
        <AuthView path={path} />
      </AuthProvider>
    </main>
  );
}
