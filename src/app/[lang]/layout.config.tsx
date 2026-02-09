import { SiDiscord } from "@icons-pack/react-simple-icons";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { getRequiredEnv } from "@/lib/env";
import { i18n } from "@/lib/i18n";

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: (
        <>
          <Image
            src={"/logo.png"}
            width={32}
            height={32}
            alt="SoulFire Logo"
          />
          <span className="font-medium">SoulFire</span>
        </>
      ),
      transparentMode: "top",
    },
    githubUrl: "https://github.com/AlexProgrammerDE/SoulFire",
    links: [
      {
        type: "icon",
        icon: <SiDiscord />,
        text: "Discord",
        url: getRequiredEnv("NEXT_PUBLIC_DISCORD_LINK"),
        external: true,
      },
    ],
  };
}
