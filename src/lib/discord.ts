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
    `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`,
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
