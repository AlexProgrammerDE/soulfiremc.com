import { createFileRoute, redirect } from "@tanstack/react-router";
import { getRequiredEnv } from "@/lib/env";

export const Route = createFileRoute("/donate")({
  beforeLoad: () => {
    throw redirect({
      href: getRequiredEnv(
        import.meta.env.NEXT_PUBLIC_DONATE_LINK,
        "NEXT_PUBLIC_DONATE_LINK",
      ),
    });
  },
});
