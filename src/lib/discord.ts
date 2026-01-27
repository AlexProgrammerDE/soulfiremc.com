import { unstable_cache } from "next/cache";

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

async function fetchDiscordInvite(
  inviteCode: string,
): Promise<DiscordInviteResponse> {
  const token = process.env.DISCORD_BOT_TOKEN;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bot ${token}`;
  }

  const response = await fetch(
    `https://discord.com/api/v10/invites/${inviteCode}?with_counts=true`,
    {
      headers,
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch Discord invite: ${response.status}`);
  }

  return await response.json();
}

/**
 * Fetches Discord invite information including member counts.
 * Uses the Discord REST API with bot authentication for better rate limits.
 * Results are cached for 5 minutes using Next.js cache.
 */
export async function getDiscordInvite(
  inviteCode: string,
): Promise<DiscordInviteResponse> {
  const cachedFetch = unstable_cache(
    () => fetchDiscordInvite(inviteCode),
    [`discord-invite-${inviteCode}`],
    { revalidate: 300 },
  );
  return cachedFetch();
}

/**
 * Extracts the invite code from a Discord invite URL.
 * Supports formats: discord.gg/CODE, discord.com/invite/CODE
 */
export function extractInviteCode(url: string): string {
  const match = url.match(/(?:discord\.gg|discord\.com\/invite)\/([a-zA-Z0-9]+)/);
  return match?.[1] ?? url;
}

/**
 * Fetches the SoulFire Discord server member count.
 */
export async function getSoulFireDiscordInfo(): Promise<DiscordInviteResponse> {
  const discordLink = process.env.NEXT_PUBLIC_DISCORD_LINK;
  if (!discordLink) {
    throw new Error("NEXT_PUBLIC_DISCORD_LINK is not defined");
  }

  const inviteCode = extractInviteCode(discordLink);
  return getDiscordInvite(inviteCode);
}
