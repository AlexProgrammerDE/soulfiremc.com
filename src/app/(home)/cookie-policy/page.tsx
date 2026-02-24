import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "SoulFire Cookie Policy.",
};

export default function CookiePolicy() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto prose">
      <h1>Cookie Policy</h1>
      <p>
        This is a placeholder Cookie Policy page. Please replace this with your
        actual cookie policy before launching.
      </p>
    </main>
  );
}
