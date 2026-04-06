import { ImageResponse } from "@takumi-rs/image-response";
import { notFound } from "next/navigation";
import { ResourceOgImage } from "@/components/og/soulfire";
import { getResourcePageImage, stripOgSuffix } from "@/lib/og";
import { getOgAssetDataUri } from "@/lib/og-assets";
import { getResourceBySlug, RESOURCES } from "@/lib/resources-data";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/resources/[...slug]">,
) {
  const { slug } = await params;
  const [resourceSlug] = stripOgSuffix(slug);
  const resource = resourceSlug ? getResourceBySlug(resourceSlug) : undefined;
  if (!resource) notFound();

  return new ImageResponse(
    <ResourceOgImage
      name={resource.name}
      description={resource.description}
      author={resource.author}
      category={resource.category}
      badges={resource.badges}
      version={resource.version}
      logoSrc={await getOgAssetDataUri(resource.logo)}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}

export function generateStaticParams() {
  return RESOURCES.map((resource) => ({
    slug: getResourcePageImage(resource.slug).segments,
  }));
}
