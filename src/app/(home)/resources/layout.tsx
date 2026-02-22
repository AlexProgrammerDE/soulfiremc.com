import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Discover community SoulFire plugins and scripts. Browse, filter, and find resources to enhance your Minecraft bot automation.",
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
