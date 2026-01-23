"use client";

import type { ComponentPropsWithoutRef, CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children?: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  duration?: number;
  gap?: number;
}

export function Marquee({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  duration = 40,
  gap = 16,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden",
        vertical ? "flex-col" : "flex-row",
        className,
      )}
      style={{ "--marquee-gap": `${gap}px`, gap: `${gap}px` } as CSSProperties}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0",
              vertical ? "flex-col" : "flex-row",
              pauseOnHover && "group-hover:[animation-play-state:paused]",
            )}
            style={
              {
                gap: `${gap}px`,
                animation: `${vertical ? "marquee-vertical" : "marquee"} ${duration}s linear infinite`,
                animationDirection: reverse ? "reverse" : "normal",
              } as CSSProperties
            }
          >
            {children}
          </div>
        ))}
    </div>
  );
}
