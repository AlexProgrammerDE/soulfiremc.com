import { SiDiscord } from "@icons-pack/react-simple-icons";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { getRequiredEnv } from "@/lib/env";

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image src={"/logo.png"} width={32} height={32} alt="SoulFire Logo" />
        <span className="font-medium">SoulFire</span>
      </>
    ),
    transparentMode: "top",
  },
  githubUrl: "https://github.com/AlexProgrammerDE/SoulFire",
  links: [
    {
      type: "main",
      text: "Downloads",
      url: "/download",
      on: "nav",
    },
    {
      type: "icon",
      icon: <SiDiscord />,
      text: "Discord",
      url: getRequiredEnv("NEXT_PUBLIC_DISCORD_LINK"),
      external: true,
    },
  ],
};
