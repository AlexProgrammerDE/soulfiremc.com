import "server-only";

import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { withGravatarFallback } from "@/lib/avatar";
import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";
import { review } from "@/lib/db/schema";
import {
  emptyReviewSummary,
  type ItemType,
  type PaginatedPublicReviewRecords,
  type PublicReviewRecord,
  type ReviewSummary,
  type UserReviewRecord,
} from "@/lib/review-core";

export type {
  ItemType,
  PaginatedPublicReviewRecords,
  PublicReviewRecord,
  ReviewSummary,
  UserReviewRecord,
} from "@/lib/review-core";
export {
  emptyReviewSummary,
  getAggregateRatingJsonLd,
  getReviewJsonLd,
} from "@/lib/review-core";

export async function getReviewSummaries(
  itemType: ItemType,
  slugs: string[],
): Promise<Record<string, ReviewSummary>> {
  if (slugs.length === 0) return {};

  const rows = await db
    .select({
      itemSlug: review.itemSlug,
      reviewCount: sql<number>`count(*)::int`,
      averageRating: sql<number>`round(avg(${review.rating})::numeric, 2)::float8`,
    })
    .from(review)
    .where(and(eq(review.itemType, itemType), inArray(review.itemSlug, slugs)))
    .groupBy(review.itemSlug);

  const summaryMap: Record<string, ReviewSummary> = {};
  for (const slug of slugs) {
    summaryMap[slug] = emptyReviewSummary();
  }

  for (const row of rows) {
    summaryMap[row.itemSlug] = {
      averageRating: row.averageRating,
      reviewCount: row.reviewCount,
    };
  }

  return summaryMap;
}

export async function getUserReviews(
  userId: string,
  itemType: ItemType,
  slugs: string[],
): Promise<Record<string, UserReviewRecord>> {
  if (slugs.length === 0) return {};

  const rows = await db
    .select({
      itemSlug: review.itemSlug,
      rating: review.rating,
      body: review.body,
    })
    .from(review)
    .where(
      and(
        eq(review.userId, userId),
        eq(review.itemType, itemType),
        inArray(review.itemSlug, slugs),
      ),
    );

  return Object.fromEntries(
    rows.map((row) => [
      row.itemSlug,
      {
        rating: row.rating,
        body: row.body,
      },
    ]),
  );
}

export async function getWrittenReviews(
  itemType: ItemType,
  slug: string,
  options?: {
    page?: number;
    pageSize?: number;
  },
): Promise<PublicReviewRecord[]> {
  const page = Math.max(1, options?.page ?? 1);
  const pageSize = Math.max(1, options?.pageSize ?? 8);
  const offset = (page - 1) * pageSize;

  const rows = await db
    .select({
      id: review.id,
      itemSlug: review.itemSlug,
      rating: review.rating,
      body: review.body,
      createdAt: review.createdAt,
      userName: user.name,
      username: user.username,
      displayUsername: user.displayUsername,
      userEmail: user.email,
      userImage: user.image,
    })
    .from(review)
    .leftJoin(user, eq(review.userId, user.id))
    .where(and(eq(review.itemType, itemType), eq(review.itemSlug, slug)))
    .orderBy(desc(review.createdAt))
    .limit(pageSize)
    .offset(offset);

  return rows.map((row) => {
    const authorName = row.displayUsername ?? row.username ?? "User";

    return {
      id: row.id,
      itemSlug: row.itemSlug,
      rating: row.rating,
      body: row.body?.trim() || null,
      createdAt: row.createdAt.toISOString(),
      authorName,
      authorImage: withGravatarFallback(row.userImage, row.userEmail),
    };
  });
}

export async function getPaginatedWrittenReviews(
  itemType: ItemType,
  slug: string,
  totalCount: number,
  options?: {
    page?: number;
    pageSize?: number;
  },
): Promise<PaginatedPublicReviewRecords> {
  const pageSize = Math.max(1, options?.pageSize ?? 8);
  const totalPages =
    totalCount === 0 ? 0 : Math.max(1, Math.ceil(totalCount / pageSize));
  const page =
    totalPages === 0
      ? 1
      : Math.min(Math.max(1, options?.page ?? 1), totalPages);
  const entries =
    totalCount === 0
      ? []
      : await getWrittenReviews(itemType, slug, {
          page,
          pageSize,
        });

  return {
    entries,
    page,
    pageSize,
    totalCount,
    totalPages,
  };
}
