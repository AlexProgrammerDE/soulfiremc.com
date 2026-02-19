import Link from "next/link";

export const proxiesFaqItems: {
  question: string;
  answerHtml: string;
  answerElement: React.ReactNode;
}[] = [
  {
    question: "Why do I need proxies for SoulFire?",
    answerHtml:
      'When running multiple bots, servers may block your IP. Proxies give each bot a different IP address, avoiding rate limits and IP bans. Learn more in the <a href="https://soulfiremc.com/docs/usage/proxies">Proxy Guide</a>.',
    answerElement: (
      <>
        When running multiple bots, servers may block your IP. Proxies give each
        bot a different IP address, avoiding rate limits and IP bans. Learn more
        in the{" "}
        <Link href="/docs/usage/proxies" className="underline text-primary">
          Proxy Guide
        </Link>
        .
      </>
    ),
  },
  {
    question: "What type of proxy should I use?",
    answerHtml:
      'Residential proxies are the hardest to detect but cost more. Datacenter proxies are faster and cheaper but easier to block. ISP proxies offer a middle ground. See the <a href="https://soulfiremc.com/docs/usage/proxies">Proxy Guide</a> for recommendations.',
    answerElement: (
      <>
        Residential proxies are the hardest to detect but cost more. Datacenter
        proxies are faster and cheaper but easier to block. ISP proxies offer a
        middle ground. See the{" "}
        <Link href="/docs/usage/proxies" className="underline text-primary">
          Proxy Guide
        </Link>{" "}
        for recommendations.
      </>
    ),
  },
  {
    question: 'What does "unlimited bandwidth" mean?',
    answerHtml:
      "Some providers don't charge per GB of data transferred. This is useful for long-running bot sessions that generate lots of traffic.",
    answerElement: (
      <>
        Some providers don't charge per GB of data transferred. This is useful
        for long-running bot sessions that generate lots of traffic.
      </>
    ),
  },
  {
    question: "Are these affiliate links?",
    answerHtml:
      "Yes, some links are affiliate links. Purchases through them help fund SoulFire development at no extra cost to you.",
    answerElement: (
      <>
        Yes, some links are affiliate links. Purchases through them help fund
        SoulFire development at no extra cost to you.
      </>
    ),
  },
  {
    question: "Can I use free proxies with SoulFire?",
    answerHtml:
      "Some providers like Webshare offer a free tier. Free public proxy lists are not recommended since they're slow, unreliable, and often already blocked.",
    answerElement: (
      <>
        Some providers like Webshare offer a free tier. Free public proxy lists
        are not recommended since they're slow, unreliable, and often already
        blocked.
      </>
    ),
  },
];
