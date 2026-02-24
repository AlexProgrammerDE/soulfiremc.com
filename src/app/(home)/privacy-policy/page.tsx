import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "SoulFire Privacy Policy.",
};

export default function PrivacyPolicy() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto prose">
      <h1>Privacy Policy</h1>
      <p>
        This is a placeholder Privacy Policy page. Please replace this with your
        actual privacy policy before launching.
      </p>
    </main>
  );
}
