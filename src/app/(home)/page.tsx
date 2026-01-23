import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  AppWindow,
  ArrowDownToLine,
  ArrowRight,
  Box,
  CloudDownload,
  Download,
  Rocket,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { MagicCard } from "@/components/ui/magic-card";
import { getRequiredEnv } from "@/lib/env";
import { HeroBackground, TerminalAnimation } from "./page.client";

function FeatureCard(props: {
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <MagicCard
      className="h-full rounded-xl"
      gradientColor="#0c4a6e"
      gradientFrom="#0ea5e9"
      gradientTo="#3b82f6"
      gradientOpacity={0.15}
    >
      <div className="flex flex-col items-center text-center p-6 h-full">
        <div className="bg-primary/10 p-3 rounded-full mb-4">{props.icon}</div>
        <CardTitle className="text-xl mb-2">{props.title}</CardTitle>
        <CardDescription className="text-base">
          {props.description}
        </CardDescription>
      </div>
    </MagicCard>
  );
}

export default function Page() {
  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto flex-1">
      {/* Hero Section */}
      <section className="py-4 md:py-8">
        <div className="relative flex min-h-[600px] border rounded-2xl overflow-hidden bg-background">
          <HeroBackground />
          <div className="relative z-10 container px-4 md:px-6 py-12 md:py-16">
            <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 border border-primary/30 backdrop-blur-sm shadow-sm">
                  <Zap className="h-4 w-4 text-primary" />
                  <AnimatedShinyText className="text-sm font-semibold">
                    the last bot tool you'll ever need.
                  </AnimatedShinyText>
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  The most powerful bot tool, undetectable and fast.
                </h1>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/download">
                    <Button
                      size="lg"
                      className="gap-2 h-14 px-8 text-lg font-semibold"
                    >
                      <Download className="h-6 w-6" />
                      Get SoulFire
                    </Button>
                  </Link>
                  <a
                    href={getRequiredEnv("NEXT_PUBLIC_GITHUB_LINK")}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="gap-2 h-14 px-8 text-lg font-semibold bg-background/80 backdrop-blur-sm border-2"
                    >
                      <SiGithub className="h-6 w-6" />
                      GitHub
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative rounded-2xl border bg-background/80 backdrop-blur p-2 shadow-xl overflow-hidden">
                <BorderBeam
                  size={200}
                  duration={8}
                  colorFrom="#0ea5e9"
                  colorTo="#3b82f6"
                  borderWidth={2}
                />
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
        </div>
        <p className="text-2xl md:text-3xl text-muted-foreground mt-8">
          <span className="text-primary font-semibold">High performance</span>,{" "}
          <span className="text-primary font-semibold">multi-version</span>{" "}
          support,{" "}
          <span className="text-primary font-semibold">plugin system</span>, and{" "}
          <span className="text-primary font-semibold">open source</span>.
          SoulFire is the most advanced Minecraft bot framework, built for speed
          and scale.
        </p>
      </section>

      {/* Features */}
      {/** biome-ignore lint/correctness/useUniqueElementIds: Need this for static links */}
      <section className="py-16" id="features">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Powerful Features
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Everything you need to test and automate your Minecraft servers
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/docs/installation" className="h-full">
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
              className="h-full"
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

      {/* Terminal Demo Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              See it in Action
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Watch how easy it is to control hundreds of bots with simple
              commands
            </p>
          </div>
          <TerminalAnimation />
          <div className="flex mt-8">
            <Link href="/docs/usage/commands">
              <Button variant="outline" className="gap-2">
                View all commands
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {/** biome-ignore lint/correctness/useUniqueElementIds: Need this for static links */}
      <section className="py-16" id="final-cta">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Join thousands of users who are already testing and automating
              their Minecraft servers with SoulFire
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
  );
}
