import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Proxies",
  description:
    "Find high-quality proxy providers for bot testing with SoulFire. Compare residential, datacenter, ISP, and mobile proxies.",
};

export default function GetProxiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
