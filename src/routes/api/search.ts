import { createFileRoute } from "@tanstack/react-router";
import { createFromSource } from "fumadocs-core/search/server";

type SearchStructuredData = {
  contents: Array<{ content: string; heading: string }>;
  headings: Array<{ content: string; id: string }>;
};

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

export const Route = createFileRoute("/api/search")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const [{ getOpenApiStructuredData }, { getSource }] = await Promise.all([
          import("@/lib/docs/openapi"),
          import("@/lib/source"),
        ]);

        return createFromSource(await getSource(), {
          buildIndex: async (page) => {
            const source = await getSource();
            const breadcrumbs = ["Docs"];
            for (let index = 0; index < page.slugs.length - 1; index++) {
              const parentPage = source.getPage(page.slugs.slice(0, index + 1));
              if (parentPage?.data.title) {
                breadcrumbs.push(parentPage.data.title);
              }
            }

            const pageData: unknown = page.data;
            const structuredData = page.data.type === "openapi"
              ? await getOpenApiStructuredData(page as any)
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
          language: "english",
        }).GET(request);
      },
    },
  },
});
