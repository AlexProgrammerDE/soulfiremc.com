"use client";

import { ThumbsUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  count: number;
  isUpvoted: boolean;
  loading: boolean;
  onToggle: (
    slug: string,
  ) => Promise<{ error: "unauthorized" | null } | undefined>;
};

export function UpvoteButton({
  slug,
  count,
  isUpvoted,
  loading,
  onToggle,
}: Props) {
  const router = useRouter();

  const handleClick = async () => {
    const result = await onToggle(slug);
    if (result?.error === "unauthorized") {
      toast("Sign in to upvote", {
        description: "You need to be signed in to upvote providers.",
        action: {
          label: "Sign In",
          onClick: () => router.push("/auth/sign-in"),
        },
      });
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={loading}
      className={cn(
        "gap-1.5 text-muted-foreground transition-colors",
        isUpvoted && "text-primary",
      )}
    >
      <ThumbsUp className={cn("h-4 w-4", isUpvoted && "fill-current")} />
      <span className="text-xs font-medium tabular-nums">{count}</span>
    </Button>
  );
}
