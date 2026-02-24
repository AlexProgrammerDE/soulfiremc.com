const DISCORD_API_BASE = "https://discord.com/api/v10";

export type DiscordOAuthTokens = {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
};

export type DiscordUser = {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
};

export async function exchangeDiscordCode(
  code: string,
  redirectUri: string,
): Promise<DiscordOAuthTokens> {
  const response = await fetch(`${DISCORD_API_BASE}/oauth2/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID ?? "",
      client_secret: process.env.DISCORD_CLIENT_SECRET ?? "",
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error(`Discord token exchange failed: ${response.status}`);
  }

  return response.json();
}

export async function getDiscordUser(
  accessToken: string,
): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Discord user fetch failed: ${response.status}`);
  }

  return response.json();
}

export async function pushLinkedRoleMetadata(
  accessToken: string,
  metadata: {
    platform_name: string;
    platform_username: string | null;
    metadata: Record<string, string | number | boolean>;
  },
): Promise<void> {
  const appId = process.env.DISCORD_CLIENT_ID ?? "";
  const response = await fetch(
    `${DISCORD_API_BASE}/users/@me/applications/${appId}/role-connection`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(metadata),
    },
  );

  if (!response.ok) {
    throw new Error(`Discord metadata push failed: ${response.status}`);
  }
}

export type DiscordInviteResponse = {
  code: string;
  guild?: {
    id: string;
    name: string;
    icon: string | null;
    description: string | null;
  };
  approximate_member_count?: number;
  approximate_presence_count?: number;
};

export async function fetchDiscordInvite(
  inviteCode: string,
): Promise<DiscordInviteResponse | null> {
  const token = process.env.DISCORD_BOT_TOKEN;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bot ${token}`;
  }

  const response = await fetch(
    `${DISCORD_API_BASE}/invites/${inviteCode}?with_counts=true`,
    {
      headers,
      next: {
        revalidate: 60 * 60,
      },
    },
  );

  if (!response.ok) {
    return null;
  }

  return await response.json();
}

/**
 * Extracts the invite code from a Discord invite URL.
 * Supports formats: discord.gg/CODE, discord.com/invite/CODE
 */
export function extractInviteCode(url: string): string {
  const match = url.match(
    /(?:discord\.gg|discord\.com\/invite)\/([a-zA-Z0-9]+)/,
  );
  return match?.[1] ?? url;
}
