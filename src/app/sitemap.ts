import type { MetadataRoute } from "next";
import { i18n } from "@/lib/i18n";
import { blogSource, source } from "@/lib/source";

function languageAlternates(enPath: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const lang of i18n.languages) {
    if (lang === i18n.defaultLanguage) {
      alternates[lang] = `https://soulfiremc.com${enPath}`;
    } else {
      alternates[lang] = `https://soulfiremc.com/${lang}${enPath}`;
    }
  }
  return alternates;
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...(process.env.SITEMAP_PAGES as string).split("|").map(
      (page) =>
        ({
          url: `https://soulfiremc.com${page}`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.7,
          alternates: {
            languages: languageAlternates(page),
          },
        }) satisfies MetadataRoute.Sitemap[number],
    ),
    ...source.getPages().map((page) => {
      const { lastModified } = page.data;
      return {
        url: `https://soulfiremc.com${page.url}`,
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: "weekly",
        priority: 0.5,
        alternates: {
          languages: languageAlternates(page.url),
        },
      } satisfies MetadataRoute.Sitemap[number];
    }),
    ...blogSource.getPages().map((page) => {
      const { date } = page.data;
      return {
        url: `https://soulfiremc.com${page.url}`,
        lastModified: date ? new Date(date) : undefined,
        changeFrequency: "weekly",
        priority: 0.6,
        alternates: {
          languages: languageAlternates(page.url),
        },
      } satisfies MetadataRoute.Sitemap[number];
    }),
  ];
}
