import { createFromSource } from "fumadocs-core/search/server";
import {
  getOpenApiStructuredData,
  isOpenApiPage,
} from "@/lib/docs/openapi";
import { source } from "@/lib/source";

export const { GET } = createFromSource(source, {
  buildIndex: async (page) => {
    const breadcrumbs = ["Docs"];
    for (let i = 0; i < page.slugs.length - 1; i++) {
      const parentPage = source.getPage(page.slugs.slice(0, i + 1));
      if (parentPage?.data.title) {
        breadcrumbs.push(parentPage.data.title);
      }
    }

    const structuredData = isOpenApiPage(page)
      ? await getOpenApiStructuredData(page)
      : "structuredData" in page.data
        ? page.data.structuredData
        : "load" in page.data && typeof page.data.load === "function"
          ? (await page.data.load()).structuredData
          : undefined;

    if (!structuredData) {
      throw new Error(
        `Cannot build search index for docs page without structured data: ${page.url}`,
      );
    }

    return {
      breadcrumbs,
      description: page.data.description,
      id: page.url,
      structuredData,
      title: page.data.title ?? page.slugs.at(-1) ?? "Docs",
      url: page.url,
    };
  },
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
});
