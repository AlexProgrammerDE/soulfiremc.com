import type { InferPageType } from "fumadocs-core/source";

async function getBlogSource() {
  const { blogSource } = await import("@/lib/source");
  return blogSource;
}

type BlogPage = InferPageType<Awaited<ReturnType<typeof getBlogSource>>>;

function normalizeDate(value: string | Date | undefined) {
  if (!value) {
    return undefined;
  }

  return value instanceof Date ? value.toISOString() : value;
}

export function getReadingTime(structuredData?: {
  contents?: { content: string }[];
}) {
  const text =
    structuredData?.contents?.map((item) => item.content).join(" ") ?? "";
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export async function getSortedBlogPages() {
  const blogSource = await getBlogSource();
  return blogSource.getPages().sort((left, right) => {
    const leftDate = left.data.date ? new Date(left.data.date).getTime() : 0;
    const rightDate = right.data.date ? new Date(right.data.date).getTime() : 0;
    return rightDate - leftDate;
  });
}

export function getBlogPostSummary(page: BlogPage) {
  const slug =
    page.slugs[0] ?? page.url.split("/").filter(Boolean).at(-1) ?? "";

  return {
    author: page.data.author,
    date: normalizeDate(page.data.date),
    description: page.data.description,
    path: page.path,
    readingTime: getReadingTime(page.data.structuredData),
    slug,
    structuredData: page.data.structuredData,
    tags: page.data.tags ?? [],
    title: page.data.title,
    url: page.url,
    cover: page.data.cover,
  };
}

export async function getAllBlogPostSummaries() {
  return (await getSortedBlogPages()).map(getBlogPostSummary);
}

export async function getBlogPostData(slug: string) {
  const blogSource = await getBlogSource();
  const page = blogSource.getPage([slug]);
  if (!page) {
    return undefined;
  }

  const post = getBlogPostSummary(page);
  const relatedPosts =
    post.tags.length > 0
      ? (await getAllBlogPostSummaries())
          .filter((candidate) => candidate.slug !== slug)
          .filter((candidate) =>
            candidate.tags.some((tag) => post.tags.includes(tag)),
          )
          .slice(0, 3)
      : [];

  return {
    path: page.path,
    post,
    relatedPosts,
  };
}
