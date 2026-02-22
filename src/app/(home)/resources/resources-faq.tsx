import Link from "next/link";

export const resourcesFaqItems: {
  question: string;
  answerHtml: string;
  answerElement: React.ReactNode;
}[] = [
  {
    question: "What are SoulFire plugins?",
    answerHtml:
      'SoulFire plugins are extensions that add new features to the bot engine. They use the Fabric mod infrastructure and can hook into events, add settings, and extend bot behavior. See the <a href="https://soulfiremc.com/docs/plugins">Plugin Documentation</a> for details.',
    answerElement: (
      <>
        SoulFire plugins are extensions that add new features to the bot engine.
        They use the Fabric mod infrastructure and can hook into events, add
        settings, and extend bot behavior. See the{" "}
        <Link href="/docs/plugins" className="underline text-primary">
          Plugin Documentation
        </Link>{" "}
        for details.
      </>
    ),
  },
  {
    question: "How do I install a SoulFire plugin?",
    answerHtml:
      'Download the plugin JAR file and place it in the SoulFire plugins directory. Restart SoulFire and the plugin will be loaded automatically. Check the <a href="https://soulfiremc.com/docs/plugins">Plugin Documentation</a> for more information.',
    answerElement: (
      <>
        Download the plugin JAR file and place it in the SoulFire plugins
        directory. Restart SoulFire and the plugin will be loaded automatically.
        Check the{" "}
        <Link href="/docs/plugins" className="underline text-primary">
          Plugin Documentation
        </Link>{" "}
        for more information.
      </>
    ),
  },
  {
    question: "What are SoulFire scripts?",
    answerHtml:
      "SoulFire scripts automate bot behavior using the scripting API. They can control movement, interact with the world, chat, and more. Scripts are written in JavaScript and loaded at runtime.",
    answerElement: (
      <>
        SoulFire scripts automate bot behavior using the scripting API. They can
        control movement, interact with the world, chat, and more. Scripts are
        written in JavaScript and loaded at runtime.
      </>
    ),
  },
  {
    question: "How can I share my plugin or script?",
    answerHtml:
      'Submit a pull request on <a href="https://github.com/AlexProgrammerDE/soulfiremc.com">GitHub</a> to add your resource to this page, or share it in the SoulFire Discord server.',
    answerElement: (
      <>
        Submit a pull request on{" "}
        <a
          href="https://github.com/AlexProgrammerDE/soulfiremc.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-primary"
        >
          GitHub
        </a>{" "}
        to add your resource to this page, or share it in the SoulFire Discord
        server.
      </>
    ),
  },
  {
    question: "Are community resources safe to use?",
    answerHtml:
      "Always review the source code of any third-party plugin or script before using it. Prefer open-source resources where you can inspect the code. Only download from trusted sources and authors.",
    answerElement: (
      <>
        Always review the source code of any third-party plugin or script before
        using it. Prefer open-source resources where you can inspect the code.
        Only download from trusted sources and authors.
      </>
    ),
  },
];
