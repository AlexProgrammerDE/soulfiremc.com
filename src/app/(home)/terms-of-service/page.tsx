import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "SoulFire Terms of Service.",
};

export default function TermsOfService() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto prose">
      <h1>Terms of Service</h1>
      <p>
        This is a placeholder Terms of Service page. Please replace this with
        your actual terms of service before launching.
      </p>
    </main>
  );
}
