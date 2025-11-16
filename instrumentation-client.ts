import posthog from "posthog-js";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: "/RELAY-KAWND",
    ui_host: "https://eu.posthog.com",
    defaults: "2025-05-24",
    capture_exceptions: true, // capture exceptions using Error Tracking
    debug: process.env.NODE_ENV === "development",
    cookieless_mode: "always",
  });
}
