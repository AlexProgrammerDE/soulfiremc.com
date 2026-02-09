import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Minecraft Accounts",
  description:
    "Find reliable Minecraft account providers for bot testing with SoulFire. Compare high-quality alts and MFA accounts.",
};

export default function GetAccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
