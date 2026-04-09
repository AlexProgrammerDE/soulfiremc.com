import Link from "next/link";

export const resourcesFaqItems: {
  question: string;
  answerHtml: string;
  answerElement: React.ReactNode;
}[] = [
  {
    question: "What are SoulFire plugins?",
    answerHtml:
      'SoulFire plugins are Fabric mods that extend the bot engine with low-level hooks, settings pages, Mixins, and direct Minecraft access. See the <a href="https://soulfiremc.com/docs/development">Development docs</a> for the full plugin authoring workflow.',
    answerElement: (
      <>
        SoulFire plugins are Fabric mods that extend the bot engine with
        low-level hooks, settings pages, Mixins, and direct Minecraft access.
        See the{" "}
        <Link href="/docs/development" className="underline text-primary">
          Development docs
        </Link>{" "}
        for the full plugin authoring workflow.
      </>
    ),
  },
  {
    question: "How do I install a SoulFire plugin?",
    answerHtml:
      'Download the plugin JAR file, place it in SoulFire&apos;s <code>minecraft/mods</code> directory, and restart SoulFire. Use the <a href="https://soulfiremc.com/docs/how-to/install-plugins">install guide</a> for loading plugins and the <a href="https://soulfiremc.com/docs/development">Development docs</a> if you are building your own.',
    answerElement: (
      <>
        Download the plugin JAR file, place it in SoulFire&apos;s{" "}
        <code>minecraft/mods</code> directory, and restart SoulFire. Use the{" "}
        <Link
          href="/docs/how-to/install-plugins"
          className="underline text-primary"
        >
          install guide
        </Link>{" "}
        for loading plugins and the{" "}
        <Link href="/docs/development" className="underline text-primary">
          Development docs
        </Link>{" "}
        if you are building your own.
      </>
    ),
  },
  {
    question: "What are SoulFire scripts?",
    answerHtml:
      "SoulFire scripts automate bot behavior with SoulFire&apos;s visual scripting system. You build flows from triggers, actions, logic, and data nodes in the editor, then run them directly inside SoulFire without writing a full plugin.",
    answerElement: (
      <>
        SoulFire scripts automate bot behavior with SoulFire&apos;s visual
        scripting system. You build flows from triggers, actions, logic, and
        data nodes in the editor, then run them directly inside SoulFire without
        writing a full plugin.
      </>
    ),
  },
  {
    question: "How can I share my plugin or script?",
    answerHtml:
      'Submit a pull request on <a href="https://github.com/soulfiremc-com/soulfiremc.com">GitHub</a> to add your resource to this page, or share it in the SoulFire Discord server.',
    answerElement: (
      <>
        Submit a pull request on{" "}
        <a
          href="https://github.com/soulfiremc-com/soulfiremc.com"
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
