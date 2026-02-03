import { InlineTOC } from "fumadocs-ui/components/inline-toc";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { BlogPosting, WithContext } from "schema-dts";
import { ShareButton } from "@/components/blog/share-button";
import { JsonLd } from "@/components/json-ld";
import { blogSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  const MDX = page.data.body;

  const jsonLd: WithContext<BlogPosting> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: page.data.title,
    description: page.data.description,
    image: page.data.cover
      ? `https://soulfiremc.com${page.data.cover}`
      : "https://soulfiremc.com/logo.png",
    datePublished: page.data.date
      ? new Date(page.data.date).toISOString()
      : undefined,
    dateModified: page.data.date
      ? new Date(page.data.date).toISOString()
      : undefined,
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

  return (
    <article className="container mx-auto py-12 px-4 max-w-4xl">
      <JsonLd data={jsonLd} />
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Blog
      </Link>

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
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {page.data.author && <span>By {page.data.author}</span>}
            {page.data.date && (
              <time dateTime={new Date(page.data.date).toISOString()}>
                {new Date(page.data.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            )}
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
