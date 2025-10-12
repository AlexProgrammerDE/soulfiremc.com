import type { InferPageType } from "fumadocs-core/source";
import { source } from "~/lib/source";

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}
URL: ${page.url}

${page.data.description}

${processed}`;
}

export async function getFullLLMText() {
  const scan = source.getPages().map(getLLMText);
  const scanned = await Promise.all(scan);

  return scanned.join("\n\n");
}
