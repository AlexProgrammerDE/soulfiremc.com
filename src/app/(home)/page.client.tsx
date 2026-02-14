"use client";

import { TerminalIcon, Workflow } from "lucide-react";
import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import {
  type ReactElement,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

const GrainGradient = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.GrainGradient),
  { ssr: false },
);

const Dithering = dynamic(
  () => import("@paper-design/shaders-react").then((mod) => mod.Dithering),
  { ssr: false },
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

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden rounded-2xl">
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
    </div>
  );
}

export function TerminalAnimation() {
  const tickTime = 100;

  // Animation timeline
  const commands = [
    {
      type: "command",
      text: "java -jar SoulFireCLI.jar --address mc.server.com --amount 100 --start",
    },
    { type: "output", text: "◇ Connecting to mc.server.com:25565" },
    { type: "output", text: "│ Connected!" },
    { type: "output", text: "◇ Starting 100 bots..." },
    { type: "output", text: "│ Bot_1 joined the server" },
    { type: "output", text: "│ Bot_2 joined the server" },
    { type: "output", text: "│ ..." },
    { type: "output", text: "│ Bot_100 joined the server" },
    { type: "prompt", text: "" },
    { type: "command", text: "online" },
    { type: "output", text: "│ 100 bots connected" },
    { type: "prompt", text: "" },
    { type: "command", text: "move 578 65 100" },
    { type: "output", text: "◆ Moving all bots to coordinates..." },
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev >= totalTicks ? 0 : prev + 1));
    }, tickTime);

    return () => clearInterval(timer);
  }, [totalTicks]);

  // Build visible lines based on current tick
  const lines: ReactElement[] = [];
  let currentTick = 0;

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
          </span>,
        );
      }

      currentTick = typingEndTick + 3;
    } else if (item.type === "output") {
      if (tick >= currentTick) {
        lines.push(
          <span
            key={`out-${i}`}
            className={cn(
              "text-muted-foreground",
              item.text.startsWith("◆") && "text-cyan-400 font-medium",
              item.text.startsWith("◇") && "text-blue-400",
            )}
          >
            {item.text}
          </span>,
        );
      }
      currentTick += 2;
    } else if (item.type === "prompt") {
      currentTick += 5;
    }
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
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
        <div className="h-[320px] p-4 font-mono text-xs sm:text-sm">
          <code className="grid gap-1">{lines}</code>
        </div>
      </pre>
    </div>
  );
}

const scriptNodes = [
  {
    id: "trigger",
    label: "On Chat",
    sub: "Message received",
    color: "#f97316",
    x: 15,
    y: 50,
    w: 140,
    h: 48,
  },
  {
    id: "contains",
    label: "Contains?",
    sub: '"hello"',
    color: "#3b82f6",
    x: 200,
    y: 50,
    w: 140,
    h: 48,
  },
  {
    id: "branch",
    label: "Branch",
    sub: "if / else",
    color: "#8b5cf6",
    x: 385,
    y: 50,
    w: 105,
    h: 48,
  },
  {
    id: "sendChat",
    label: "Send Chat",
    sub: '"Welcome!"',
    color: "#22c55e",
    x: 555,
    y: 20,
    w: 148,
    h: 48,
  },
  {
    id: "aiChat",
    label: "AI Reply",
    sub: "LLM Chat",
    color: "#06b6d4",
    x: 448,
    y: 162,
    w: 130,
    h: 48,
  },
  {
    id: "sendReply",
    label: "Send Reply",
    sub: "to player",
    color: "#22c55e",
    x: 620,
    y: 162,
    w: 120,
    h: 48,
  },
];

const scriptEdges = [
  { d: "M155,74 L200,74" },
  { d: "M340,74 L385,74" },
  {
    d: "M490,62 C525,62 535,44 555,44",
    label: "true",
    lx: 518,
    ly: 37,
  },
  {
    d: "M490,86 C490,130 448,148 448,162",
    label: "false",
    lx: 496,
    ly: 118,
  },
  { d: "M578,186 L620,186" },
];

const scriptPhases = [
  // Path A: true path
  { nodes: ["trigger"], ticks: 8 },
  { nodes: ["contains"], ticks: 8 },
  { nodes: ["branch"], ticks: 8 },
  { nodes: ["sendChat"], ticks: 8 },
  { nodes: [], ticks: 12 },
  // Path B: false path (AI)
  { nodes: ["trigger"], ticks: 8 },
  { nodes: ["contains"], ticks: 8 },
  { nodes: ["branch"], ticks: 8 },
  { nodes: ["aiChat"], ticks: 8 },
  { nodes: ["sendReply"], ticks: 8 },
  { nodes: [], ticks: 12 },
];

const scriptTotalTicks = scriptPhases.reduce((sum, p) => sum + p.ticks, 0);

const scriptLogs = [
  {
    phase: 0,
    text: '\u25B6 On Chat - Bot_1 received "hello world"',
    color: "text-orange-400",
  },
  {
    phase: 1,
    text: '\u2713 Contains? - "hello" found',
    color: "text-blue-400",
  },
  {
    phase: 2,
    text: "\u21B3 Branch - true",
    color: "text-purple-400",
  },
  {
    phase: 3,
    text: '\u2713 Send Chat - "Welcome!" sent',
    color: "text-green-400",
  },
  {
    phase: 5,
    text: '\u25B6 On Chat - Bot_3 received "how are you?"',
    color: "text-orange-400",
  },
  {
    phase: 6,
    text: "\u2713 Contains? - no match",
    color: "text-blue-400",
  },
  {
    phase: 7,
    text: "\u21B3 Branch - false",
    color: "text-purple-400",
  },
  {
    phase: 8,
    text: "\u2713 AI Reply - generating response\u2026",
    color: "text-cyan-400",
  },
  {
    phase: 9,
    text: "\u2713 Send Reply - \"I'm doing great!\" sent",
    color: "text-green-400",
  },
];

export function ScriptingAnimation() {
  const tickTime = 120;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % scriptTotalTicks);
    }, tickTime);
    return () => clearInterval(timer);
  }, []);

  // Determine current phase index
  let phaseIndex = 0;
  let remaining = tick;
  for (let i = 0; i < scriptPhases.length; i++) {
    if (remaining < scriptPhases[i].ticks) {
      phaseIndex = i;
      break;
    }
    remaining -= scriptPhases[i].ticks;
  }

  const activeNodeIds = new Set(scriptPhases[phaseIndex].nodes);
  const isPathB = phaseIndex >= 5;

  // Compute visible log lines
  const visibleLogs = scriptLogs.filter((log) => {
    if (isPathB) return log.phase >= 5 && log.phase <= phaseIndex;
    return log.phase < 5 && log.phase <= phaseIndex;
  });

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-xl border shadow-lg bg-card">
        {/* Header bar */}
        <div className="flex flex-row items-center gap-2 border-b px-4 py-2 bg-muted/50">
          <Workflow className="size-4" />
          <span className="font-medium text-sm">SoulFire Script Editor</span>
          <span className="text-xs text-muted-foreground ml-1 hidden sm:inline">
            auto_reply.sf
          </span>
          <div className="grow" />
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 text-green-500 text-xs font-medium">
            <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
            Running
          </div>
          <div className="flex gap-1.5 ml-2">
            <div className="size-3 rounded-full bg-red-500/80" />
            <div className="size-3 rounded-full bg-yellow-500/80" />
            <div className="size-3 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Node graph canvas */}
        <svg
          viewBox="0 0 760 225"
          className="w-full h-auto"
          style={{ minHeight: "180px" }}
        >
          <defs>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern
              id="canvasDots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="10"
                cy="10"
                r="0.8"
                style={{ fill: "var(--muted-foreground)" }}
                opacity="0.2"
              />
            </pattern>
          </defs>

          {/* Background dot grid */}
          <rect
            x="0"
            y="0"
            width="760"
            height="225"
            fill="url(#canvasDots)"
          />

          {/* Edges */}
          {scriptEdges.map((edge, i) => (
            <g key={`edge-${i}`}>
              <path
                d={edge.d}
                fill="none"
                style={{ stroke: "var(--muted-foreground)" }}
                strokeWidth="1.5"
                strokeOpacity="0.3"
                strokeDasharray="6 4"
                className="animate-edge-flow"
              />
              {edge.label && (
                <text
                  x={edge.lx}
                  y={edge.ly}
                  fontSize="9"
                  fontFamily="var(--font-mono)"
                  style={{ fill: "var(--muted-foreground)" }}
                  opacity="0.6"
                >
                  {edge.label}
                </text>
              )}
            </g>
          ))}

          {/* Nodes */}
          {scriptNodes.map((node) => {
            const isActive = activeNodeIds.has(node.id);
            return (
              <g key={node.id}>
                {/* Glow background when active */}
                {isActive && (
                  <rect
                    x={node.x - 4}
                    y={node.y - 4}
                    width={node.w + 8}
                    height={node.h + 8}
                    rx="12"
                    fill={node.color}
                    opacity="0.12"
                    filter="url(#nodeGlow)"
                  />
                )}

                {/* Node background */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={node.h}
                  rx="8"
                  style={{
                    fill: "var(--card)",
                    stroke: isActive ? node.color : "var(--border)",
                    strokeWidth: isActive ? 2 : 1,
                    transition: "stroke 0.3s, stroke-width 0.3s",
                  }}
                />

                {/* Category color strip */}
                <rect
                  x={node.x + 1}
                  y={node.y + 6}
                  width="3"
                  height={node.h - 12}
                  rx="1.5"
                  fill={node.color}
                />

                {/* Label */}
                <text
                  x={node.x + 13}
                  y={node.y + 21}
                  fontSize="12.5"
                  fontWeight="600"
                  style={{ fill: "var(--card-foreground)" }}
                >
                  {node.label}
                </text>

                {/* Sublabel */}
                <text
                  x={node.x + 13}
                  y={node.y + 36}
                  fontSize="10"
                  style={{ fill: "var(--muted-foreground)" }}
                >
                  {node.sub}
                </text>

                {/* Output port */}
                <circle
                  cx={node.x + node.w}
                  cy={node.y + node.h / 2}
                  r="3.5"
                  fill={node.color}
                  style={{
                    opacity: isActive ? 1 : 0.4,
                    transition: "opacity 0.3s",
                  }}
                />

                {/* Input port (not on trigger) */}
                {node.id !== "trigger" && (
                  <circle
                    cx={node.x}
                    cy={node.y + node.h / 2}
                    r="3.5"
                    fill={node.color}
                    style={{
                      opacity: isActive ? 1 : 0.4,
                      transition: "opacity 0.3s",
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Execution log panel */}
        <div className="border-t px-4 py-2 font-mono text-xs h-[88px] overflow-hidden bg-muted/30">
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1.5">
            <span className="font-semibold text-[10px] uppercase tracking-wider">
              Execution Log
            </span>
          </div>
          <div className="space-y-0.5">
            {visibleLogs.map((log) => (
              <div key={log.phase} className={cn("truncate", log.color)}>
                {log.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeFaq({
  items,
}: {
  items: { question: string; answer: React.ReactNode }[];
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, i) => (
        <AccordionItem key={item.question} value={`faq-${i}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
