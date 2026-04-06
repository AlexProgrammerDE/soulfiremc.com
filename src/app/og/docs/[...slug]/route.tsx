import { ImageResponse } from "@takumi-rs/image-response";
import { notFound } from "next/navigation";
import { DocsOgImage } from "@/components/og/soulfire";
import { getOgAssetDataUri } from "@/lib/og-assets";
import { getDocsPageImage, stripOgSuffix } from "@/lib/og";
import { source } from "@/lib/source";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">,
) {
  const { slug } = await params;
  const page = source.getPage(stripOgSuffix(slug));
  if (!page) notFound();

  return new ImageResponse(
    <DocsOgImage
      title={page.data.title}
      description={page.data.description}
      slugs={page.slugs}
      logoSrc={await getOgAssetDataUri("/logo-square.svg")}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}

export function generateStaticParams() {
  return source.getPages().map((page) => ({
    slug: getDocsPageImage(page).segments,
  }));
}
