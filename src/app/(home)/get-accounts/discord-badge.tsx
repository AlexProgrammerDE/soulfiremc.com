import { Users } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { DiscordInviteResponse } from "@/lib/discord";

function formatNumber(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  }
  return num.toString();
}

export function DiscordMemberBadge({
  info,
}: {
  info: DiscordInviteResponse | null;
}) {
  if (!info || !info.approximate_member_count) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-[#5865F2]/10 px-2.5 py-0.5 text-xs font-medium text-[#5865F2]/50">
        <Users className="h-3 w-3" />
        unknown
      </span>
    );
  }

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="inline-flex cursor-help items-center gap-1 rounded-full bg-[#5865F2]/10 px-2.5 py-0.5 text-xs font-medium text-[#5865F2]">
          <Users className="h-3 w-3" />
          {formatNumber(info.approximate_member_count)}
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-auto text-sm">
        {info.guild?.name && <p className="font-medium">{info.guild.name}</p>}
        <p>{info.approximate_member_count?.toLocaleString()} members</p>
        {info.approximate_presence_count && (
          <p className="text-green-500">
            {info.approximate_presence_count.toLocaleString()} online
          </p>
        )}
      </HoverCardContent>
    </HoverCard>
  );
}
