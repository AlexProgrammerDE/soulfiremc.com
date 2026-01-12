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
          type: "main",
          text: "Downloads",
          url: "/download",
          on: "nav",
        },
        {
          text: "Get Accounts",
          url: "/get-accounts",
        },
        {
          text: "Get Proxies",
          url: "/get-proxies",
        },
        ...(baseOptions.links || []),
      ]}
    >
      {children}
    </HomeLayout>
  );
}
