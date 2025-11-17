"use client";

import posthog from "posthog-js";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
      <Card className="pointer-events-auto w-full max-w-3xl border-border/80 bg-background/95 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <CardHeader className="gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="space-y-1">
            <CardTitle>Help us improve SoulFire</CardTitle>
            <CardDescription>
              We use analytics cookies to understand how people use SoulFire.
              You can accept or reject tracking at any time.
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            className="w-full sm:w-auto"
            onClick={decline}
          >
            Decline
          </Button>
          <Button className="w-full sm:w-auto" onClick={accept}>
            Accept cookies
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
