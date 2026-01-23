"use client";

import {
  type RefObject,
  useEffect,
  useRef,
  useState,
  Fragment,
  type ReactElement,
} from "react";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { TerminalIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
  { ssr: false }
);

const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  { ssr: false }
);

// Intersection observer for visibility detection
let observer: IntersectionObserver;
const observerTargets = new WeakMap<
  Element,
  (entry: IntersectionObserverEntry) => void
>();

function useIsVisible(ref: RefObject<HTMLElement | null>) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    observer ??= new IntersectionObserver((entries) => {
      for (const entry of entries) {
        observerTargets.get(entry.target)?.(entry);
      }
    });

    const element = ref.current;
    if (!element) return;
    observerTargets.set(element, (entry) => {
      setVisible(entry.isIntersecting);
    });
    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observerTargets.delete(element);
    };
  }, [ref]);

  return visible;
}

export function HeroBackground() {
  const { resolvedTheme } = useTheme();
  const ref = useRef<HTMLDivElement | null>(null);
  const visible = useIsVisible(ref);
  const [showShaders, setShowShaders] = useState(false);

  useEffect(() => {
    // Delay shader loading for smoother initial render
    const timer = setTimeout(() => {
      setShowShaders(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden rounded-2xl">
      {showShaders && (
        <GrainGradient
          className="absolute inset-0 animate-in fade-in duration-800"
          colors={
            resolvedTheme === "dark"
              ? ["#0ea5e9", "#0066cc", "#1a0a3e00"] // Cyan to deep blue (dark mode)
              : ["#38bdf8", "#60a5fa", "#1e40af20"] // Light blues (light mode)
          }
          colorBack="#00000000"
          softness={1}
          intensity={0.9}
          noise={0.5}
          speed={visible ? 0.8 : 0}
          shape="corners"
          minPixelRatio={1}
          maxPixelCount={1920 * 1080}
        />
      )}
      {showShaders && (
        <Dithering
          width={720}
          height={720}
          colorBack="#00000000"
          colorFront={resolvedTheme === "dark" ? "#0ea5e9" : "#3b82f6"}
          shape="sphere"
          type="4x4"
          scale={0.5}
          size={3}
          speed={0}
          frame={5000 * 120}
          className="absolute animate-in fade-in duration-400 max-lg:bottom-[-50%] max-lg:left-[-200px] lg:top-[-5%] lg:right-0"
          minPixelRatio={1}
        />
      )}
    </div>
  );
}

export function TerminalAnimation() {
  const tickTime = 100;

  // Animation timeline
  const commands = [
    { type: "command", text: "java -jar SoulFireClient.jar --address mc.server.com --amount 100" },
    { type: "output", text: "◇ Connecting to mc.server.com:25565" },
    { type: "output", text: "│ Connected!" },
    { type: "output", text: "│" },
    { type: "output", text: "◇ Starting 100 bots..." },
    { type: "output", text: "│ Bot_001 joined the server" },
    { type: "output", text: "│ Bot_002 joined the server" },
    { type: "output", text: "│ ..." },
    { type: "output", text: "│ Bot_100 joined the server" },
    { type: "prompt", text: "" },
    { type: "command", text: "online" },
    { type: "output", text: "│ 100 bots connected" },
    { type: "output", text: "│ └ mc.server.com:25565" },
    { type: "prompt", text: "" },
    { type: "command", text: "move 578 65 100" },
    { type: "output", text: "◆ Moving all bots to coordinates..." },
    { type: "prompt", text: "" },
    { type: "command", text: "attack start" },
    { type: "output", text: "◆ Attack started!" },
  ];

  // Calculate timing for each step
  const getTicksForStep = (index: number): number => {
    let ticks = 0;
    for (let i = 0; i <= index; i++) {
      const item = commands[i];
      if (item.type === "command") {
        ticks += item.text.length + 3; // typing + pause
      } else if (item.type === "output") {
        ticks += 2; // quick display
      } else if (item.type === "prompt") {
        ticks += 5; // pause before next command
      }
    }
    return ticks;
  };

  const totalTicks = getTicksForStep(commands.length - 1) + 30; // Add pause at end

  const [tick, setTick] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev >= totalTicks ? 0 : prev + 1));
    }, tickTime);

    return () => clearInterval(timer);
  }, [totalTicks]);

  // Build visible lines based on current tick
  const lines: ReactElement[] = [];
  let currentTick = 0;
  let commandIndex = 0;

  for (let i = 0; i < commands.length; i++) {
    const item = commands[i];

    if (item.type === "command") {
      const startTick = currentTick;
      const typingEndTick = startTick + item.text.length;

      if (tick >= startTick) {
        const charsToShow = Math.min(tick - startTick, item.text.length);
        const showCursor = tick < typingEndTick;

        lines.push(
          <span key={`cmd-${i}`} className="flex">
            <span className="text-emerald-400 mr-2">{">"}</span>
            <span>
              {item.text.substring(0, charsToShow)}
              {showCursor && (
                <span className="inline-block w-2 h-4 bg-white animate-pulse ml-0.5" />
              )}
            </span>
          </span>
        );
      }

      currentTick = typingEndTick + 3;
      commandIndex++;
    } else if (item.type === "output") {
      if (tick >= currentTick) {
        lines.push(
          <span
            key={`out-${i}`}
            className={cn(
              "text-muted-foreground",
              item.text.startsWith("◆") && "text-cyan-400 font-medium",
              item.text.startsWith("◇") && "text-blue-400"
            )}
          >
            {item.text}
          </span>
        );
      }
      currentTick += 2;
    } else if (item.type === "prompt") {
      currentTick += 5;
    }
  }

  return (
    <div
      className="relative w-full max-w-4xl mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <pre className="overflow-hidden rounded-xl border text-sm shadow-lg bg-card">
        <div className="flex flex-row items-center gap-2 border-b px-4 py-2 bg-muted/50">
          <TerminalIcon className="size-4" />
          <span className="font-medium">SoulFire CLI</span>
          <div className="grow" />
          <div className="flex gap-1.5">
            <div className="size-3 rounded-full bg-red-500/80" />
            <div className="size-3 rounded-full bg-yellow-500/80" />
            <div className="size-3 rounded-full bg-green-500/80" />
          </div>
        </div>
        <div className="min-h-[280px] p-4 font-mono text-xs sm:text-sm">
          <code className="grid gap-1">{lines}</code>
        </div>
      </pre>
    </div>
  );
}
