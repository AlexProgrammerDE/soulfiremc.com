import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";
import { baseOptions } from "@/app/layout.config";

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
          text: "Downloads",
          url: "/download",
          description: "Download SoulFire",
        },
        {
          text: "Get Accounts",
          url: "/get-accounts",
          description: "Get Accounts for SoulFire",
        },
        {
          text: "Get Proxies",
          url: "/get-proxies",
          description: "Get Proxies for SoulFire",
        },
        ...(baseOptions.links || []),
      ]}
    >
      {children}
    </HomeLayout>
  );
}
