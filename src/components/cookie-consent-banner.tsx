"use client";

import posthog from "posthog-js";
import { useEffect, useState } from "react";

const buttonBaseClasses =
  "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

type ConsentState = ReturnType<typeof posthog.get_explicit_consent_status>;

type BannerState = ConsentState | "loading";

export function CookieConsentBanner() {
  const [consentState, setConsentState] = useState<BannerState>("loading");

  useEffect(() => {
    setConsentState(posthog.get_explicit_consent_status());
  }, []);

  if (consentState !== "pending") {
    return null;
  }

  const accept = () => {
    posthog.opt_in_capturing();
    setConsentState("granted");
  };

  const decline = () => {
    posthog.opt_out_capturing();
    setConsentState("denied");
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center p-4 sm:p-6">
      <div className="pointer-events-auto flex w-full max-w-3xl flex-col gap-4 rounded-2xl border bg-background/95 p-4 text-sm shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:flex-row sm:items-center sm:gap-6 sm:px-6 sm:py-5">
        <p className="text-muted-foreground">
          We use cookies to understand how people use SoulFire so we can improve
          it. You can accept or reject tracking at any time.
        </p>
        <div className="flex flex-1 flex-row flex-wrap gap-3 sm:justify-end">
          <button
            type="button"
            onClick={decline}
            className={`${buttonBaseClasses} border border-input bg-transparent text-foreground hover:bg-muted focus-visible:outline-ring`}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className={`${buttonBaseClasses} bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-primary`}
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
}
