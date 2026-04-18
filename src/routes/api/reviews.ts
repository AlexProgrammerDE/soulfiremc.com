import { and, eq } from "drizzle-orm";
import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { review } from "@/lib/db/schema";
import {
  getPaginatedWrittenReviews,
  getReviewSummaries,
  getUserReviews,
  type ItemType,
} from "@/lib/reviews";
import {
  getExpectedTurnstileHostname,
  getTurnstileRemoteIp,
  REVIEW_TURNSTILE_ACTION,
  validateTurnstileToken,
} from "@/lib/turnstile";

const VALID_TYPES = ["account", "proxy", "resource"] as const;
const REVIEWS_PAGE_SIZE = 8;

function isValidType(value: string): value is ItemType {
  return VALID_TYPES.includes(value as ItemType);
}

function normalizeBody(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return null;
  }

  return trimmed.slice(0, 2_000);
}

export const Route = createFileRoute("/api/reviews")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const itemType = url.searchParams.get("type");
        const slugsParam = url.searchParams.get("slugs");
        const includeWrittenReviews =
          url.searchParams.get("includeWrittenReviews") === "1";
        const rawReviewsPage = Number.parseInt(
          url.searchParams.get("reviewsPage") ?? "1",
          10,
        );
        const reviewsPage =
          Number.isFinite(rawReviewsPage) && rawReviewsPage > 0
            ? rawReviewsPage
            : 1;

        if (!itemType || !isValidType(itemType) || !slugsParam) {
          return Response.json({ error: "Invalid parameters" }, { status: 400 });
        }

        const slugs = slugsParam
          .split(",")
          .map((slug) => slug.trim())
          .filter(Boolean);

        if (slugs.length === 0 || slugs.length > 100) {
          return Response.json({ error: "Invalid slugs" }, { status: 400 });
        }

        const session = await auth.api.getSession({
          headers: request.headers,
        });

        let summaries: Record<string, { averageRating: number | null; reviewCount: number }> =
          {};
        let userReviews: Record<string, { rating: number; body: string | null }> =
          {};
        let writtenReviews:
          | {
              entries: Array<unknown>;
              page: number;
              pageSize: number;
              totalCount: number;
              totalPages: number;
            }
          | undefined;

        try {
          [summaries, userReviews] = await Promise.all([
            getReviewSummaries(itemType, slugs),
            session?.user ? getUserReviews(session.user.id, itemType, slugs) : {},
          ]);

          writtenReviews =
            includeWrittenReviews && slugs.length === 1
              ? await getPaginatedWrittenReviews(
                  itemType,
                  slugs[0],
                  summaries[slugs[0]]?.reviewCount ?? 0,
                  {
                    page: reviewsPage,
                    pageSize: REVIEWS_PAGE_SIZE,
                  },
                )
              : undefined;
        } catch {
          summaries = Object.fromEntries(
            slugs.map((slug) => [
              slug,
              { averageRating: null, reviewCount: 0 },
            ]),
          );
          userReviews = {};
          writtenReviews =
            includeWrittenReviews && slugs.length === 1
              ? {
                  entries: [],
                  page: reviewsPage,
                  pageSize: REVIEWS_PAGE_SIZE,
                  totalCount: 0,
                  totalPages: 0,
                }
              : undefined;
        }

        return Response.json({
          summaries,
          userReviews,
          writtenReviews,
        });
      },
      PUT: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });
        if (!session?.user) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        let body: unknown;

        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (!body || typeof body !== "object") {
          return Response.json({ error: "Invalid parameters" }, { status: 400 });
        }

        const {
          itemType,
          itemSlug,
          rating,
          anonymous,
          body: reviewBody,
          turnstileToken,
        } = body as Record<string, unknown>;

        if (
          typeof itemType !== "string" ||
          !isValidType(itemType) ||
          typeof itemSlug !== "string" ||
          !itemSlug ||
          typeof rating !== "number" ||
          !Number.isInteger(rating) ||
          rating < 1 ||
          rating > 5
        ) {
          return Response.json({ error: "Invalid parameters" }, { status: 400 });
        }

        const normalizedBody = normalizeBody(reviewBody);
        const _isAnonymous = typeof anonymous === "boolean" ? anonymous : true;

        const existing = await db
          .select({ id: review.id })
          .from(review)
          .where(
            and(
              eq(review.userId, session.user.id),
              eq(review.itemType, itemType),
              eq(review.itemSlug, itemSlug),
            ),
          )
          .limit(1);

        if (existing.length === 0) {
          const url = new URL(request.url);
          const turnstileValidation = await validateTurnstileToken({
            token: typeof turnstileToken === "string" ? turnstileToken : "",
            remoteIp: getTurnstileRemoteIp(request.headers),
            expectedAction: REVIEW_TURNSTILE_ACTION,
            expectedHostname: getExpectedTurnstileHostname(url.hostname),
          });

          if (!turnstileValidation.success) {
            return Response.json(
              {
                error: "Turnstile verification failed",
                errorCodes: turnstileValidation.errorCodes,
              },
              { status: 403 },
            );
          }

          await db.insert(review).values({
            body: normalizedBody,
            itemSlug,
            itemType,
            rating,
            userId: session.user.id,
          });
        } else {
          await db
            .update(review)
            .set({
              rating,
              body: normalizedBody,
            })
            .where(eq(review.id, existing[0].id));
        }

        return Response.json({ ok: true });
      },
      DELETE: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });
        if (!session?.user) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        let body: unknown;

        try {
          body = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON body" }, { status: 400 });
        }

        if (!body || typeof body !== "object") {
          return Response.json({ error: "Invalid parameters" }, { status: 400 });
        }

        const { itemType, itemSlug } = body as Record<string, unknown>;

        if (
          typeof itemType !== "string" ||
          !isValidType(itemType) ||
          typeof itemSlug !== "string" ||
          !itemSlug
        ) {
          return Response.json({ error: "Invalid parameters" }, { status: 400 });
        }

        await db
          .delete(review)
          .where(
            and(
              eq(review.userId, session.user.id),
              eq(review.itemType, itemType),
              eq(review.itemSlug, itemSlug),
            ),
          );

        return Response.json({ ok: true });
      },
    },
  },
});
