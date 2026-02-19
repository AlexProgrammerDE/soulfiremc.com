import Link from 'next/link';

export const accountFaqItems: {
  question: string;
  answerHtml: string;
  answerElement: React.ReactNode;
}[] = [
  {
    question: "What are MFA accounts?",
    answerHtml:
      'MFA (Multi-Factor Authentication) accounts are permanent Minecraft accounts with full access. You can change the email, password, and username. They\'re more secure and stable, which makes them pricier. Learn more in the <a href="https://soulfiremc.com/docs/usage/accounts">Account Guide</a>.',
    answerElement: (
      <>
        MFA (Multi-Factor Authentication) accounts are permanent Minecraft
        accounts with full access. You can change the email, password, and
        username. They're more secure and stable, which makes them pricier.
        Learn more in the{" "}
        <Link href="/docs/usage/accounts" className="underline text-primary">
          Account Guide
        </Link>
        .
      </>
    ),
  },
  {
    question: "What are NFA accounts?",
    answerHtml:
      'NFA (Non-Full Access) accounts are temporary accounts that may stop working over time. They\'re cheaper but come with a higher risk of losing access. See the <a href="https://soulfiremc.com/docs/usage/accounts">Account Guide</a> for details on supported account types.',
    answerElement: (
      <>
        NFA (Non-Full Access) accounts are temporary accounts that may stop
        working over time. They're cheaper but come with a higher risk of losing
        access. See the{" "}
        <Link href="/docs/usage/accounts" className="underline text-primary">
          Account Guide
        </Link>{" "}
        for details on supported account types.
      </>
    ),
  },
  {
    question: "Which account type works with SoulFire?",
    answerHtml:
      'MFA accounts are fully supported by SoulFire. For NFA accounts, SoulFire supports refresh token auth but does not support cookie/access token auth. Read the <a href="https://soulfiremc.com/docs/usage/accounts">Account Guide</a> for setup instructions.',
    answerElement: (
      <>
        MFA accounts are fully supported by SoulFire. For NFA accounts, SoulFire
        supports refresh token auth but does not support cookie/access token
        auth. Read the{" "}
        <Link href="/docs/usage/accounts" className="underline text-primary">
          Account Guide
        </Link>{" "}
        for setup instructions.
      </>
    ),
  },
  {
    question: "Are these providers affiliated with SoulFire?",
    answerHtml:
      "No. This is a community-curated list. We recommend doing your own research before purchasing. Some providers offer coupon codes for SoulFire users.",
    answerElement: (
      <>
        No. This is a community-curated list. We recommend doing your own
        research before purchasing. Some providers offer coupon codes for
        SoulFire users.
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
