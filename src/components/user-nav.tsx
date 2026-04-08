"use client";

import { UserButton } from "@daveyplate/better-auth-ui";
import { AuthProvider } from "@/components/auth-provider";

export function UserNav() {
  return (
    <AuthProvider>
      <UserButton size="icon" />
    </AuthProvider>
  );
}
