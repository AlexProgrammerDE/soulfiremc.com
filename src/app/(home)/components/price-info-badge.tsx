import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

export function PriceInfoBadge({ details }: { details: string }) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="inline-flex cursor-help items-center text-muted-foreground hover:text-foreground transition-colors">
          <Info className="h-3.5 w-3.5" />
          <span className="sr-only">Pricing details</span>
        </span>
      </HoverCardTrigger>
      <HoverCardContent className="w-64 text-sm">
        <p className="font-medium mb-1">Pricing Details</p>
        <p className="text-muted-foreground">{details}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
