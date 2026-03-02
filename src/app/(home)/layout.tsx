import { HomeLayout } from "fumadocs-ui/layouts/home";
import { type ReactNode, Suspense } from "react";
import Link from "next/link";
import { baseOptions } from "@/app/layout.config";
import { CopyrightYear } from "@/components/copyright-year";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <HomeLayout
      {...baseOptions}
      links={[
        {
          type: "main",
          text: "Documentation",
          url: "/docs",
          description: "Learn how to use SoulFire",
        },
        {
          type: "main",
          text: "Downloads",
          url: "/download",
          description: "Download SoulFire",
        },
        {
          type: "main",
          text: "Blog",
          url: "/blog",
          description: "SoulFire Blog",
        },
        {
          type: "main",
          text: "Get Accounts",
          url: "/get-accounts",
          description: "Get Accounts for SoulFire",
        },
        {
          type: "main",
          text: "Get Proxies",
          url: "/get-proxies",
          description: "Get Proxies for SoulFire",
        },
        {
          type: "main",
          text: "Resources",
          url: "/resources",
          description: "SoulFire plugins and scripts",
        },
        ...(baseOptions.links || []),
      ]}
    >
      {children}
      <footer className="border-t py-6 text-sm text-fd-muted-foreground">
        <div className="mx-auto flex w-full max-w-[var(--fd-layout-width)] flex-col items-center gap-2 px-4 sm:flex-row sm:justify-between">
          <p>&copy; <Suspense><CopyrightYear /></Suspense> SoulFire</p>
          <nav className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-fd-foreground">
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-fd-foreground"
            >
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="hover:text-fd-foreground">
              Cookie Policy
            </Link>
            <Link href="/imprint" className="hover:text-fd-foreground">
              Imprint
            </Link>
          </nav>
        </div>
      </footer>
    </HomeLayout>
  );
}
