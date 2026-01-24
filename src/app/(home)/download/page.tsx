import { BookOpen, PlayCircle, Server, Terminal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { CustomTimeAgo } from "@/components/time-ago";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getClientRelease,
  getReleaseVersion,
  getServerRelease,
} from "@/lib/releases";
import {
  DownloadSelectionComponent,
  DownloadSelectionSkeleton,
} from "./download-configurator";
import { createServerDownloads } from "./download-data";

const SERVER_ICONS = {
  "SoulFire CLI": <Terminal className="h-5 w-5" />,
  "SoulFire Dedicated": <Server className="h-5 w-5" />,
} as const;

export const metadata: Metadata = {
  title: "Download SoulFire",
  description: "Pick your OS and CPU to grab the right SoulFire build.",
};

export default async function DownloadPage() {
  const [clientRelease, serverRelease] = await Promise.all([
    getClientRelease(),
    getServerRelease(),
  ]);
  const fallbackVersion = "latest";
  const clientVersion = getReleaseVersion(clientRelease) ?? fallbackVersion;
  const serverVersion =
    getReleaseVersion(serverRelease) ?? clientVersion ?? fallbackVersion;
  const serverDownloads = createServerDownloads(serverVersion);
  const releaseName =
    clientRelease?.name ??
    clientRelease?.tag_name ??
    `Version ${clientVersion}`;
  const releaseDate = clientRelease?.published_at ?? clientRelease?.created_at;

  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto space-y-10">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Download SoulFire
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Pick your operating system and CPU architecture. We&apos;ll give
              you the right download plus links to help you learn how everything
              works.
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            Latest release:{" "}
            <span className="font-medium text-foreground">{releaseName}</span>
            {releaseDate ? (
              <>
                {" "}
                · Updated{" "}
                <Suspense
                  fallback={
                    <Skeleton className="inline-block h-4 w-20 align-middle" />
                  }
                >
                  <CustomTimeAgo date={releaseDate} />
                </Suspense>
              </>
            ) : null}
          </p>
        </div>
      </div>
      <Suspense fallback={<DownloadSelectionSkeleton />}>
        <DownloadSelectionComponent clientVersion={clientVersion} />
      </Suspense>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="h-5 w-5 text-primary" />
              Learn the workflow
            </CardTitle>
            <CardDescription>
              Understand how SoulFire operates before launching your first test.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Follow the installation docs for a full walkthrough, including
              account setup, plugins, and tuning tips for realistic bot testing.
            </p>
            <Button asChild variant="outline">
              <Link href="/docs/installation">Open the docs</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <PlayCircle className="h-5 w-5 text-primary" />
              Watch it in action
            </CardTitle>
            <CardDescription>
              Prefer to learn visually? Use the live GUI demo in your browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Explore every screen, test presets, and share the experience with
              your team by opening the fully interactive SoulFire demo.
            </p>
            <Button asChild>
              <a
                href="https://demo.soulfiremc.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit the demo
              </a>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Server & CLI builds</CardTitle>
            <CardDescription>
              Download the dedicated controller or command line client for
              advanced automations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {serverDownloads.map((item) => (
              <div
                key={item.name}
                className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    {SERVER_ICONS[item.name as keyof typeof SERVER_ICONS] ?? (
                      <Server className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="mt-2 w-full sm:mt-0 sm:w-auto"
                >
                  <a href={item.url} download>
                    Download
                  </a>
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
