import type { paths } from "@octokit/openapi-types";
import {
  AppWindow,
  ArrowDownToLine,
  Box,
  ChevronRight,
  CloudDownload,
  Rocket,
  Server,
  Terminal,
  Zap,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CustomTimeAgo } from "@/components/time-ago";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getRequiredEnv } from "@/lib/env";
import { cn } from "@/lib/utils";

type LatestReleaseResponse =
  paths["/repos/{owner}/{repo}/releases/latest"]["get"]["responses"]["200"]["content"]["application/json"];

export const revalidate = 120; // 2 minutes

export const metadata: Metadata = {
  openGraph: {
    images: "https://soulfiremc.com/og?title=SoulFire",
  },
};

async function getRepoInfo(repo: string): Promise<LatestReleaseResponse> {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/releases/latest`,
  );
  return await response.json();
}

async function getReleaseData(): Promise<{
  clientData: LatestReleaseResponse;
  serverData: LatestReleaseResponse;
}> {
  const [clientData, serverData] = await Promise.all([
    getRepoInfo("AlexProgrammerDE/SoulFireClient"),
    getRepoInfo("AlexProgrammerDE/SoulFire"),
  ]);

  return {
    clientData,
    serverData,
  };
}

function ReleaseCard(props: {
  data: LatestReleaseResponse;
  type: string;
  hint: string;
  extraIcons: ReactNode;
}) {
  const releaseDate = props.data.published_at ?? props.data.created_at;

  return (
    <Card className="flex flex-col md:flex-row gap-6 p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <a
            href={props.data.html_url}
            className="text-2xl font-bold hover:underline"
          >
            {props.data.name}
          </a>
          <div className="flex flex-row items-center gap-2">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
              Latest Release
            </span>
            <div className="flex flex-row items-center gap-1">
              {props.extraIcons}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Released by</span>
          <Image
            className="rounded-full w-6 h-6"
            src={props.data.author.avatar_url}
            width={24}
            height={24}
            alt={props.data.author.login}
          />
          <span className="font-medium">{props.data.author.login}</span>
          <span>•</span>
          <span>
            {releaseDate ? (
              <CustomTimeAgo date={releaseDate} />
            ) : (
              "Unknown release date"
            )}
          </span>
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <a
          href={props.data.html_url}
          className={cn(
            buttonVariants({ size: "lg" }),
            "gap-2 whitespace-nowrap",
          )}
        >
          <ArrowDownToLine className="w-5 h-5" />
          Download {props.hint}
        </a>
      </div>
    </Card>
  );
}

async function LatestRelease() {
  const { clientData, serverData } = await getReleaseData();

  return (
    <div className="space-y-6">
      <ReleaseCard
        data={clientData}
        type="Client"
        hint="Client (Recommended)"
        extraIcons={
          <div className="flex flex-row gap-1">
            <Image
              src="/platform/windows.png"
              alt="Windows"
              width={20}
              height={20}
              title="Windows"
            />
            <Image
              src="/platform/macos.png"
              alt="macOS"
              width={20}
              height={20}
              title="macOS"
            />
            <Image
              src="/platform/linux.png"
              alt="Linux"
              width={20}
              height={20}
              title="Linux"
            />
          </div>
        }
      />
      <ReleaseCard
        data={serverData}
        type="Server"
        hint="Server (Advanced)"
        extraIcons={
          <div className="flex flex-row gap-1">
            <Server className="w-5 h-5" />
            <Terminal className="w-5 h-5" />
          </div>
        }
      />
    </div>
  );
}

function FeatureCard(props: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Card className="flex flex-col items-center text-center p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="bg-primary/10 p-3 rounded-full mb-4">{props.icon}</div>
      <CardTitle className="text-xl mb-2">{props.title}</CardTitle>
      <CardDescription className="text-base">
        {props.description}
      </CardDescription>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4">
                <div className="relative mx-auto w-32 h-32 md:w-40 md:h-40">
                  <Image
                    src="/logo.png"
                    alt="SoulFire Logo"
                    fill
                    className="rounded-2xl"
                    priority
                  />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  SoulFire
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Advanced Minecraft Server-Stresser Tool.
                  <br />
                  Launch bot attacks on your servers to measure performance.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/docs/installation">
                  <Button size="lg" className="gap-2">
                    <span>Get Started</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <a
                  href={getRequiredEnv("NEXT_PUBLIC_GITHUB_LINK")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    View on GitHub
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Releases */}
        {/** biome-ignore lint/correctness/useUniqueElementIds: Need this for static links */}
        <section className="py-16 bg-muted/50" id="downloads">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Latest Releases
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Download the latest version of SoulFire for your platform
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <LatestRelease />
            </div>
          </div>
        </section>

        {/* Features */}
        {/** biome-ignore lint/correctness/useUniqueElementIds: Need this for static links */}
        <section className="py-16" id="features">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Powerful Features
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Everything you need to stress-test your Minecraft servers
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/docs/installation">
                <FeatureCard
                  title="Easy to use"
                  description="SoulFire is easy to use, just install it and you're ready to go!"
                  icon={<Rocket className="w-8 h-8 text-primary" />}
                />
              </Link>
              <FeatureCard
                title="High performance"
                description="With SoulFire you can have hundreds of bots with low CPU and RAM."
                icon={<Zap className="w-8 h-8 text-primary" />}
              />
              <FeatureCard
                title="Bring your own accounts"
                description="Add your own Offline, Microsoft Java, and Microsoft Bedrock accounts"
                icon={<CloudDownload className="w-8 h-8 text-primary" />}
              />
              <a
                href={getRequiredEnv("NEXT_PUBLIC_GITHUB_LINK")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FeatureCard
                  title="Open Source"
                  description="SoulFire is open source, you can contribute to it on GitHub!"
                  icon={
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="32"
                      width="32"
                      viewBox="0 0 98 96"
                      className="w-8 h-8 text-primary"
                    >
                      <title>GitHub</title>
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  }
                />
              </a>
              <FeatureCard
                title="Version support"
                description="You can use any Release, Beta, Alpha, April Fools version and even Bedrock!"
                icon={<Box className="w-8 h-8 text-primary" />}
              />
              <FeatureCard
                title="Use plugins"
                description="SoulFire has useful plugins built-in and you can also add your own!"
                icon={<AppWindow className="w-8 h-8 text-primary" />}
              />
            </div>
          </div>
        </section>

        {/* Video Showcase */}
        {/** biome-ignore lint/correctness/useUniqueElementIds: Need this for static links */}
        <section className="py-16 bg-muted/50" id="video-showcase">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                GUI Showcase
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                See SoulFire in action with our interactive demo
              </p>
              <p className="text-muted-foreground">
                Do you want to check out a live demo of SoulFire in your
                browser? Try out the{" "}
                <a
                  className="text-primary hover:underline font-medium"
                  href="https://demo.soulfiremc.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  demo page
                </a>
                .
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/BD-xE8vbHtQ?si=h16uIIHV8A3Q2Zgb"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        {/** biome-ignore lint/correctness/useUniqueElementIds: Need this for static links */}
        <section className="py-16" id="final-cta">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Get Started?
              </h2>
              <p className="max-w-[700px] text-muted-foreground md:text-lg">
                Join thousands of users who are already stress-testing their
                Minecraft servers with SoulFire
              </p>
              <div className="mt-6">
                <Link href="/docs/installation">
                  <Button size="lg" className="gap-2">
                    <span>Install SoulFire</span>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
