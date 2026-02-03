import type { Thing, WithContext } from "schema-dts";

export function JsonLd<T extends Thing>({ data }: { data: WithContext<T> }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD requires JSON.stringify which is safe
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
