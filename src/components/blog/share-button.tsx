"use client";

import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  description?: string;
  url: string;
}

export function ShareButton({ title, description, url }: ShareButtonProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Share this post"
    >
      <Share2 className="w-4 h-4" />
      Share
    </button>
  );
}
