import { SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { UserNav } from "@/components/user-nav";
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
  links: [
    {
      type: "icon",
      icon: <SiDiscord />,
      text: "Discord",
      url: getRequiredEnv("NEXT_PUBLIC_DISCORD_LINK"),
      external: true,
    },
    {
      type: "icon",
      icon: <SiGithub />,
      text: "GitHub",
      label: "GitHub",
      url: "https://github.com/AlexProgrammerDE/SoulFire",
      external: true,
    },
    {
      type: "custom",
      secondary: true,
      children: <UserNav />,
    },
  ],
};
