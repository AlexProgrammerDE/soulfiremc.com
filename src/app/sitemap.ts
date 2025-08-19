import type {MetadataRoute} from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return process.env.SITEMAP_PAGES.split("|").map(page => ({
    url: `https://soulfiremc.com${page}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))
}
