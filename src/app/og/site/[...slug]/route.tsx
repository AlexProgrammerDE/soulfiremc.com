import { ImageResponse } from "@takumi-rs/image-response";
import { notFound } from "next/navigation";
import type { ReactElement } from "react";
import {
  DirectoryOgImage,
  DownloadOgImage,
  HomeOgImage,
} from "@/components/og/soulfire";
import { PROVIDERS as ACCOUNT_PROVIDERS } from "@/lib/accounts-data";
import { getSitePageImage, SITE_OG_PAGES, stripOgSuffix } from "@/lib/og";
import { PROVIDERS as PROXY_PROVIDERS } from "@/lib/proxies-data";
import { RESOURCES } from "@/lib/resources-data";
import { blogSource } from "@/lib/source";

export async function GET(
  _req: Request,
  { params }: RouteContext<"/og/site/[...slug]">,
) {
  const { slug } = await params;
  const [page] = stripOgSuffix(slug);

  if (!page) notFound();

  let image: ReactElement;

  switch (page) {
    case "home":
      image = <HomeOgImage />;
      break;
    case "download":
      image = <DownloadOgImage />;
      break;
    case "blog": {
      const allPosts = blogSource.getPages();
      image = (
        <DirectoryOgImage
          label="Blog"
          title="SoulFire Blog"
          description="Tutorials, field notes, and deep dives on Minecraft bot testing and development."
          accent="#ffb562"
          secondary="#ff7d99"
          count={allPosts.length}
          samples={allPosts
            .sort((a, b) => {
              const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
              const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
              return dateB - dateA;
            })
            .map((post) => post.data.title)}
        />
      );
      break;
    }
    case "get-proxies":
      image = (
        <DirectoryOgImage
          label="Proxies"
          title="Proxy Providers for SoulFire"
          description="Residential, datacenter, ISP, and mobile networks tested with SoulFire sessions."
          accent="#58c7ff"
          secondary="#4a7dff"
          count={PROXY_PROVIDERS.length}
          samples={PROXY_PROVIDERS.map((p) => p.name)}
        />
      );
      break;
    case "get-accounts": {
      const uniqueProviders = [
        ...new Map(
          ACCOUNT_PROVIDERS.map((p) => [p.slug, p]),
        ).values(),
      ];
      image = (
        <DirectoryOgImage
          label="Accounts"
          title="Minecraft Accounts for SoulFire"
          description="MFA and NFA providers with pricing and delivery details."
          accent="#75f1ba"
          secondary="#ffb562"
          count={uniqueProviders.length}
          samples={uniqueProviders.map((p) => p.name)}
        />
      );
      break;
    }
    case "resources":
      image = (
        <DirectoryOgImage
          label="Resources"
          title="Plugins and Scripts for SoulFire"
          description="Community resources for automation, PvP, utility, and custom bot behavior."
          accent="#b89cff"
          secondary="#58c7ff"
          count={RESOURCES.length}
          samples={RESOURCES.map((r) => r.name)}
        />
      );
      break;
    default:
      notFound();
  }

  return new ImageResponse(image, {
    width: 1200,
    height: 630,
    format: "webp",
  });
}

export function generateStaticParams() {
  return SITE_OG_PAGES.map((page) => ({
    slug: getSitePageImage(page).segments,
  }));
}
