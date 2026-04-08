"use client";

import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { CustomTimeAgo } from "@/components/time-ago";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useReviews } from "@/hooks/use-reviews";
import type {
  ItemType,
  PublicReviewRecord,
  ReviewSummary,
} from "@/lib/review-core";
import { ReviewStarInput, ReviewStars } from "./review-stars";
import { ReviewSummaryBadge } from "./review-summary-badge";

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function handleMutationError(
  router: ReturnType<typeof useRouter>,
  error: "unauthorized" | "verification" | null,
) {
  if (error === "unauthorized") {
    toast("Sign in to leave a review", {
      description: "You need to be signed in to rate and review this listing.",
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
        "Cloudflare Turnstile could not verify this review. Please try again.",
    });
  }
}

export function ItemReviewsSection({
  itemType,
  slug,
  initialSummary,
  initialWrittenReviews,
}: {
  itemType: ItemType;
  slug: string;
  initialSummary: ReviewSummary;
  initialWrittenReviews: PublicReviewRecord[];
}) {
  const router = useRouter();
  const reviewSlugs = useMemo(() => [slug], [slug]);
  const initialSummaryMap = useMemo(
    () => ({ [slug]: initialSummary }),
    [initialSummary, slug],
  );
  const initialWrittenReviewMap = useMemo(
    () => ({ [slug]: initialWrittenReviews }),
    [initialWrittenReviews, slug],
  );
  const {
    summaries,
    userReviews,
    writtenReviews,
    loading,
    pendingBySlug,
    upsertReview,
    deleteReview,
  } = useReviews(itemType, reviewSlugs, {
    initialSummaries: initialSummaryMap,
    includeWrittenReviews: true,
    initialWrittenReviews: initialWrittenReviewMap,
  });

  const summary = summaries[slug] ?? initialSummary;
  const currentReview = userReviews[slug];
  const visibleReviews = writtenReviews[slug] ?? initialWrittenReviews;
  const pending = pendingBySlug[slug] ?? false;

  const [rating, setRating] = useState(currentReview?.rating ?? 5);
  const [anonymous, setAnonymous] = useState(currentReview?.anonymous ?? true);
  const [body, setBody] = useState(currentReview?.body ?? "");

  useEffect(() => {
    setRating(currentReview?.rating ?? 5);
    setAnonymous(currentReview?.anonymous ?? true);
    setBody(currentReview?.body ?? "");
  }, [currentReview]);

  const hasWrittenReviews = visibleReviews.length > 0;
  const reviewCountLabel = useMemo(() => {
    if (summary.reviewCount === 0) {
      return "No ratings yet";
    }

    return `${summary.reviewCount} rating${summary.reviewCount === 1 ? "" : "s"} collected`;
  }, [summary.reviewCount]);

  const saveReview = async () => {
    const result = await upsertReview(slug, {
      rating,
      anonymous,
      body,
    });
    handleMutationError(router, result.error);
    if (!result.error) {
      toast(currentReview ? "Review updated" : "Review saved");
    }
  };

  const removeReview = async () => {
    const result = await deleteReview(slug);
    handleMutationError(router, result.error);
    if (!result.error) {
      toast("Review removed");
    }
  };

  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold">Ratings & reviews</h2>
        <p className="text-sm text-muted-foreground">
          Ratings affect the average immediately. Only written reviews are shown
          publicly.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="gap-4 p-6">
          <div className="space-y-3">
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold tracking-tight tabular-nums">
                {summary.averageRating?.toFixed(1) ?? "—"}
              </span>
              <div className="space-y-1 pb-1">
                {summary.averageRating !== null ? (
                  <ReviewStars value={summary.averageRating} size="lg" />
                ) : (
                  <ReviewSummaryBadge summary={summary} />
                )}
                {summary.averageRating !== null ? (
                  <p className="text-sm text-muted-foreground">
                    {reviewCountLabel}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="rounded-xl border border-dashed px-4 py-3 text-sm text-muted-foreground">
              Legacy likes were migrated into 5-star anonymous ratings, so the
              count reflects both the imported history and new ratings.
            </div>
          </div>
        </Card>

        <Card className="gap-4 p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Your review</h3>
            <p className="text-sm text-muted-foreground">
              Leave a star rating, optionally add context, and decide whether
              your profile is shown publicly.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-sm font-medium">Rating</span>
              <ReviewStarInput
                value={rating}
                onChange={setRating}
                disabled={pending}
                size="lg"
              />
            </div>

            <label className="flex items-start gap-3 rounded-xl border border-border/70 px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={!anonymous}
                onChange={(event) => setAnonymous(!event.target.checked)}
                disabled={pending}
                className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
              />
              <span className="space-y-1">
                <span className="block font-medium">
                  Show my profile publicly
                </span>
                <span className="block text-muted-foreground">
                  When disabled, your review appears as Anonymous without your
                  avatar or display name.
                </span>
              </span>
            </label>

            <div className="space-y-2">
              <label
                htmlFor={`review-body-${slug}`}
                className="text-sm font-medium"
              >
                Written review
              </label>
              <textarea
                id={`review-body-${slug}`}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                disabled={pending}
                rows={5}
                maxLength={2000}
                placeholder="What stood out? Delivery speed, support quality, stability, setup experience..."
                className="min-h-32 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                {body.length}/2000
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                onClick={saveReview}
                disabled={pending || loading}
              >
                {currentReview ? "Update review" : "Submit review"}
              </Button>
              {currentReview ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={removeReview}
                  disabled={pending}
                >
                  Remove review
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-lg font-semibold">Latest written reviews</h3>
          <ReviewSummaryBadge summary={summary} compact />
        </div>

        {hasWrittenReviews ? (
          <div className="grid gap-4">
            {visibleReviews.map((entry) => (
              <Card key={entry.id} className="gap-4 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar size="lg">
                      {entry.authorImage ? (
                        <AvatarImage
                          src={entry.authorImage}
                          alt={entry.authorName}
                        />
                      ) : null}
                      <AvatarFallback>
                        {initial(entry.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <p className="font-medium">{entry.authorName}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <ReviewStars value={entry.rating} size="sm" />
                        <span className="tabular-nums">
                          {entry.rating.toFixed(1)}
                        </span>
                        <span>·</span>
                        <CustomTimeAgo date={entry.createdAt} />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {entry.body}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="flex flex-col items-start gap-3 p-5 text-sm text-muted-foreground">
            <MessageSquareText className="h-5 w-5" />
            No written reviews yet. Star-only ratings still count toward the
            average above.
          </Card>
        )}
      </div>
    </section>
  );
}
