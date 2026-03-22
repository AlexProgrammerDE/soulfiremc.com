import { and, eq, inArray, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { upvote } from "@/lib/db/schema";
import {
  getExpectedTurnstileHostname,
  getTurnstileRemoteIp,
  UPVOTE_TURNSTILE_ACTION,
  validateTurnstileToken,
} from "@/lib/turnstile";

const VALID_TYPES = ["account", "proxy", "resource"] as const;
type ItemType = (typeof VALID_TYPES)[number];

function isValidType(value: string): value is ItemType {
  return VALID_TYPES.includes(value as ItemType);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const itemType = searchParams.get("type");
  const slugsParam = searchParams.get("slugs");

  if (!itemType || !isValidType(itemType) || !slugsParam) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const slugs = slugsParam.split(",").filter(Boolean);
  if (slugs.length === 0 || slugs.length > 100) {
    return NextResponse.json({ error: "Invalid slugs" }, { status: 400 });
  }

  const counts = await db
    .select({
      itemSlug: upvote.itemSlug,
      count: sql<number>`count(*)::int`,
    })
    .from(upvote)
    .where(and(eq(upvote.itemType, itemType), inArray(upvote.itemSlug, slugs)))
    .groupBy(upvote.itemSlug);

  let userUpvotes: string[] = [];
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });
    if (session?.user) {
      const userVotes = await db
        .select({ itemSlug: upvote.itemSlug })
        .from(upvote)
        .where(
          and(
            eq(upvote.userId, session.user.id),
            eq(upvote.itemType, itemType),
            inArray(upvote.itemSlug, slugs),
          ),
        );
      userUpvotes = userVotes.map((v) => v.itemSlug);
    }
  } catch {
    // Not authenticated
  }

  const countMap: Record<string, number> = {};
  for (const slug of slugs) {
    countMap[slug] = counts.find((c) => c.itemSlug === slug)?.count ?? 0;
  }

  return NextResponse.json({ counts: countMap, userUpvotes });
}

export async function POST(request: NextRequest) {
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

  const { itemType, itemSlug, turnstileToken } = body as Record<
    string,
    unknown
  >;

  if (
    typeof itemType !== "string" ||
    !isValidType(itemType) ||
    typeof itemSlug !== "string" ||
    !itemSlug
  ) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(upvote)
    .where(
      and(
        eq(upvote.userId, session.user.id),
        eq(upvote.itemType, itemType),
        eq(upvote.itemSlug, itemSlug),
      ),
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(upvote)
      .where(
        and(
          eq(upvote.userId, session.user.id),
          eq(upvote.itemType, itemType),
          eq(upvote.itemSlug, itemSlug),
        ),
      );
    return NextResponse.json({ upvoted: false });
  }

  const turnstileValidation = await validateTurnstileToken({
    token: typeof turnstileToken === "string" ? turnstileToken : "",
    remoteIp: getTurnstileRemoteIp(request.headers),
    expectedAction: UPVOTE_TURNSTILE_ACTION,
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

  await db.insert(upvote).values({
    userId: session.user.id,
    itemType,
    itemSlug,
  });
  return NextResponse.json({ upvoted: true });
}
