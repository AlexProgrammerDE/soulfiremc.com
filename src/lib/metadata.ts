import type { Metadata } from "next";

const DEFAULT_IMAGE = "/logo.png";

export function imageMetadata(
  image?: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      // https://github.com/vercel/next.js/discussions/50189#discussioncomment-10826632
      url: "./",
      siteName: "SoulFire",
      type: "website",
      images: [image ?? DEFAULT_IMAGE],
    },
    twitter: {
      site: "https://soulfiremc.com",
      card: "summary",
      images: [image ?? DEFAULT_IMAGE],
    },
  };
}
