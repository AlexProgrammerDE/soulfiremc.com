'use client';

import { SignedIn, SignedOut, UserButton } from '@daveyplate/better-auth-ui';
import { LogIn } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function UserNav() {
  return (
    <>
      <UserButton size="icon" />
    </>
  );
}
