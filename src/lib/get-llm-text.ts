import type { InferPageType } from "fumadocs-core/source";
import { getOpenApiPageText, isOpenApiPage } from "@/lib/docs/openapi";
import { source } from "@/lib/source";

export async function getLLMText(page: InferPageType<typeof source>) {
  if (isOpenApiPage(page)) {
    return getOpenApiPageText(page);
  }

  if (!("getText" in page.data)) {
    const title = page.data.title ?? page.slugs.at(-1) ?? "Docs";
    return `# ${title}
URL: ${page.url}

${page.data.description ?? ""}`;
  }

  const processed = await page.data.getText("processed");
  const title = page.data.title ?? page.slugs.at(-1) ?? "Docs";

  return `# ${title}
URL: ${page.url}

${page.data.description}

${processed}`;
}

export async function getFullLLMText() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return scanned.join("\n\n");
}
