import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const state = crypto.randomUUID();

  const cookieStore = await cookies();
  cookieStore.set("discord_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 300, // 5 minutes
    path: "/",
  });

  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID ?? "",
    redirect_uri: "https://soulfiremc.com/api/discord/linked-role/callback",
    response_type: "code",
    scope: "identify role_connections.write",
    state,
  });

  return NextResponse.redirect(
    `https://discord.com/oauth2/authorize?${params}`,
  );
}
