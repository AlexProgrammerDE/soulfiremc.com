import type { Metadata } from "next";

export function imageMetadata(
  image?: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
      url: "./",
      siteName: "SoulFire",
      type: "website",
      images: [image ?? "/og/site/home/image.webp"],
    },
    twitter: {
      site: "https://soulfiremc.com",
      card: "summary_large_image",
      images: [image ?? "/og/site/home/image.webp"],
    },
  };
}
