"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useUpvoteTurnstile } from "@/components/upvote-turnstile-provider";
import { authClient } from "@/lib/auth-client";

type ItemType = "account" | "proxy" | "resource";

type UpvoteState = {
  counts: Record<string, number>;
  userUpvotes: Set<string>;
  loading: boolean;
  submitting: boolean;
};

function applyUpvoteState(
  previousState: UpvoteState,
  slug: string,
  upvoted: boolean,
): UpvoteState {
  const nextUserUpvotes = new Set(previousState.userUpvotes);
  const nextCounts = { ...previousState.counts };

  if (upvoted) {
    nextUserUpvotes.add(slug);
    nextCounts[slug] = (nextCounts[slug] ?? 0) + 1;
  } else {
    nextUserUpvotes.delete(slug);
    nextCounts[slug] = Math.max(0, (nextCounts[slug] ?? 0) - 1);
  }

  return {
    ...previousState,
    counts: nextCounts,
    userUpvotes: nextUserUpvotes,
  };
}

export function useUpvotes(
  itemType: ItemType,
  slugs: string[],
  initialCounts?: Record<string, number>,
) {
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const { executeTurnstile } = useUpvoteTurnstile();
  const slugsKey = useMemo(() => slugs.join(","), [slugs]);

  const [state, setState] = useState<UpvoteState>({
    counts: initialCounts ?? {},
    userUpvotes: new Set(),
    loading: true,
    submitting: false,
  });

  useEffect(() => {
    if (slugs.length === 0) {
      setState((prev) => ({ ...prev, loading: false }));
      return;
    }

    let cancelled = false;

    const fetchUpvotes = async () => {
      try {
        const res = await fetch(
          `/api/upvotes?type=${itemType}&slugs=${slugsKey}`,
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        if (!cancelled) {
          setState((prev) => ({
            ...prev,
            counts: data.counts,
            userUpvotes: new Set(data.userUpvotes),
            loading: false,
          }));
        }
      } catch {
        if (!cancelled) {
          setState((prev) => ({ ...prev, loading: false }));
        }
      }
    };

    fetchUpvotes();

    return () => {
      cancelled = true;
    };
  }, [itemType, slugsKey, slugs.length]);

  const toggleUpvote = useCallback(
    async (slug: string) => {
      if (!session?.user && !sessionPending) {
        return { error: "unauthorized" as const };
      }

      if (state.loading || state.submitting) {
        return;
      }

      const wasUpvoted = state.userUpvotes.has(slug);
      let turnstileToken: string | null = null;

      setState((prev) => ({ ...prev, submitting: true }));

      if (!wasUpvoted) {
        try {
          turnstileToken = await executeTurnstile();
        } catch {
          setState((prev) => ({ ...prev, submitting: false }));
          return { error: "verification" as const };
        }
      }

      // Optimistic update
      setState((prev) => applyUpvoteState(prev, slug, !wasUpvoted));

      try {
        const res = await fetch("/api/upvotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            itemType,
            itemSlug: slug,
            turnstileToken,
          }),
        });

        if (!res.ok) {
          // Revert optimistic update
          setState((prev) => applyUpvoteState(prev, slug, wasUpvoted));

          if (res.status === 401) {
            return { error: "unauthorized" as const };
          }

          if (res.status === 403) {
            return { error: "verification" as const };
          }
        }
      } catch {
        // Revert on network error
        setState((prev) => applyUpvoteState(prev, slug, wasUpvoted));
      } finally {
        setState((prev) => ({ ...prev, submitting: false }));
      }

      return { error: null };
    },
    [
      executeTurnstile,
      itemType,
      session?.user,
      sessionPending,
      state.loading,
      state.submitting,
      state.userUpvotes,
    ],
  );

  return {
    counts: state.counts,
    userUpvotes: state.userUpvotes,
    loading: state.loading || state.submitting,
    toggleUpvote,
  };
}
