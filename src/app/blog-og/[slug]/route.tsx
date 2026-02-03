import { generateOGImage } from "fumadocs-ui/og";
import { notFound } from "next/navigation";
import { blogSource } from "@/lib/source";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const page = blogSource.getPage([slug]);
  if (!page) notFound();

  return generateOGImage({
    title: page.data.title,
    description: page.data.description,
    site: "SoulFire Blog",
  });
}

export function generateStaticParams() {
  return blogSource.getPages().map((page) => ({
    slug: page.slugs[0],
  }));
}
