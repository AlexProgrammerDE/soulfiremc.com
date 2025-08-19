import type { MetadataRoute } from 'next';
import { source } from '~/lib/source';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...process.env.SITEMAP_PAGES!.split('|').map(
      (page) =>
        ({
          url: `https://soulfiremc.com${page}`,
          lastModified: new Date(),
          changeFrequency: 'daily',
          priority: 0.7,
        }) satisfies MetadataRoute.Sitemap[number],
    ),
    ...source.getPages().map((page) => {
      const { lastModified } = page.data;
      return {
        url: `https://soulfiremc.com${page.url}`,
        lastModified: lastModified ? new Date(lastModified) : undefined,
        changeFrequency: 'weekly',
        priority: 0.5,
      } satisfies MetadataRoute.Sitemap[number];
    }),
  ];
}
