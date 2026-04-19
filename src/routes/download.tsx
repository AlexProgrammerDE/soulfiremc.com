import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createServerDownloads } from "@/app/(home)/download/download-data";
import DownloadPageContent from "@/app/(home)/download/page";
import { SiteShell } from "@/components/site-shell";
import {
  getClientRelease,
  getReleaseVersion,
  getServerRelease,
} from "@/lib/releases";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";

const downloadPageLoader = createServerFn({ method: "GET" }).handler(
  async () => {
    const [clientRelease, serverRelease] = await Promise.all([
      getClientRelease().catch(() => null),
      getServerRelease().catch(() => null),
    ]);
    const fallbackVersion = "latest";
    const clientVersion =
      (clientRelease ? getReleaseVersion(clientRelease) : undefined) ??
      fallbackVersion;
    const serverVersion =
      (serverRelease ? getReleaseVersion(serverRelease) : undefined) ??
      clientVersion ??
      fallbackVersion;

    return {
      clientVersion,
      releaseDate:
        clientRelease?.published_at ?? clientRelease?.created_at ?? null,
      releaseName:
        clientRelease?.name ??
        clientRelease?.tag_name ??
        `Version ${clientVersion}`,
      serverDownloads: createServerDownloads(serverVersion),
    };
  },
);

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: getPageMeta({
      title: "Download SoulFire - SoulFire",
      description: "Pick your OS and CPU to grab the right SoulFire build.",
      path: "/download",
      imageUrl: "/og/site/download/image.webp",
      imageAlt: "SoulFire download page preview",
    }),
    links: getCanonicalLinks("/download"),
  }),
  loader: async () => downloadPageLoader(),
  component: DownloadPage,
});

function DownloadPage() {
  const data = Route.useLoaderData();

  return (
    <SiteShell>
      <DownloadPageContent
        clientVersion={data.clientVersion}
        releaseDate={data.releaseDate}
        releaseName={data.releaseName}
        serverDownloads={data.serverDownloads}
      />
    </SiteShell>
  );
}
