import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { account, user } from "@/lib/db/auth-schema";
import {
  exchangeDiscordCode,
  getDiscordUser,
  pushLinkedRoleMetadata,
} from "@/lib/discord";

const REDIRECT_URI = "https://soulfiremc.com/api/discord/linked-role/callback";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.json(
      { error: "Missing code or state" },
      { status: 400 },
    );
  }

  // Validate state against cookie
  const cookieStore = await cookies();
  const storedState = cookieStore.get("discord_oauth_state")?.value;
  cookieStore.delete("discord_oauth_state");

  if (state !== storedState) {
    return NextResponse.json({ error: "Invalid state" }, { status: 403 });
  }

  // Exchange code for tokens
  const tokens = await exchangeDiscordCode(code, REDIRECT_URI);

  // Get Discord user identity
  const discordUser = await getDiscordUser(tokens.access_token);

  // Look up SoulFire account by Discord ID
  const sfAccount = await db
    .select({
      userId: account.userId,
      userName: user.name,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
    })
    .from(account)
    .innerJoin(user, eq(account.userId, user.id))
    .where(
      and(
        eq(account.providerId, "discord"),
        eq(account.accountId, discordUser.id),
      ),
    )
    .limit(1);

  const sfUser = sfAccount[0];

  if (sfUser) {
    // User has a SoulFire account linked to Discord
    await pushLinkedRoleMetadata(tokens.access_token, {
      platform_name: "SoulFire",
      platform_username: sfUser.userName,
      metadata: {
        verified_account: 1,
        email_verified: sfUser.emailVerified ? 1 : 0,
        account_created: sfUser.createdAt.toISOString(),
      },
    });
  } else {
    // No SoulFire account found for this Discord user
    await pushLinkedRoleMetadata(tokens.access_token, {
      platform_name: "SoulFire",
      platform_username: null,
      metadata: {
        verified_account: 0,
        email_verified: 0,
        account_created: new Date().toISOString(),
      },
    });
  }

  // Redirect back to Discord
  return NextResponse.redirect("https://discord.com/");
}
