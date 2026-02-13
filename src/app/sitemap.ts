import type { MetadataRoute } from "next";
import { blogSource, source } from "@/lib/source";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  "use cache";

  return [
    ...(process.env.SITEMAP_PAGES as string).split("|").map(
      (page) =>
        ({
          url: `https://soulfiremc.com${page}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.7,
        }) satisfies MetadataRoute.Sitemap[number],
    ),
    ...source.getPages().map((page) => {
      const { lastModified } = page.data;
      return {
        url: `https://soulfiremc.com${page.url}`,
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: "weekly",
        priority: 0.5,
      } satisfies MetadataRoute.Sitemap[number];
    }),
    ...blogSource.getPages().map((page) => {
      const { date } = page.data;
      return {
        url: `https://soulfiremc.com${page.url}`,
        lastModified: date ? new Date(date) : undefined,
        changeFrequency: "weekly",
        priority: 0.6,
      } satisfies MetadataRoute.Sitemap[number];
    }),
  ];
}
