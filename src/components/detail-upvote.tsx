"use client";

import { useMemo } from "react";
import { UpvoteButton } from "@/components/upvote-button";
import { useUpvotes } from "@/hooks/use-upvotes";

type ItemType = "account" | "proxy" | "resource";

export function DetailUpvote({
  itemType,
  slug,
}: {
  itemType: ItemType;
  slug: string;
}) {
  const slugs = useMemo(() => [slug], [slug]);
  const { counts, userUpvotes, loading, toggleUpvote } = useUpvotes(
    itemType,
    slugs,
  );

  return (
    <UpvoteButton
      slug={slug}
      count={counts[slug] ?? 0}
      isUpvoted={userUpvotes.has(slug)}
      loading={loading}
      onToggle={toggleUpvote}
    />
  );
}
