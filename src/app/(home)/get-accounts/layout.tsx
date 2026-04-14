import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minecraft Alts, MFA & NFA Accounts",
  description:
    "Compare Minecraft alt shops and account providers for SoulFire. Browse MFA full-access accounts, NFA temporary accounts, and token or cookie alts.",
};

export default function GetAccountsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
