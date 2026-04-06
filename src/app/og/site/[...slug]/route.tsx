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

function formatDate(date?: string | Date) {
  if (!date) return "Latest post";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
      const latestPosts = blogSource
        .getPages()
        .sort((a, b) => {
          const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
          const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 3);
      image = (
        <DirectoryOgImage
          label="Blog"
          title="SoulFire Blog"
          description="Latest tutorials, field notes, and deep dives on Minecraft bot testing and SoulFire development."
          accent="#ffb562"
          secondary="#ff7d99"
          samples={latestPosts.map((post) => ({
            title: post.data.title,
            subtitle:
              post.data.description ?? "Latest update from the SoulFire team.",
            meta: formatDate(post.data.date),
          }))}
        />
      );
      break;
    }
    case "get-proxies":
      image = (
        <DirectoryOgImage
          label="Proxies"
          title="Proxy Providers for Minecraft bot testing"
          description="Compare residential, datacenter, ISP, and mobile networks recommended for SoulFire sessions."
          accent="#58c7ff"
          secondary="#4a7dff"
          samples={PROXY_PROVIDERS.slice(0, 3).map((provider) => ({
            title: provider.name,
            subtitle: provider.testimonial,
            meta: provider.badges.slice(0, 3).join(" · "),
          }))}
        />
      );
      break;
    case "get-accounts":
      image = (
        <DirectoryOgImage
          label="Accounts"
          title="Minecraft account providers for SoulFire"
          description="Browse MFA and NFA suppliers with pricing, delivery details, and community feedback."
          accent="#75f1ba"
          secondary="#ffb562"
          samples={[
            ...new Map(
              ACCOUNT_PROVIDERS.map((provider) => [provider.slug, provider]),
            ).values(),
          ]
            .slice(0, 3)
            .map((provider) => ({
              title: provider.name,
              subtitle: provider.testimonial,
              meta: provider.price,
            }))}
        />
      );
      break;
    case "resources":
      image = (
        <DirectoryOgImage
          label="Resources"
          title="Plugins and scripts that extend SoulFire"
          description="Find community resources for automation, PvP, utility workflows, and custom bot behavior."
          accent="#b89cff"
          secondary="#58c7ff"
          samples={RESOURCES.slice(0, 3).map((resource) => ({
            title: resource.name,
            subtitle: resource.description,
            meta: `${resource.category} · ${resource.author}`,
          }))}
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
