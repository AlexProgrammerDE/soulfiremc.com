import posthog from "posthog-js";

posthog.init(import.meta.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
  api_host: "https://e.soulfiremc.com",
  ui_host: "https://eu.posthog.com",
  defaults: "2025-05-24",
  capture_exceptions: true, // capture exceptions using Error Tracking
  debug: import.meta.env.DEV,
  cookieless_mode: "on_reject",
});
