"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

function sizeClass(size: Size) {
  switch (size) {
    case "lg":
      return "h-5 w-5";
    case "md":
      return "h-4.5 w-4.5";
    default:
      return "h-4 w-4";
  }
}

export function ReviewStars({
  value,
  size = "sm",
  className,
}: {
  value: number;
  size?: Size;
  className?: string;
}) {
  const width = `${Math.max(0, Math.min(5, value)) * 20}%`;

  return (
    <div
      className={cn("relative inline-flex items-center", className)}
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      <div className="flex text-amber-200/70">
        {Array.from({ length: 5 }, (_, index) => (
          <Star key={index} className={sizeClass(size)} />
        ))}
      </div>
      <div
        className="absolute inset-0 overflow-hidden text-amber-500"
        style={{ width }}
      >
        <div className="flex">
          {Array.from({ length: 5 }, (_, index) => (
            <Star key={index} className={cn(sizeClass(size), "fill-current")} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReviewStarInput({
  value,
  onChange,
  disabled,
  size = "sm",
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: Size;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const active = starValue <= value;

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            disabled={disabled}
            className={cn(
              "rounded-sm text-amber-500 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50",
              !active && "text-amber-200/70",
            )}
            aria-label={`Set rating to ${starValue} star${starValue === 1 ? "" : "s"}`}
            aria-pressed={value === starValue}
          >
            <Star className={cn(sizeClass(size), active && "fill-current")} />
          </button>
        );
      })}
    </div>
  );
}
