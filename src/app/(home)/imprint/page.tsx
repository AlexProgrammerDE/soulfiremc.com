import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Imprint",
  description: "SoulFire Legal Notice (Impressum).",
};

export default function Imprint() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto prose">
      <h1>Imprint (Impressum)</h1>
      <p>
        <strong>Last updated:</strong> March 2, 2026
      </p>

      <p>
        Information in accordance with § 5 DDG (German Digital Services Act /
        Digitale-Dienste-Gesetz).
      </p>

      <h2>Service Provider</h2>
      <address className="not-italic">
        Alexander Kremer
        <br />
        c/o Postflex #10581
        <br />
        Emsdettener Str. 10
        <br />
        48268 Greven
        <br />
        Germany
      </address>
      <p>
        <strong>Note:</strong> No packages or parcels — acceptance will be
        refused. (Keine Pakete oder Päckchen — Annahme wird verweigert!)
      </p>

      <h2>Contact</h2>
      <p>
        Email:{" "}
        <a href="mailto:support@soulfiremc.com">support@soulfiremc.com</a>
      </p>

      <h2>Responsible for Content</h2>
      <p>
        Responsible for content according to § 18 Abs. 2 MStV
        (Medienstaatsvertrag):
      </p>
      <address className="not-italic">
        Alexander Kremer
        <br />
        c/o Postflex #10581
        <br />
        Emsdettener Str. 10
        <br />
        48268 Greven
        <br />
        Germany
      </address>

      <h2>EU Dispute Resolution</h2>
      <p>
        The European Commission provides a platform for online dispute
        resolution (ODR):{" "}
        <a
          href="https://ec.europa.eu/consumers/odr/"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://ec.europa.eu/consumers/odr/
        </a>
        . We are neither willing nor obliged to participate in dispute resolution
        proceedings before a consumer arbitration board.
      </p>

      <h2>Related Legal Documents</h2>
      <ul>
        <li>
          <Link href="/privacy-policy">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/terms-of-service">Terms of Service</Link>
        </li>
        <li>
          <Link href="/cookie-policy">Cookie Policy</Link>
        </li>
      </ul>
    </main>
  );
}
