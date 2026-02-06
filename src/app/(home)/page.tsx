import { SiGithub } from "@icons-pack/react-simple-icons";
import {
  AppWindow,
  ArrowRight,
  Box,
  CloudDownload,
  Download,
  Rocket,
  Zap,
} from "lucide-react";
import Link from "next/link";
import type {
  BreadcrumbList,
  FAQPage,
  SoftwareApplication,
  VideoObject,
  WithContext,
} from "schema-dts";
import { JsonLd } from "@/components/json-ld";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BorderBeam } from "@/components/ui/border-beam";
import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/ui/dot-pattern";
import { Marquee } from "@/components/ui/marquee";
import { Meteors } from "@/components/ui/meteors";
import { RetroGrid } from "@/components/ui/retro-grid";
import { Ripple } from "@/components/ui/ripple";
import { getRequiredEnv } from "@/lib/env";
import { HeroBackground, HomeFaq, TerminalAnimation } from "./page.client";

const plugins = [
  "Kill Aura",
  "Auto Eat",
  "Auto Armor",
  "Auto Totem",
  "Anti AFK",
  "Auto Reconnect",
  "AI Chat Bot",
  "Auto Register",
];

const versions = [
  "Release (1.0.0 - latest)",
  "Beta (b1.0 - b1.8.1)",
  "Alpha (a1.0.15 - a1.2.6)",
  "Classic (c0.0.15 - c0.30 including CPE)",
  "April Fools (3D Shareware, 20w14infinite, 25w14craftmine)",
  "Combat Snapshots (Combat Test 8c)",
  "Bedrock Edition 1.21.130 (Some features are missing)",
];

const features = [
  {
    Icon: Rocket,
    name: "Easy to use",
    description:
      "Native installers for Windows, macOS, and Linux. No Java installation required—just download, install, and start botting.",
    href: "/docs/installation",
    cta: "Install now",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Ripple
        className="absolute -top-20 -right-20"
        mainCircleSize={180}
        mainCircleOpacity={0.1}
        numCircles={5}
      />
    ),
  },
  {
    Icon: Zap,
    name: "High performance",
    description:
      "Built on Fabric with official Minecraft client code. Bots use real physics, real networking, and are virtually indistinguishable from real players.",
    href: "/docs",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: (
      <AnimatedGridPattern
        numSquares={20}
        maxOpacity={0.08}
        duration={4}
        className="[mask-image:radial-gradient(600px_circle_at_100%_0%,white,transparent)]"
      />
    ),
  },
  {
    Icon: CloudDownload,
    name: "Bring your own accounts",
    description:
      "Import Microsoft Java, Microsoft Bedrock, or Offline accounts. Supports device code auth, credentials, and auto-generated offline names.",
    href: "/docs/usage/accounts",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: <Meteors number={80} />,
  },
  {
    Icon: SiGithub,
    name: "Open Source",
    description:
      "Fully open source under AGPL-3.0. Contribute features, report bugs, or fork it for your own projects. Community-driven development.",
    href: getRequiredEnv("NEXT_PUBLIC_GITHUB_LINK"),
    cta: "View on GitHub",
    className: "col-span-3 lg:col-span-1",
    background: (
      <DotPattern
        width={24}
        height={24}
        cr={1.5}
        className="[mask-image:radial-gradient(500px_circle_at_0%_0%,white,transparent)]"
      />
    ),
  },
  {
    Icon: Box,
    name: "Every version supported",
    description:
      "Connect to any Minecraft version ever released—Classic, Alpha, Beta und up to latest release, including Bedrock Edition and April Fools snapshots.",
    href: "/docs/usage/versions",
    cta: "See all versions",
    className: "col-span-3 lg:col-span-1",
    background: (
      <Marquee pauseOnHover duration={20} gap={12} className="absolute top-8">
        {versions.map((version) => (
          <div
            key={version}
            className="rounded-lg border bg-muted/50 px-3 py-2 text-xs font-medium"
          >
            {version}
          </div>
        ))}
      </Marquee>
    ),
  },
  {
    Icon: AppWindow,
    name: "Powerful plugin system",
    description:
      "15+ built-in plugins including Kill Aura, Auto Eat, Auto Armor, AI Chat Bot, and more. Create custom plugins as Fabric mods with full Minecraft API access.",
    href: "/docs/usage/plugins",
    cta: "Browse plugins",
    className: "col-span-3 lg:col-span-2",
    background: (
      <Marquee pauseOnHover duration={20} gap={12} className="absolute top-8">
        {plugins.map((plugin) => (
          <div
            key={plugin}
            className="rounded-lg border bg-muted/50 px-3 py-2 text-xs font-medium"
          >
            {plugin}
          </div>
        ))}
      </Marquee>
    ),
  },
];

const githubLink = getRequiredEnv("NEXT_PUBLIC_GITHUB_LINK");

const faqItems: {
  question: string;
  answerHtml: string;
  answerElement: React.ReactNode;
}[] = [
  {
    question: "What is SoulFire?",
    answerHtml:
      'SoulFire is a Minecraft bot framework built on Fabric that runs real client code. Bots use actual Minecraft physics, networking, and protocol handling — they\'re virtually indistinguishable from real players. It\'s designed for stress testing servers, automating tasks, and development. <a href="https://soulfiremc.com/docs">Read the docs</a> to learn more.',
    answerElement: (
      <>
        SoulFire is a Minecraft bot framework built on Fabric that runs real
        client code. Bots use actual Minecraft physics, networking, and protocol
        handling — they're virtually indistinguishable from real players. It's
        designed for stress testing servers, automating tasks, and development.{" "}
        <Link href="/docs" className="underline text-primary">
          Read the docs
        </Link>{" "}
        to learn more.
      </>
    ),
  },
  {
    question: "Is SoulFire free?",
    answerHtml: `Yes. SoulFire is fully open source under the AGPL-3.0 license. You can <a href="https://soulfiremc.com/download">download it</a>, use it, modify it, and contribute back to the project at no cost. Check out the <a href="${githubLink}">GitHub repository</a>.`,
    answerElement: (
      <>
        Yes. SoulFire is fully open source under the AGPL-3.0 license. You can{" "}
        <Link href="/download" className="underline text-primary">
          download it
        </Link>
        , use it, modify it, and contribute back to the project at no cost.
        Check out the{" "}
        <a
          href={githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-primary"
        >
          GitHub repository
        </a>
        .
      </>
    ),
  },
  {
    question: "What Minecraft versions does SoulFire support?",
    answerHtml:
      'Every version ever released — from Classic and Alpha through the latest release, including Beta, Combat Snapshots, April Fools editions, and Bedrock Edition. Version translation is handled automatically via built-in protocol support. See the <a href="https://soulfiremc.com/docs/usage/versions">full version list</a>.',
    answerElement: (
      <>
        Every version ever released — from Classic and Alpha through the latest
        release, including Beta, Combat Snapshots, April Fools editions, and
        Bedrock Edition. Version translation is handled automatically via
        built-in protocol support. See the{" "}
        <Link href="/docs/usage/versions" className="underline text-primary">
          full version list
        </Link>
        .
      </>
    ),
  },
  {
    question: "Can servers detect SoulFire bots?",
    answerHtml:
      "SoulFire bots run real Fabric client code, so they behave identically to real players at the protocol level. Standard anti-cheat and anti-bot plugins can't distinguish them by packet analysis alone. This makes SoulFire ideal for testing whether your server's defenses actually work.",
    answerElement: (
      <>
        SoulFire bots run real Fabric client code, so they behave identically to
        real players at the protocol level. Standard anti-cheat and anti-bot
        plugins can't distinguish them by packet analysis alone. This makes
        SoulFire ideal for testing whether your server's defenses actually work.
      </>
    ),
  },
  {
    question: "How do I install SoulFire?",
    answerHtml:
      '<a href="https://soulfiremc.com/download">Download</a> the native installer for your platform (Windows, macOS, or Linux). No Java installation required — everything is bundled. Just install and run. See the <a href="https://soulfiremc.com/docs/installation">installation guide</a> for a full walkthrough.',
    answerElement: (
      <>
        <Link href="/download" className="underline text-primary">
          Download
        </Link>{" "}
        the native installer for your platform (Windows, macOS, or Linux). No
        Java installation required — everything is bundled. Just install and run.
        See the{" "}
        <Link href="/docs/installation" className="underline text-primary">
          installation guide
        </Link>{" "}
        for a full walkthrough.
      </>
    ),
  },
  {
    question: "Does SoulFire support Bedrock Edition?",
    answerHtml:
      'Yes. SoulFire can connect to Bedrock Edition servers via built-in protocol translation. Some features are still being added, but core functionality like joining, moving, and interacting works. See <a href="https://soulfiremc.com/docs/usage/versions">supported versions</a> for details.',
    answerElement: (
      <>
        Yes. SoulFire can connect to Bedrock Edition servers via built-in
        protocol translation. Some features are still being added, but core
        functionality like joining, moving, and interacting works. See{" "}
        <Link href="/docs/usage/versions" className="underline text-primary">
          supported versions
        </Link>{" "}
        for details.
      </>
    ),
  },
  {
    question: "Can I write custom plugins?",
    answerHtml:
      'Yes. SoulFire plugins are Fabric mods with full access to the Minecraft API. You can create custom bot behaviors, automate complex tasks, or build testing scenarios tailored to your server. Learn how in the <a href="https://soulfiremc.com/docs/usage/plugins">plugin docs</a>.',
    answerElement: (
      <>
        Yes. SoulFire plugins are Fabric mods with full access to the Minecraft
        API. You can create custom bot behaviors, automate complex tasks, or
        build testing scenarios tailored to your server. Learn how in the{" "}
        <Link href="/docs/usage/plugins" className="underline text-primary">
          plugin docs
        </Link>
        .
      </>
    ),
  },
];

export default function Page() {
  const softwareJsonLd: WithContext<SoftwareApplication> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SoulFire",
    description:
      "Advanced Minecraft bot tool for testing, automation, and development. Run bot sessions on your servers.",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows, macOS, Linux",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    downloadUrl: "https://soulfiremc.com/download",
    softwareVersion: "2.0",
    author: {
      "@type": "Organization",
      name: "SoulFire",
      url: "https://soulfiremc.com",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1000",
    },
    featureList: [
      "High performance bot framework",
      "Multi-version support (Classic to latest)",
      "Powerful plugin system",
      "Open source",
      "Cross-platform support",
      "CLI and GUI modes",
      "Bedrock Edition support",
    ],
    screenshot: "https://soulfiremc.com/logo.png",
    url: "https://soulfiremc.com",
  };

  const faqJsonLd: WithContext<FAQPage> = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.answerHtml,
      },
    })),
  };

  const videoJsonLd: WithContext<VideoObject> = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "SoulFire Demo Video",
    description:
      "Demonstration of SoulFire Minecraft bot tool features and capabilities",
    thumbnailUrl: "https://soulfiremc.com/logo.png",
    uploadDate: "2024-01-01T00:00:00Z",
    contentUrl: "https://www.youtube.com/watch?v=BD-xE8vbHtQ",
    embedUrl: "https://www.youtube.com/embed/BD-xE8vbHtQ",
    duration: "PT5M",
  };

  const breadcrumbJsonLd: WithContext<BreadcrumbList> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://soulfiremc.com",
      },
    ],
  };

  return (
    <main className="px-4 py-12 w-full max-w-[1400px] mx-auto flex-1">
      <JsonLd data={softwareJsonLd} />
      <JsonLd data={videoJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
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
        <div className="flex flex-col space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Powerful Features
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-lg">
            Everything you need to test and automate your Minecraft servers
          </p>
        </div>
        <BentoGrid className="auto-rows-[18rem] grid-cols-3 lg:grid-cols-3">
          {features.map((feature) => (
            <BentoCard key={feature.name} {...feature} />
          ))}
        </BentoGrid>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="w-full max-w-3xl mx-auto">
          <div className="flex flex-col space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Common questions about SoulFire
            </p>
          </div>
          <HomeFaq
            items={faqItems.map((item) => ({
              question: item.question,
              answer: item.answerElement,
            }))}
          />
        </div>
      </section>

      {/* Terminal Demo Section */}
      <section className="py-16">
        <div className="w-full max-w-4xl mx-auto">
          <div className="flex flex-col space-y-4 mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              CLI Mode for Power Users
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-lg">
              Automate bot sessions and control everything from the terminal.
              Perfect for scripting, headless servers, and keyboard-first
              workflows.
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
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border bg-background px-8 py-16 md:py-24">
          <RetroGrid lineWidth={2} fade={false} className="opacity-30" />
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Ready to Get Started?
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-lg">
              Join thousands of users who are already testing and automating
              their Minecraft servers with SoulFire
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Link href="/download">
                <Button size="lg" className="gap-2 h-12 px-8">
                  <Download className="w-5 h-5" />
                  <span>Get SoulFire</span>
                </Button>
              </Link>
              <a
                href={getRequiredEnv("NEXT_PUBLIC_GITHUB_LINK")}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="gap-2 h-12 px-8">
                  <SiGithub className="w-5 h-5" />
                  <span>View on GitHub</span>
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
