import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/[lang]/layout.config";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  const options = baseOptions(lang);

  return (
    <HomeLayout
      {...options}
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
        ...(options.links || []),
      ]}
    >
      {children}
    </HomeLayout>
  );
}
