"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      Link={Link}
      social={{ providers: [/* "google", */ "discord", "github"] }}
      emailOTP
      emailVerification
      changeEmail
      passkey
      deleteUser={{
        verification: true,
      }}
      credentials={{
        forgotPassword: true,
        username: true,
      }}
      signUp
      nameRequired={false}
      twoFactor={["otp", "totp"]}
      captcha={{
        provider: "cloudflare-turnstile",
        siteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string,
      }}
      optimistic
      gravatar
      localization={{
        NAME: "Display Name",
        NAME_DESCRIPTION: "Please enter a display name.",
        NAME_PLACEHOLDER: "Display Name",
      }}
    >
      {children}
    </AuthUIProvider>
  );
}
