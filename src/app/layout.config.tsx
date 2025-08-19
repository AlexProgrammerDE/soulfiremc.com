import { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';
import { SiDiscord } from '@icons-pack/react-simple-icons';

export const baseOptions: BaseLayoutProps = {
  nav: {
    title: (
      <>
        <Image src={'/logo.png'} width={32} height={32} alt="SoulFire Logo" />
        <span className="font-medium">SoulFire</span>
      </>
    ),
    transparentMode: 'top',
  },
  githubUrl: 'https://github.com/AlexProgrammerDE/SoulFire',
  links: [
    {
      type: "icon",
      icon: <SiDiscord/>,
      text: "Discord",
      url: process.env.NEXT_PUBLIC_DISCORD_LINK,
      external: true,
    }
  ]
};
