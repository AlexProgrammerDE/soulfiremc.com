"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReviewTurnstile } from "@/components/review-turnstile-provider";
import { useSession } from "@/lib/auth-hooks";
import {
  emptyReviewSummary,
  type ItemType,
  type PaginatedPublicReviewRecords,
  type ReviewSummary,
  type UserReviewRecord,
} from "@/lib/review-core";
import {
  deleteReviewServerFn,
  getReviewsServerFn,
  submitReviewServerFn,
} from "@/lib/reviews-actions";

type UseReviewsOptions = {
  initialSummaries?: Record<string, ReviewSummary>;
  includeWrittenReviews?: boolean;
  initialWrittenReviews?: Record<string, PaginatedPublicReviewRecords>;
  writtenReviewsPage?: number;
};

type ReviewState = {
  summaries: Record<string, ReviewSummary>;
  userReviews: Record<string, UserReviewRecord>;
  writtenReviews: Record<string, PaginatedPublicReviewRecords>;
  loading: boolean;
  pendingBySlug: Record<string, boolean>;
};

type MutationError = "unauthorized" | "verification" | null;

function withEmptySummaries(
  slugs: string[],
  summaries?: Record<string, ReviewSummary>,
) {
  return Object.fromEntries(
    slugs.map((slug) => [slug, summaries?.[slug] ?? emptyReviewSummary()]),
  );
}

export function useReviews(
  itemType: ItemType,
  slugs: string[],
  options?: UseReviewsOptions,
) {
  const { data: session, isPending: sessionPending } = useSession();
  const { executeTurnstile } = useReviewTurnstile();
  const includeWrittenReviews = options?.includeWrittenReviews ?? false;
  const writtenReviewsPage = Math.max(1, options?.writtenReviewsPage ?? 1);
  const normalizedSlugs = useMemo(
    () => slugs.map((slug) => slug.trim()).filter(Boolean),
    [slugs],
  );
  const refreshRequestIdRef = useRef(0);

  const [state, setState] = useState<ReviewState>({
    summaries: withEmptySummaries(normalizedSlugs, options?.initialSummaries),
    userReviews: {},
    writtenReviews: options?.initialWrittenReviews ?? {},
    loading: normalizedSlugs.length > 0,
    pendingBySlug: {},
  });

  const refreshReviews = useCallback(
    async (targetSlugs: string[]) => {
      refreshRequestIdRef.current += 1;
      const requestId = refreshRequestIdRef.current;

      if (targetSlugs.length === 0) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      const data = await getReviewsServerFn({
        data: {
          itemType,
          slugs: targetSlugs,
          includeWrittenReviews:
            includeWrittenReviews && targetSlugs.length === 1,
          reviewsPage: writtenReviewsPage,
        },
      });

      setState((prev) => {
        if (requestId !== refreshRequestIdRef.current) {
          return prev;
        }

        const nextSummaries = { ...prev.summaries };
        for (const slug of targetSlugs) {
          nextSummaries[slug] = data.summaries[slug] ?? emptyReviewSummary();
        }

        const nextUserReviews = { ...prev.userReviews };
        for (const slug of targetSlugs) {
          delete nextUserReviews[slug];
        }
        Object.assign(nextUserReviews, data.userReviews);

        const nextWrittenReviews = { ...prev.writtenReviews };
        if (includeWrittenReviews && targetSlugs.length === 1) {
          nextWrittenReviews[targetSlugs[0]] = data.writtenReviews ?? {
            entries: [],
            page: writtenReviewsPage,
            pageSize: 8,
            totalCount: 0,
            totalPages: 0,
          };
        }

        return {
          ...prev,
          summaries: nextSummaries,
          userReviews: nextUserReviews,
          writtenReviews: nextWrittenReviews,
          loading: false,
        };
      });
    },
    [includeWrittenReviews, itemType, writtenReviewsPage],
  );

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      summaries: withEmptySummaries(normalizedSlugs, options?.initialSummaries),
      writtenReviews: options?.initialWrittenReviews ?? prev.writtenReviews,
      loading: normalizedSlugs.length > 0,
    }));

    let cancelled = false;

    refreshReviews(normalizedSlugs).catch(() => {
      if (!cancelled) {
        setState((prev) => ({ ...prev, loading: false }));
      }
    });

    return () => {
      cancelled = true;
    };
  }, [
    normalizedSlugs,
    options?.initialSummaries,
    options?.initialWrittenReviews,
    refreshReviews,
  ]);

  const setPending = useCallback((slug: string, value: boolean) => {
    setState((prev) => ({
      ...prev,
      pendingBySlug: {
        ...prev.pendingBySlug,
        [slug]: value,
      },
    }));
  }, []);

  const upsertReview = useCallback(
    async (
      slug: string,
      nextReview: {
        rating: number;
        anonymous?: boolean;
        body?: string | null;
      },
    ): Promise<{ error: MutationError }> => {
      if (!session?.user && !sessionPending) {
        return { error: "unauthorized" };
      }

      if (state.loading || state.pendingBySlug[slug]) {
        return { error: null };
      }

      const needsTurnstile = !state.userReviews[slug];
      let turnstileToken: string | null = null;

      setPending(slug, true);

      if (needsTurnstile) {
        try {
          turnstileToken = await executeTurnstile();
        } catch {
          setPending(slug, false);
          return { error: "verification" };
        }
      }

      try {
        const result = await submitReviewServerFn({
          data: {
            itemType,
            itemSlug: slug,
            rating: nextReview.rating,
            anonymous: nextReview.anonymous ?? true,
            body: nextReview.body ?? null,
            turnstileToken,
          },
        });

        if (!result.ok) {
          return { error: result.error };
        }

        await refreshReviews([slug]);
        return { error: null };
      } finally {
        setPending(slug, false);
      }
    },
    [
      executeTurnstile,
      itemType,
      refreshReviews,
      session?.user,
      sessionPending,
      setPending,
      state.loading,
      state.pendingBySlug,
      state.userReviews,
    ],
  );

  const deleteReview = useCallback(
    async (slug: string): Promise<{ error: MutationError }> => {
      if (!session?.user && !sessionPending) {
        return { error: "unauthorized" };
      }

      if (state.loading || state.pendingBySlug[slug]) {
        return { error: null };
      }

      setPending(slug, true);

      try {
        const result = await deleteReviewServerFn({
          data: {
            itemType,
            itemSlug: slug,
          },
        });

        if (!result.ok) {
          return { error: result.error };
        }

        await refreshReviews([slug]);
        return { error: null };
      } finally {
        setPending(slug, false);
      }
    },
    [
      itemType,
      refreshReviews,
      session?.user,
      sessionPending,
      setPending,
      state.loading,
      state.pendingBySlug,
    ],
  );

  return {
    summaries: state.summaries,
    userReviews: state.userReviews,
    writtenReviews: state.writtenReviews,
    loading: state.loading,
    pendingBySlug: state.pendingBySlug,
    upsertReview,
    deleteReview,
    refreshReviews,
  };
}
