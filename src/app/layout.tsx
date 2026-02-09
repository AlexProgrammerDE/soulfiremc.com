import "@/style.css";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#3289BF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
