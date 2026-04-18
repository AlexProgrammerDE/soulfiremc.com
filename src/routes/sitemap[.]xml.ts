import { createFileRoute } from "@tanstack/react-router";
import { SHOPS } from "@/lib/accounts-data";
import { getSortedBlogPages } from "@/lib/blog";
import { SITE_OG_PAGES } from "@/lib/og";
import { PROVIDERS as PROXY_PROVIDERS } from "@/lib/proxies-data";
import { RESOURCES } from "@/lib/resources-data";
import { absoluteUrl } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { getSource } = await import("@/lib/source");
        const source = await getSource();
        const urls = [
          "/",
          "/download",
          "/blog",
          "/pricing",
          "/privacy-policy",
          "/terms-of-service",
          "/cookie-policy",
          "/imprint",
          "/get-accounts",
          "/get-proxies",
          "/resources",
          ...source.getPages().map((page) => page.url),
          ...(await getSortedBlogPages()).map((page) => page.url),
          ...SHOPS.map((shop) => `/get-accounts/${shop.slug}`),
          ...PROXY_PROVIDERS.map((provider) => `/get-proxies/${provider.slug}`),
          ...RESOURCES.map((resource) => `/resources/${resource.slug}`),
          ...SITE_OG_PAGES.map((page) => `/og/site/${page}/image.webp`),
        ];

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((url) => `  <url><loc>${escapeXml(absoluteUrl(url))}</loc></url>`)
  .join("\n")}
</urlset>`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
          },
        });
      },
    },
  },
});
