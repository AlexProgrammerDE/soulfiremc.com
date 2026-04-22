import { AuthQueryProvider } from "@daveyplate/better-auth-tanstack";
import { AuthUIProviderTanstack } from "@daveyplate/better-auth-ui/tanstack";
import { useRouter } from "@tanstack/react-router";
import { RootProvider } from "fumadocs-ui/provider/tanstack";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { Toaster } from "sonner";
import { authClient } from "@/lib/auth-client";
import { PostHogProvider } from "@/lib/integrations/posthog";
import { AuthLink } from "./auth-link";

function AuthAvatarImage({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  return src ? <img src={src} alt={alt} className={className} /> : null;
}

function AuthUIProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <AuthQueryProvider>
      <AuthUIProviderTanstack
        authClient={authClient}
        navigate={(href) => router.navigate({ to: href })}
        replace={(href) => router.navigate({ to: href, replace: true })}
        Link={AuthLink}
        social={{ providers: ["google", "discord", "github"] }}
        emailOTP
        emailVerification
        changeEmail
        passkey
        deleteUser={{ verification: true }}
        credentials={{ forgotPassword: true, username: true }}
        signUp
        nameRequired={false}
        twoFactor={["otp", "totp"]}
        captcha={{
          provider: "cloudflare-turnstile",
          siteKey: import.meta.env.VITE_TURNSTILE_SITE_KEY as string,
        }}
        optimistic
        avatar={{
          Image: AuthAvatarImage,
        }}
        gravatar
        localization={{
          NAME: "Display Name",
          NAME_DESCRIPTION: "Please enter a display name.",
          NAME_PLACEHOLDER: "Display Name",
        }}
      >
        {children}
      </AuthUIProviderTanstack>
    </AuthQueryProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NuqsAdapter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <PostHogProvider>
          <RootProvider>
            <AuthUIProviders>
              {children}
              <Toaster richColors />
            </AuthUIProviders>
          </RootProvider>
        </PostHogProvider>
      </ThemeProvider>
    </NuqsAdapter>
  );
}
