import { ImageResponse } from "takumi-js/response";
import { notFound } from "next/navigation";
import { ProxyOgImage } from "@/components/og/site";
import { getProxyPageImage, stripOgSuffix } from "@/lib/og";
import { getOgAssetDataUri } from "@/lib/og-assets";
import { getProviderBySlug, PROVIDERS } from "@/lib/proxies-data";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/proxies/[...slug]">,
) {
  const { slug } = await params;
  const [providerSlug] = stripOgSuffix(slug);
  const provider = providerSlug ? getProviderBySlug(providerSlug) : undefined;
  if (!provider) notFound();

  return new ImageResponse(
    <ProxyOgImage
      name={provider.name}
      summary={provider.summary}
      badges={provider.badges}
      sponsor={provider.sponsor}
      logoSrc={await getOgAssetDataUri(provider.logo)}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}

export function generateStaticParams() {
  return PROVIDERS.map((provider) => ({
    slug: getProxyPageImage(provider.slug).segments,
  }));
}
