import { ImageResponse } from "@takumi-rs/image-response";
import { notFound } from "next/navigation";
import { AccountOgImage } from "@/components/og/soulfire";
import { getShopBySlug, SHOPS } from "@/lib/accounts-data";
import { getAccountPageImage, stripOgSuffix } from "@/lib/og";
import { getOgAssetDataUri } from "@/lib/og-assets";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/accounts/[...slug]">,
) {
  const { slug } = await params;
  const [shopSlug] = stripOgSuffix(slug);
  const shop = shopSlug ? getShopBySlug(shopSlug) : undefined;
  if (!shop) notFound();

  const listings = Object.entries(shop.listings).map(([category, listing]) => ({
    label: category === "mfa-accounts" ? "MFA" : "NFA",
    price: listing.price,
  }));
  const description =
    Object.values(shop.listings)[0]?.testimonial ??
    "Minecraft account provider for SoulFire bot testing.";

  return new ImageResponse(
    <AccountOgImage
      name={shop.name}
      listings={listings}
      description={description}
      logoSrc={await getOgAssetDataUri(shop.logo)}
    />,
    {
      width: 1200,
      height: 630,
      format: "webp",
    },
  );
}

export function generateStaticParams() {
  return SHOPS.map((shop) => ({
    slug: getAccountPageImage(shop.slug).segments,
  }));
}
