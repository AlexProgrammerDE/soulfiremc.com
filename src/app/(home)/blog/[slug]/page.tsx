import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { ChevronRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPosting, BreadcrumbList, WithContext } from "schema-dts";
import { ShareButton } from "@/components/blog/share-button";
import { JsonLd } from "@/components/json-ld";
import { blogSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

function getReadingTime(structuredData: {
  contents: { content: string }[];
}): number {
  const text = structuredData.contents.map((c) => c.content).join(" ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function getRelatedPosts(
  currentSlug: string,
  currentTags: string[] | undefined,
  limit = 3,
) {
  if (!currentTags || currentTags.length === 0) return [];

  return blogSource
    .getPages()
    .filter((p) => p.slugs[0] !== currentSlug)
    .map((p) => {
      const shared = p.data.tags?.filter((t) => currentTags.includes(t)) ?? [];
      return { page: p, sharedCount: shared.length };
    })
    .filter((p) => p.sharedCount > 0)
    .sort((a, b) => b.sharedCount - a.sharedCount)
    .slice(0, limit)
    .map((p) => p.page);
}

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  const MDX = page.data.body;
  const readingTime = getReadingTime(page.data.structuredData);
  const relatedPosts = getRelatedPosts(params.slug, page.data.tags);
  const lastModified = page.data.lastModified
    ? new Date(page.data.lastModified)
    : undefined;
  const publishDate = page.data.date ? new Date(page.data.date) : undefined;
  const showLastModified =
    lastModified &&
    publishDate &&
    lastModified.toDateString() !== publishDate.toDateString();

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: page.data.title,
    description: page.data.description,
    image: page.data.cover
      ? `https://soulfiremc.com${page.data.cover}`
      : "https://soulfiremc.com/logo.png",
    datePublished: publishDate?.toISOString(),
    dateModified: lastModified?.toISOString() ?? publishDate?.toISOString(),
    author: page.data.author
      ? {
          "@type": "Person",
          name: page.data.author,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "SoulFire",
      logo: {
        "@type": "ImageObject",
        url: "https://soulfiremc.com/logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://soulfiremc.com${page.url}`,
    },
    keywords: page.data.tags?.join(", "),
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://soulfiremc.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://soulfiremc.com/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: page.data.title,
        item: `https://soulfiremc.com${page.url}`,
      },
    ],
  };

  return (
    <article className="container mx-auto py-12 px-4 max-w-4xl">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/blog" className="hover:text-foreground transition-colors">
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground truncate">{page.data.title}</span>
      </nav>

      <header className="mb-8">
        {page.data.cover && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8">
            <Image
              src={page.data.cover}
              alt={page.data.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            {page.data.author && <span>By {page.data.author}</span>}
            {publishDate && (
              <time dateTime={publishDate.toISOString()}>
                {publishDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
            {showLastModified && (
              <span>
                Updated{" "}
                <time dateTime={lastModified.toISOString()}>
                  {lastModified.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {readingTime} min read
            </span>
          </div>
          <ShareButton
            title={page.data.title}
            description={page.data.description}
            url={`https://soulfiremc.com${page.url}`}
          />
        </div>

        <h1 className="text-5xl font-bold mb-4">{page.data.title}</h1>
        {page.data.description && (
          <p className="text-xl text-muted-foreground mb-4">
            {page.data.description}
          </p>
        )}

        {page.data.tags && page.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {page.data.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {page.data.toc && page.data.toc.length > 0 && (
          <div className="my-8">
            <InlineTOC items={page.data.toc} />
          </div>
        )}
      </header>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <MDX components={getMDXComponents()} />
      </div>

      {relatedPosts.length > 0 && (
        <aside className="mt-16 border-t pt-10">
          <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((post) => (
              <Link
                key={post.url}
                href={post.url}
                className="group flex flex-col overflow-hidden rounded-lg border bg-card transition-all hover:shadow-md"
              >
                {post.data.cover && (
                  <div className="relative aspect-video w-full overflow-hidden bg-muted">
                    <Image
                      src={post.data.cover}
                      alt={post.data.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {post.data.title}
                  </h3>
                  {post.data.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {post.data.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}

export async function generateStaticParams() {
  return blogSource.generateParams().map((params) => ({
    slug: params.slug?.[0] ?? "",
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  const ogImage = `/blog-og/${params.slug}/image.png`;

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      images: ogImage,
      type: "article",
      publishedTime: page.data.date
        ? new Date(page.data.date).toISOString()
        : undefined,
      modifiedTime: page.data.lastModified
        ? new Date(page.data.lastModified).toISOString()
        : undefined,
      authors: page.data.author ? [page.data.author] : undefined,
      tags: page.data.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: page.data.title,
      description: page.data.description,
      images: ogImage,
    },
  };
}
