import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { review } from "@/lib/db/schema";

type ItemType = "account" | "proxy" | "resource";

export async function getUpvoteCounts(
  itemType: ItemType,
  slugs: string[],
): Promise<Record<string, number>> {
  if (slugs.length === 0) return {};

  const counts = await db
    .select({
      itemSlug: review.itemSlug,
      count: sql<number>`count(*)::int`,
    })
    .from(review)
    .where(and(eq(review.itemType, itemType), inArray(review.itemSlug, slugs)))
    .groupBy(review.itemSlug);

  const countMap: Record<string, number> = {};
  for (const slug of slugs) {
    countMap[slug] = counts.find((c) => c.itemSlug === slug)?.count ?? 0;
  }
  return countMap;
}
