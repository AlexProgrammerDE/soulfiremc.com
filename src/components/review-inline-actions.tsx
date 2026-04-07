"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ReviewSummary } from "@/lib/reviews";
import { Button } from "./ui/button";
import { ReviewStarInput } from "./review-stars";
import { ReviewSummaryBadge } from "./review-summary-badge";

type MutationResult =
  | Promise<{ error: "unauthorized" | "verification" | null }>
  | undefined;

function handleMutationError(
  router: ReturnType<typeof useRouter>,
  error: "unauthorized" | "verification" | null,
) {
  if (error === "unauthorized") {
    toast("Sign in to leave a rating", {
      description: "You need to be signed in to rate this listing.",
      action: {
        label: "Sign In",
        onClick: () => router.push("/auth/sign-in"),
      },
    });
    return;
  }

  if (error === "verification") {
    toast("Verification failed", {
      description:
        "Cloudflare Turnstile could not verify this rating. Please try again.",
    });
  }
}

export function ReviewInlineActions({
  summary,
  currentRating,
  pending,
  onRate,
  onClear,
}: {
  summary: ReviewSummary;
  currentRating?: number;
  pending?: boolean;
  onRate: (rating: number) => MutationResult;
  onClear?: () => MutationResult;
}) {
  const router = useRouter();

  const handleRate = async (rating: number) => {
    const result = await onRate(rating);
    handleMutationError(router, result?.error ?? null);
  };

  const handleClear = async () => {
    if (!onClear) return;
    const result = await onClear();
    handleMutationError(router, result?.error ?? null);
  };

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-border/70 bg-muted/20 px-3 py-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ReviewSummaryBadge summary={summary} compact />
        {currentRating ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            disabled={pending}
            className="h-8 px-2 text-xs text-muted-foreground"
          >
            Remove
          </Button>
        ) : null}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          Your rating
        </span>
        <ReviewStarInput
          value={currentRating ?? 0}
          onChange={handleRate}
          disabled={pending}
        />
      </div>
    </div>
  );
}
