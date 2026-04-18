import { createFileRoute, redirect } from "@tanstack/react-router";
import { getRequiredEnv } from "@/lib/env";

export const Route = createFileRoute("/discord")({
  beforeLoad: () => {
    throw redirect({
      href: getRequiredEnv(
        import.meta.env.NEXT_PUBLIC_DISCORD_LINK,
        "NEXT_PUBLIC_DISCORD_LINK",
      ),
    });
  },
});
