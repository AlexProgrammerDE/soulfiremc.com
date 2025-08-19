import { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import Image from 'next/image';

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
};
