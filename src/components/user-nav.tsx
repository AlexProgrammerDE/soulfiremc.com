"use client";

import { SignedIn, SignedOut, UserButton } from "@daveyplate/better-auth-ui";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UserNav() {
  return (
    <>
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Button asChild variant="ghost" size="sm">
          <Link href="/auth/sign-in">
            <LogIn className="mr-2 h-4 w-4" />
            Sign In
          </Link>
        </Button>
      </SignedOut>
    </>
  );
}
