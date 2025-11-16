import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  AppWindow,
  ArrowDownToLine,
  Box,
  CloudDownload,
  Download,
  Rocket,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getRequiredEnv } from "@/lib/env";

export const revalidate = 120; // 2 minutes

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
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6 text-left">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  SoulFire
                </p>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  The most powerful bot tool, undetectable and fast.
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Spin up realistic Minecraft traffic in seconds, audit your
                  infrastructure, and learn how SoulFire works by watching the
                  live demo right away.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/download">
                    <Button size="lg" className="gap-2">
                      <Download className="h-5 w-5" />
                      Get SoulFire
                    </Button>
                  </Link>
                  <a
                    href={getRequiredEnv("NEXT_PUBLIC_GITHUB_LINK")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="lg" className="gap-2">
                      <SiGithub className="h-5 w-5" />
                      GitHub
                    </Button>
                  </a>
                </div>
              </div>
              <div className="rounded-2xl border bg-background p-2 shadow-xl">
                <div className="aspect-video overflow-hidden rounded-xl">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/BD-xE8vbHtQ?si=h16uIIHV8A3Q2Zgb"
                    title="SoulFire demo video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="h-full w-full"
                  ></iframe>
                </div>
              </div>
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
                <Link href="/download">
                  <Button size="lg" className="gap-2">
                    <span>Get SoulFire</span>
                    <ArrowDownToLine className="w-5 h-5" />
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
