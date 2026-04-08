import type { AggregateRating, Review as SchemaReview } from "schema-dts";

export type ItemType = "account" | "proxy" | "resource";

export type ReviewSummary = {
  averageRating: number | null;
  reviewCount: number;
};

export type UserReviewRecord = {
  rating: number;
  body: string | null;
};

export type PublicReviewRecord = {
  id: string;
  itemSlug: string;
  rating: number;
  body: string | null;
  createdAt: string;
  authorName: string;
  authorImage: string | null;
};

export type PaginatedPublicReviewRecords = {
  entries: PublicReviewRecord[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
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
    ...(entry.body ? { reviewBody: entry.body } : {}),
    reviewRating: {
      "@type": "Rating",
      ratingValue: entry.rating,
      bestRating: 5,
      worstRating: 1,
    },
  }));
}
