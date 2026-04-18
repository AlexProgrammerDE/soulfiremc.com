import { Link } from "@tanstack/react-router";

export const accountFaqItems: {
  question: string;
  answerHtml: string;
  answerElement: React.ReactNode;
}[] = [
  {
    question: "What are MFA accounts?",
    answerHtml:
      'MFA (Multi-Factor Authentication) accounts are permanent Minecraft accounts with full access. In alt-shop terms, they are the closest match to full-access Minecraft alts because you can change the email, password, and username. They\'re more secure and stable, which makes them pricier. Learn more in the <a href="https://soulfiremc.com/docs/how-to/import-accounts">Account Guide</a>.',
    answerElement: (
      <>
        MFA (Multi-Factor Authentication) accounts are permanent Minecraft
        accounts with full access. In alt-shop terms, they are the closest match
        to full-access Minecraft alts because you can change the email,
        password, and username. They're more secure and stable, which makes them
        pricier. Learn more in the{" "}
        <Link
          to="/docs/$"
          params={{ _splat: "how-to/import-accounts" }}
          className="underline text-primary"
        >
          Account Guide
        </Link>
        .
      </>
    ),
  },
  {
    question: "What are NFA accounts?",
    answerHtml:
      'NFA (Non-Full Access) accounts are temporary Minecraft alts that may stop working over time. They\'re cheaper but come with a higher risk of losing access. See the <a href="https://soulfiremc.com/docs/how-to/import-accounts">Account Guide</a> for details on supported account types.',
    answerElement: (
      <>
        NFA (Non-Full Access) accounts are temporary Minecraft alts that may
        stop working over time. They're cheaper but come with a higher risk of
        losing access. See the{" "}
        <Link
          to="/docs/$"
          params={{ _splat: "how-to/import-accounts" }}
          className="underline text-primary"
        >
          Account Guide
        </Link>{" "}
        for details on supported account types.
      </>
    ),
  },
  {
    question: "Which account type works with SoulFire?",
    answerHtml:
      'MFA accounts are fully supported by SoulFire. For NFA accounts, SoulFire supports refresh token, cookie, and access token auth. Read the <a href="https://soulfiremc.com/docs/how-to/import-accounts">Account Guide</a> for setup instructions.',
    answerElement: (
      <>
        MFA accounts are fully supported by SoulFire. For NFA accounts, SoulFire
        supports refresh token, cookie, and access token auth. Read the{" "}
        <Link
          to="/docs/$"
          params={{ _splat: "how-to/import-accounts" }}
          className="underline text-primary"
        >
          Account Guide
        </Link>{" "}
        for setup instructions.
      </>
    ),
  },
  {
    question: "What are temporary Minecraft alts?",
    answerHtml:
      "When people search for temporary Minecraft alts, they usually mean NFA accounts or token and cookie-based accounts. These are cheaper than MFA or full-access accounts, but access can expire or stop working over time.",
    answerElement: (
      <>
        When people search for temporary Minecraft alts, they usually mean NFA
        accounts or token and cookie-based accounts. These are cheaper than MFA
        or full-access accounts, but access can expire or stop working over
        time.
      </>
    ),
  },
  {
    question: "What are token and cookie accounts?",
    answerHtml:
      "Token and cookie accounts are common delivery formats for lower-cost Minecraft alts. SoulFire supports refresh token, cookie, and access token auth for compatible NFA providers.",
    answerElement: (
      <>
        Token and cookie accounts are common delivery formats for lower-cost
        Minecraft alts. SoulFire supports refresh token, cookie, and access
        token auth for compatible NFA providers.
      </>
    ),
  },
  {
    question: "What does SFA mean?",
    answerHtml:
      "In community jargon, SFA usually means Semi Full Access. The term is inconsistent across alt shops and some marketplaces treat it as misleading, so SoulFire uses the clearer MFA/full-access and NFA/temporary labels instead.",
    answerElement: (
      <>
        In community jargon, SFA usually means Semi Full Access. The term is
        inconsistent across alt shops and some marketplaces treat it as
        misleading, so SoulFire uses the clearer MFA/full-access and
        NFA/temporary labels instead.
      </>
    ),
  },
  {
    question: "Are these providers affiliated with SoulFire?",
    answerHtml:
      "This is still a community-curated list and SoulFire does not own or operate these providers. Some listings may have official integrations or affiliate codes and links, and those are labeled clearly on the page.",
    answerElement: (
      <>
        This is still a community-curated list and SoulFire does not own or
        operate these providers. Some listings may have official integrations or
        affiliate codes and links, and those are labeled clearly on the page.
      </>
    ),
  },
  {
    question: 'What does the "Free" badge mean?',
    answerHtml:
      "Providers with the Free badge offer accounts at no cost. These are typically temporary tokens with daily limits.",
    answerElement: (
      <>
        Providers with the Free badge offer accounts at no cost. These are
        typically temporary tokens with daily limits.
      </>
    ),
  },
];
