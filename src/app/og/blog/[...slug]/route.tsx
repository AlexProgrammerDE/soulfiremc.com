import { ImageResponse } from "@takumi-rs/image-response";
import { notFound } from "next/navigation";
import { BlogOgImage } from "@/components/og/soulfire";
import { getBlogPageImage, stripOgSuffix } from "@/lib/og";
import { blogSource } from "@/lib/source";

function getReadingTime(structuredData?: { contents?: { content: string }[] }) {
  const text =
    structuredData?.contents?.map((item) => item.content).join(" ") ?? "";
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min`;
}

function formatDate(date?: string | Date) {
  if (!date) return undefined;
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/blog/[...slug]">,
) {
  const { slug } = await params;
  const page = blogSource.getPage(stripOgSuffix(slug));
  if (!page) notFound();

  return new ImageResponse(
    <BlogOgImage
      title={page.data.title}
      description={page.data.description}
      author={page.data.author}
      date={formatDate(page.data.date)}
      tags={page.data.tags}
      readTime={getReadingTime(page.data.structuredData)}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: getBlogPageImage(page).segments,
  }));
}
