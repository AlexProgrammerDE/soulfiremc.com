"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type ItemType = "account" | "proxy" | "resource";

type UpvoteState = {
  counts: Record<string, number>;
  userUpvotes: Set<string>;
  loading: boolean;
};

export function useUpvotes(itemType: ItemType, slugs: string[]) {
  const slugsKey = useMemo(() => slugs.join(","), [slugs]);

  const [state, setState] = useState<UpvoteState>({
    counts: {},
    userUpvotes: new Set(),
    loading: true,
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
          setState({
            counts: data.counts,
            userUpvotes: new Set(data.userUpvotes),
            loading: false,
          });
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
      const wasUpvoted = state.userUpvotes.has(slug);

      // Optimistic update
      setState((prev) => {
        const newUserUpvotes = new Set(prev.userUpvotes);
        const newCounts = { ...prev.counts };
        if (wasUpvoted) {
          newUserUpvotes.delete(slug);
          newCounts[slug] = Math.max(0, (newCounts[slug] ?? 0) - 1);
        } else {
          newUserUpvotes.add(slug);
          newCounts[slug] = (newCounts[slug] ?? 0) + 1;
        }
        return { ...prev, counts: newCounts, userUpvotes: newUserUpvotes };
      });

      try {
        const res = await fetch("/api/upvotes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ itemType, itemSlug: slug }),
        });

        if (!res.ok) {
          // Revert optimistic update
          setState((prev) => {
            const newUserUpvotes = new Set(prev.userUpvotes);
            const newCounts = { ...prev.counts };
            if (wasUpvoted) {
              newUserUpvotes.add(slug);
              newCounts[slug] = (newCounts[slug] ?? 0) + 1;
            } else {
              newUserUpvotes.delete(slug);
              newCounts[slug] = Math.max(0, (newCounts[slug] ?? 0) - 1);
            }
            return { ...prev, counts: newCounts, userUpvotes: newUserUpvotes };
          });

          if (res.status === 401) {
            return { error: "unauthorized" as const };
          }
        }
      } catch {
        // Revert on network error
        setState((prev) => {
          const newUserUpvotes = new Set(prev.userUpvotes);
          const newCounts = { ...prev.counts };
          if (wasUpvoted) {
            newUserUpvotes.add(slug);
            newCounts[slug] = (newCounts[slug] ?? 0) + 1;
          } else {
            newUserUpvotes.delete(slug);
            newCounts[slug] = Math.max(0, (newCounts[slug] ?? 0) - 1);
          }
          return { ...prev, counts: newCounts, userUpvotes: newUserUpvotes };
        });
      }
      return { error: null };
    },
    [itemType, state.userUpvotes],
  );

  return {
    counts: state.counts,
    userUpvotes: state.userUpvotes,
    loading: state.loading,
    toggleUpvote,
  };
}
