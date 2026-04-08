import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const itemType = searchParams.get("type");
  const slugsParam = searchParams.get("slugs");
  const includeWrittenReviews =
    searchParams.get("includeWrittenReviews") === "1";
  const rawReviewsPage = Number.parseInt(
    searchParams.get("reviewsPage") ?? "1",
    10,
  );
  const reviewsPage =
    Number.isFinite(rawReviewsPage) && rawReviewsPage > 0 ? rawReviewsPage : 1;

  if (!itemType || !isValidType(itemType) || !slugsParam) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const slugs = slugsParam
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean);

  if (slugs.length === 0 || slugs.length > 100) {
    return NextResponse.json({ error: "Invalid slugs" }, { status: 400 });
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const [summaries, userReviews] = await Promise.all([
    getReviewSummaries(itemType, slugs),
    session?.user ? getUserReviews(session.user.id, itemType, slugs) : {},
  ]);

  const writtenReviews =
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

  return NextResponse.json({
    summaries,
    userReviews,
    writtenReviews,
  });
}

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
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
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
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
    const turnstileValidation = await validateTurnstileToken({
      token: typeof turnstileToken === "string" ? turnstileToken : "",
      remoteIp: getTurnstileRemoteIp(request.headers),
      expectedAction: REVIEW_TURNSTILE_ACTION,
      expectedHostname: getExpectedTurnstileHostname(request.nextUrl.hostname),
    });

    if (!turnstileValidation.success) {
      return NextResponse.json(
        {
          error: "Turnstile verification failed",
          errorCodes: turnstileValidation.errorCodes,
        },
        { status: 403 },
      );
    }

    await db.insert(review).values({
      userId: session.user.id,
      itemType,
      itemSlug,
      rating,
      body: normalizedBody,
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

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const { itemType, itemSlug } = body as Record<string, unknown>;

  if (
    typeof itemType !== "string" ||
    !isValidType(itemType) ||
    typeof itemSlug !== "string" ||
    !itemSlug
  ) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
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

  return NextResponse.json({ ok: true });
}
