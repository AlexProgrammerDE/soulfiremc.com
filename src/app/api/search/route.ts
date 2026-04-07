import { createFromSource } from "fumadocs-core/search/server";
import { getOpenApiStructuredData, isOpenApiPage } from "@/lib/docs/openapi";
import { source } from "@/lib/source";

type SearchStructuredData = Awaited<ReturnType<typeof getOpenApiStructuredData>>;

function hasStructuredData(
  data: unknown,
): data is { structuredData: SearchStructuredData } {
  return (
    typeof data === "object" &&
    data !== null &&
    "structuredData" in data &&
    data.structuredData !== undefined
  );
}

function hasStructuredDataLoader(
  data: unknown,
): data is { load: () => Promise<{ structuredData?: SearchStructuredData }> } {
  return (
    typeof data === "object" &&
    data !== null &&
    "load" in data &&
    typeof data.load === "function"
  );
}

export const { GET } = createFromSource(source, {
  buildIndex: async (page) => {
    const breadcrumbs = ["Docs"];
    for (let i = 0; i < page.slugs.length - 1; i++) {
      const parentPage = source.getPage(page.slugs.slice(0, i + 1));
      if (parentPage?.data.title) {
        breadcrumbs.push(parentPage.data.title);
      }
    }

    const pageData: unknown = page.data;
    const structuredData = isOpenApiPage(page)
      ? await getOpenApiStructuredData(page)
      : hasStructuredData(pageData)
        ? pageData.structuredData
        : hasStructuredDataLoader(pageData)
          ? (await pageData.load()).structuredData
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
