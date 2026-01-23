"use client";

import { motion } from "motion/react";
import { useEffect, useId, useState } from "react";

import { cn } from "@/lib/utils";

interface GridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string | number;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
}

interface Square {
  id: number;
  pos: [number, number];
  delay: number;
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  ...props
}: GridPatternProps) {
  const id = useId();
  const [squares, setSquares] = useState<Square[]>([]);

  useEffect(() => {
    const generated = Array.from({ length: numSquares }, (_, i) => ({
      id: i,
      pos: [
        Math.floor(Math.random() * (Math.floor(100 / width) + 1)),
        Math.floor(Math.random() * (Math.floor(100 / height) + 1)),
      ] as [number, number],
      delay: Math.random() * duration,
    }));
    setSquares(generated);
  }, [numSquares, width, height, duration]);

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [posX, posY], id: squareId, delay }) => (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: Number.POSITIVE_INFINITY,
              delay,
              repeatType: "reverse",
            }}
            key={`${posX}-${posY}-${squareId}`}
            width={width - 1}
            height={height - 1}
            x={posX * width + 1}
            y={posY * height + 1}
            fill="currentColor"
            strokeWidth="0"
          />
        ))}
      </svg>
    </svg>
  );
}
