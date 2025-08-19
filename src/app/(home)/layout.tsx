import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions } from '~/app/layout.config';
import type { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <HomeLayout {...baseOptions} links={[
    {
      type: "main",
      text: "Documentation",
      url: "/docs",
      description: "Learn how to use SoulFire",
    },
    ...(baseOptions.links || []),
  ]}>{children}</HomeLayout>;
}
