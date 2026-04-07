import {
  and,
  desc,
  eq,
  inArray,
  isNotNull,
  sql,
} from "drizzle-orm";
import type { AggregateRating, Review as SchemaReview } from "schema-dts";
import { user } from "@/lib/db/auth-schema";
import { db } from "@/lib/db";
import { review } from "@/lib/db/schema";

export type ItemType = "account" | "proxy" | "resource";

export type ReviewSummary = {
  averageRating: number | null;
  reviewCount: number;
};

export type UserReviewRecord = {
  rating: number;
  anonymous: boolean;
  body: string | null;
};

export type PublicReviewRecord = {
  id: string;
  itemSlug: string;
  rating: number;
  anonymous: boolean;
  body: string;
  createdAt: string;
  authorName: string;
  authorImage: string | null;
};

export function emptyReviewSummary(): ReviewSummary {
  return {
    averageRating: null,
    reviewCount: 0,
  };
}

export function getAggregateRatingJsonLd(
  summary: ReviewSummary,
): AggregateRating | undefined {
  if (summary.reviewCount === 0 || summary.averageRating === null) {
    return undefined;
  }

  return {
    "@type": "AggregateRating",
    ratingValue: summary.averageRating,
    ratingCount: summary.reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

export function getReviewJsonLd(
  reviews: PublicReviewRecord[],
): SchemaReview[] | undefined {
  if (reviews.length === 0) {
    return undefined;
  }

  return reviews.map((entry) => ({
    "@type": "Review",
    author: {
      "@type": "Person",
      name: entry.authorName,
    },
    datePublished: entry.createdAt.slice(0, 10),
    reviewBody: entry.body,
    reviewRating: {
      "@type": "Rating",
      ratingValue: entry.rating,
      bestRating: 5,
      worstRating: 1,
    },
  }));
}

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
      anonymous: review.anonymous,
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
        anonymous: row.anonymous,
        body: row.body,
      },
    ]),
  );
}

export async function getWrittenReviews(
  itemType: ItemType,
  slug: string,
  limit = 8,
): Promise<PublicReviewRecord[]> {
  const rows = await db
    .select({
      id: review.id,
      itemSlug: review.itemSlug,
      rating: review.rating,
      anonymous: review.anonymous,
      body: review.body,
      createdAt: review.createdAt,
      userName: user.name,
      username: user.username,
      displayUsername: user.displayUsername,
      userImage: user.image,
    })
    .from(review)
    .leftJoin(user, eq(review.userId, user.id))
    .where(
      and(
        eq(review.itemType, itemType),
        eq(review.itemSlug, slug),
        isNotNull(review.body),
      ),
    )
    .orderBy(desc(review.createdAt))
    .limit(limit * 2);

  const writtenReviews: PublicReviewRecord[] = [];

  for (const row of rows) {
    const body = row.body?.trim();
    if (!body) continue;

    const authorName = row.anonymous
      ? "Anonymous"
      : row.displayUsername ?? row.username ?? row.userName ?? "User";

    writtenReviews.push({
      id: row.id,
      itemSlug: row.itemSlug,
      rating: row.rating,
      anonymous: row.anonymous,
      body,
      createdAt: row.createdAt.toISOString(),
      authorName,
      authorImage: row.anonymous ? null : row.userImage,
    });

    if (writtenReviews.length === limit) {
      break;
    }
  }

  return writtenReviews;
}
