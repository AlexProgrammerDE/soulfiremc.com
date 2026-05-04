"use client";

import { MessageSquareText } from "lucide-react";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ReviewTurnstileProvider } from "@/components/review-turnstile-provider";
import { SignInRequiredCredenza } from "@/components/sign-in-required-credenza";
import { CustomTimeAgo } from "@/components/time-ago";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useReviews } from "@/hooks/use-reviews";
import type {
  ItemType,
  PaginatedPublicReviewRecords,
  ReviewSummary,
} from "@/lib/review-core";
import { reviewsPageParser } from "@/lib/reviews-search-params";
import { ReviewStarInput, ReviewStars } from "./review-stars";

function initial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function handleMutationError(
  error: "unauthorized" | "verification" | null,
  onUnauthorized: () => void,
) {
  if (error === "unauthorized") {
    onUnauthorized();
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
  initialWrittenReviews: PaginatedPublicReviewRecords;
}) {
  return (
    <ReviewTurnstileProvider>
      <ItemReviewsSectionContent
        itemType={itemType}
        slug={slug}
        initialSummary={initialSummary}
        initialWrittenReviews={initialWrittenReviews}
      />
    </ReviewTurnstileProvider>
  );
}

function ItemReviewsSectionContent({
  itemType,
  slug,
  initialSummary,
  initialWrittenReviews,
}: {
  itemType: ItemType;
  slug: string;
  initialSummary: ReviewSummary;
  initialWrittenReviews: PaginatedPublicReviewRecords;
}) {
  const [reviewPage, setReviewPage] = useQueryState(
    "reviewsPage",
    reviewsPageParser,
  );
  const activeReviewPage = Math.max(1, reviewPage);
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
    writtenReviewsPage: activeReviewPage,
  });

  const summary = summaries[slug] ?? initialSummary;
  const currentReview = userReviews[slug];
  const reviewPageData = writtenReviews[slug] ?? initialWrittenReviews;
  const visibleReviews = reviewPageData.entries;
  const pending = pendingBySlug[slug] ?? false;

  const [rating, setRating] = useState(currentReview?.rating ?? 5);
  const [body, setBody] = useState(currentReview?.body ?? "");
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    setRating(currentReview?.rating ?? 5);
    setBody(currentReview?.body ?? "");
  }, [currentReview]);

  useEffect(() => {
    if (reviewPage < 1) {
      void setReviewPage(1);
    }
  }, [reviewPage, setReviewPage]);

  const hasWrittenReviews = visibleReviews.length > 0;
  const hasPreviousPage = reviewPageData.page > 1;
  const hasNextPage = reviewPageData.page < reviewPageData.totalPages;
  const visibleRangeStart =
    reviewPageData.totalCount === 0
      ? 0
      : (reviewPageData.page - 1) * reviewPageData.pageSize + 1;
  const visibleRangeEnd =
    reviewPageData.totalCount === 0
      ? 0
      : visibleRangeStart + visibleReviews.length - 1;
  const reviewCountLabel = useMemo(() => {
    if (summary.reviewCount === 0) {
      return "No ratings yet";
    }

    return `${summary.reviewCount} rating${summary.reviewCount === 1 ? "" : "s"} collected`;
  }, [summary.reviewCount]);

  const saveReview = async () => {
    const normalizedBody = body.trim();
    const submittedForReview =
      normalizedBody.length > 0 &&
      (currentReview?.commentStatus !== "approved" ||
        (currentReview.body?.trim() ?? "") !== normalizedBody);
    const result = await upsertReview(slug, {
      rating,
      body,
    });
    handleMutationError(result.error, () => setShowSignInPrompt(true));
    if (!result.error) {
      toast(
        submittedForReview
          ? "Review submitted for moderation"
          : currentReview
            ? "Review updated"
            : "Review saved",
      );
    }
  };

  const removeReview = async () => {
    const result = await deleteReview(slug);
    handleMutationError(result.error, () => setShowSignInPrompt(true));
    if (!result.error) {
      toast("Review removed");
    }
  };

  const goToReviewPage = (page: number) => {
    void setReviewPage(page);
  };

  return (
    <>
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Ratings & reviews</h2>
          <p className="text-sm text-muted-foreground">
            Ratings affect the average immediately. Written comments are
            reviewed before publication.
          </p>
        </div>

        <Card className="gap-4 px-6 py-5">
          {summary.averageRating !== null ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex items-end gap-3">
                <span className="text-5xl font-bold tracking-tight tabular-nums">
                  {summary.averageRating.toFixed(1)}
                </span>
                <div className="space-y-1 pb-1">
                  <ReviewStars value={summary.averageRating} size="lg" />
                  <p className="text-sm text-muted-foreground">
                    {reviewCountLabel}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:min-w-64">
                <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Average
                  </div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">
                    {summary.averageRating.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    Total Ratings
                  </div>
                  <div className="mt-1 text-2xl font-semibold tabular-nums">
                    {summary.reviewCount}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <div className="text-lg font-semibold">No ratings yet</div>
                <p className="text-sm text-muted-foreground">
                  Be the first person to leave a rating and written review.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-dashed px-4 py-2 text-sm text-muted-foreground">
                <MessageSquareText className="h-4 w-4" />
                Waiting for the first rating
              </div>
            </div>
          )}
        </Card>

        <Card className="gap-5 p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">Your review</h3>
            <p className="text-sm text-muted-foreground">
              Leave a star rating, optionally add context, and decide whether
              your profile is shown publicly.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)]">
            <div className="space-y-2">
              <span className="text-sm font-medium">Rating</span>
              <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-3">
                <ReviewStarInput
                  value={rating}
                  onChange={setRating}
                  disabled={pending}
                  size="lg"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label
                htmlFor={`review-body-${slug}`}
                className="text-sm font-medium"
              >
                Written review (optional, will be reviewed)
              </label>
              <textarea
                id={`review-body-${slug}`}
                value={body}
                onChange={(event) => setBody(event.target.value)}
                disabled={pending}
                rows={6}
                maxLength={2000}
                placeholder="What stood out? Delivery speed, support quality, stability, setup experience..."
                className="min-h-40 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary"
              />
              <div className="flex justify-end text-xs text-muted-foreground">
                {body.length}/2000
              </div>
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
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">Latest reviews</h3>
              {reviewPageData.totalCount > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Showing {visibleRangeStart}-{visibleRangeEnd} of{" "}
                  {reviewPageData.totalCount} review
                  {reviewPageData.totalCount === 1 ? "" : "s"}.
                </p>
              ) : null}
            </div>

            {reviewPageData.totalPages > 1 ? (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => goToReviewPage(reviewPageData.page - 1)}
                  disabled={!hasPreviousPage || loading}
                >
                  Previous
                </Button>
                <div className="min-w-24 text-center text-sm text-muted-foreground">
                  Page {reviewPageData.page} of {reviewPageData.totalPages}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => goToReviewPage(reviewPageData.page + 1)}
                  disabled={!hasNextPage || loading}
                >
                  Next
                </Button>
              </div>
            ) : null}
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
                  {entry.body ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      {entry.body}
                    </p>
                  ) : entry.commentStatus === "pending" ? (
                    <p className="text-sm italic text-muted-foreground/80">
                      Review pending.
                    </p>
                  ) : null}
                </Card>
              ))}
            </div>
          ) : (
            <Card className="flex flex-col items-start gap-3 p-5 text-sm text-muted-foreground">
              <MessageSquareText className="h-5 w-5" />
              No reviews yet. Ratings without comments will still appear here
              and count toward the average above.
            </Card>
          )}
        </div>
      </section>
      <SignInRequiredCredenza
        open={showSignInPrompt}
        onOpenChange={setShowSignInPrompt}
        title="Sign in to leave a review"
        description="You need to be signed in to rate and review this listing."
      />
    </>
  );
}
