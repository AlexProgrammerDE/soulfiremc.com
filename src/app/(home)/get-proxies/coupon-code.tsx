"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CouponCode({
  code,
  discount,
}: {
  code: string;
  discount?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-lg bg-pink-500/10 p-3">
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">
          {discount ? `Use code for ${discount}` : "Coupon code"}
        </p>
        <p className="font-mono font-semibold text-pink-600 dark:text-pink-400">
          {code}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-md p-2 hover:bg-pink-500/10 transition-colors"
        aria-label="Copy coupon code"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}
