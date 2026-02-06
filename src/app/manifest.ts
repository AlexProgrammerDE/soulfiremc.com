import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "SoulFire",
    short_name: "SoulFire",
    description:
      "Advanced Minecraft bot tool for testing, automation, and development.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#3289BF",
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
