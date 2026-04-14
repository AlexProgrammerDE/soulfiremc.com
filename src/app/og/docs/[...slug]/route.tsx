import { ImageResponse } from "takumi-js/response";
import { notFound } from "next/navigation";
import { DocsOgImage } from "@/components/og/soulfire";
import { getDocsPageImage, stripOgSuffix } from "@/lib/og";
import { getOgAssetDataUri } from "@/lib/og-assets";
import { source } from "@/lib/source";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/docs/[...slug]">,
) {
  const { slug } = await params;
  const page = source.getPage(stripOgSuffix(slug));
  if (!page) notFound();
  const title = page.data.title ?? page.slugs.at(-1) ?? "Docs";

  return new ImageResponse(
    <DocsOgImage
      title={title}
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
