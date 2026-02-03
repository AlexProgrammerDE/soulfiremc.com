import { blogSource } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export default async function BlogPost(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const page = blogSource.getPage([params.slug]);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <article className="container mx-auto py-12 px-4 max-w-3xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{page.data.title}</h1>
        {page.data.description && (
          <p className="text-xl text-muted-foreground mb-4">
            {page.data.description}
          </p>
        )}
        <div className="flex gap-4 text-sm text-muted-foreground">
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

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
