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

// ---- Editor-style scripting animation data ----

const ED_H = 26; // header height
const ED_R = 20; // port row height
const ED_P = 4; // bottom padding

type SPort = { name: string; type: "exec" | "data" };
type SRow = { left?: SPort; right?: SPort; inputValue?: string };
type SNode = {
  id: string;
  label: string;
  color: string;
  x: number;
  y: number;
  w: number;
  rows: SRow[];
};

function sHeight(n: SNode) {
  return ED_H + n.rows.length * ED_R + ED_P;
}

function sPortXY(nodeId: string, portName: string, side: "left" | "right") {
  const n = sNodes.find((n) => n.id === nodeId)!;
  const ri = n.rows.findIndex(
    (r) => r.left?.name === portName || r.right?.name === portName,
  );
  return {
    x: side === "left" ? n.x : n.x + n.w,
    y: n.y + ED_H + (ri >= 0 ? ri : 0) * ED_R + ED_R / 2,
  };
}

function sBezier(x1: number, y1: number, x2: number, y2: number) {
  const cp = x2 >= x1 ? Math.max((x2 - x1) * 0.45, 25) : 40;
  return `M${x1},${y1} C${x1 + cp},${y1} ${x2 - cp},${y2} ${x2},${y2}`;
}

const sNodes: SNode[] = [
  {
    id: "trigger",
    label: "On Chat",
    color: "#f97316",
    x: 15,
    y: 40,
    w: 148,
    rows: [
      { right: { name: "Out", type: "exec" } },
      { right: { name: "Bot", type: "data" } },
      { right: { name: "Message", type: "data" } },
    ],
  },
  {
    id: "contains",
    label: "Contains?",
    color: "#3b82f6",
    x: 215,
    y: 30,
    w: 160,
    rows: [
      {
        left: { name: "In", type: "exec" },
        right: { name: "Out", type: "exec" },
      },
      {
        left: { name: "String", type: "data" },
        right: { name: "Result", type: "data" },
      },
      { left: { name: "Search", type: "data" }, inputValue: '"hello"' },
    ],
  },
  {
    id: "branch",
    label: "Branch",
    color: "#8b5cf6",
    x: 430,
    y: 20,
    w: 120,
    rows: [
      { left: { name: "In", type: "exec" } },
      {
        left: { name: "Cond", type: "data" },
        right: { name: "True", type: "exec" },
      },
      { right: { name: "False", type: "exec" } },
    ],
  },
  {
    id: "sendChat",
    label: "Send Chat",
    color: "#22c55e",
    x: 610,
    y: 5,
    w: 160,
    rows: [
      {
        left: { name: "In", type: "exec" },
        right: { name: "Out", type: "exec" },
      },
      { left: { name: "Bot", type: "data" } },
      { left: { name: "Msg", type: "data" }, inputValue: '"Welcome!"' },
    ],
  },
  {
    id: "aiChat",
    label: "AI Reply",
    color: "#06b6d4",
    x: 530,
    y: 150,
    w: 160,
    rows: [
      {
        left: { name: "In", type: "exec" },
        right: { name: "Out", type: "exec" },
      },
      { left: { name: "Prompt", type: "data" }, inputValue: '"Be friendly"' },
      { right: { name: "Reply", type: "data" } },
    ],
  },
];

type SEdge = {
  id: string;
  from: string;
  fp: string;
  fs: "left" | "right";
  to: string;
  tp: string;
  ts: "left" | "right";
  type: "exec" | "data";
};

const sEdges: SEdge[] = [
  {
    id: "e1",
    from: "trigger",
    fp: "Out",
    fs: "right",
    to: "contains",
    tp: "In",
    ts: "left",
    type: "exec",
  },
  {
    id: "e2",
    from: "trigger",
    fp: "Message",
    fs: "right",
    to: "contains",
    tp: "String",
    ts: "left",
    type: "data",
  },
  {
    id: "e3",
    from: "contains",
    fp: "Out",
    fs: "right",
    to: "branch",
    tp: "In",
    ts: "left",
    type: "exec",
  },
  {
    id: "e4",
    from: "contains",
    fp: "Result",
    fs: "right",
    to: "branch",
    tp: "Cond",
    ts: "left",
    type: "data",
  },
  {
    id: "e5",
    from: "branch",
    fp: "True",
    fs: "right",
    to: "sendChat",
    tp: "In",
    ts: "left",
    type: "exec",
  },
  {
    id: "e6",
    from: "branch",
    fp: "False",
    fs: "right",
    to: "aiChat",
    tp: "In",
    ts: "left",
    type: "exec",
  },
];

const sEdgePaths = sEdges.map((e) => {
  const f = sPortXY(e.from, e.fp, e.fs);
  const t = sPortXY(e.to, e.tp, e.ts);
  return { ...e, d: sBezier(f.x, f.y, t.x, t.y) };
});

const sPhases = [
  { nodes: ["trigger"], edges: [] as string[], ticks: 8 },
  { nodes: ["contains"], edges: ["e1", "e2"], ticks: 8 },
  { nodes: ["branch"], edges: ["e3", "e4"], ticks: 8 },
  { nodes: ["sendChat"], edges: ["e5"], ticks: 8 },
  { nodes: [] as string[], edges: [] as string[], ticks: 12 },
  { nodes: ["trigger"], edges: [] as string[], ticks: 8 },
  { nodes: ["contains"], edges: ["e1", "e2"], ticks: 8 },
  { nodes: ["branch"], edges: ["e3", "e4"], ticks: 8 },
  { nodes: ["aiChat"], edges: ["e6"], ticks: 8 },
  { nodes: [] as string[], edges: [] as string[], ticks: 12 },
];

const sTotalTicks = sPhases.reduce((s, p) => s + p.ticks, 0);

const sLogs = [
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
    text: "\u21B3 Branch - condition: true",
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
  { phase: 6, text: "\u2713 Contains? - no match", color: "text-blue-400" },
  {
    phase: 7,
    text: "\u21B3 Branch - condition: false",
    color: "text-purple-400",
  },
  {
    phase: 8,
    text: "\u2713 AI Reply - generating response\u2026",
    color: "text-cyan-400",
  },
];

export function ScriptingAnimation() {
  const tickTime = 120;
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((prev) => (prev + 1) % sTotalTicks);
    }, tickTime);
    return () => clearInterval(timer);
  }, []);

  let phaseIndex = 0;
  let remaining = tick;
  for (let i = 0; i < sPhases.length; i++) {
    if (remaining < sPhases[i].ticks) {
      phaseIndex = i;
      break;
    }
    remaining -= sPhases[i].ticks;
  }

  const activeNodes = new Set(sPhases[phaseIndex].nodes);
  const activeEdges = new Set(sPhases[phaseIndex].edges);
  const isPathB = phaseIndex >= 5;

  const visibleLogs = sLogs.filter((log) =>
    isPathB
      ? log.phase >= 5 && log.phase <= phaseIndex
      : log.phase < 5 && log.phase <= phaseIndex,
  );

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="overflow-hidden rounded-xl shadow-lg bg-[#1a1a2e] border border-white/[0.08]">
        {/* Header bar */}
        <div className="flex flex-row items-center gap-2 px-4 py-2 bg-white/[0.03] border-b border-white/[0.06]">
          <Workflow className="size-4 text-white/60" />
          <span className="font-medium text-sm text-white/90">
            SoulFire Script Editor
          </span>
          <span className="text-xs text-white/40 ml-1 hidden sm:inline">
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

        {/* Node graph canvas - always dark like real editor */}
        <svg
          viewBox="0 0 790 250"
          className="w-full h-auto"
          style={{ minHeight: "180px", background: "#1e1e2e" }}
        >
          <defs>
            <filter id="sf-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <pattern
              id="sf-dots"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="10" cy="10" r="0.6" fill="#fff" opacity="0.06" />
            </pattern>
          </defs>

          <rect width="790" height="250" fill="url(#sf-dots)" />

          {/* Edges (bezier curves) */}
          {sEdgePaths.map((e) => {
            const active = activeEdges.has(e.id);
            return (
              <path
                key={e.id}
                d={e.d}
                fill="none"
                stroke={
                  active
                    ? e.type === "exec"
                      ? "#d0d0d0"
                      : "#fbbf24"
                    : e.type === "exec"
                      ? "#555"
                      : "#92400e"
                }
                strokeWidth={active ? 2.5 : 1.5}
                opacity={active ? 1 : 0.5}
                style={{
                  transition: "stroke 0.25s, stroke-width 0.25s, opacity 0.25s",
                }}
              />
            );
          })}

          {/* Nodes */}
          {sNodes.map((node) => {
            const h = sHeight(node);
            const active = activeNodes.has(node.id);
            return (
              <g key={node.id}>
                {/* Glow */}
                {active && (
                  <rect
                    x={node.x - 3}
                    y={node.y - 3}
                    width={node.w + 6}
                    height={h + 6}
                    rx="9"
                    fill={node.color}
                    opacity="0.12"
                    filter="url(#sf-glow)"
                  />
                )}

                {/* Node body */}
                <rect
                  x={node.x}
                  y={node.y}
                  width={node.w}
                  height={h}
                  rx="6"
                  fill="#2a2a3a"
                  stroke={active ? node.color : "#3a3a4a"}
                  strokeWidth={active ? 1.5 : 0.5}
                  style={{ transition: "stroke 0.25s" }}
                />

                {/* Header accent bar */}
                <rect
                  x={node.x + 0.5}
                  y={node.y + 5}
                  width="2.5"
                  height={ED_H - 10}
                  rx="1.5"
                  fill={node.color}
                  opacity="0.8"
                />

                {/* Chevron */}
                <path
                  d={`M${node.x + 11},${node.y + ED_H / 2 - 3} L${node.x + 15},${node.y + ED_H / 2} L${node.x + 11},${node.y + ED_H / 2 + 3}`}
                  fill="none"
                  stroke="#777"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Node name */}
                <text
                  x={node.x + 22}
                  y={node.y + ED_H / 2 + 4}
                  fontSize="11.5"
                  fontWeight="600"
                  fill="#e0e0e0"
                >
                  {node.label}
                </text>

                {/* Divider line */}
                <line
                  x1={node.x + 1}
                  y1={node.y + ED_H}
                  x2={node.x + node.w - 1}
                  y2={node.y + ED_H}
                  stroke="#3a3a4a"
                  strokeWidth="0.5"
                />

                {/* Port rows */}
                {node.rows.map((row, ri) => {
                  const cy = node.y + ED_H + ri * ED_R + ED_R / 2;
                  return (
                    <g key={ri}>
                      {/* Left port */}
                      {row.left && (
                        <>
                          {row.left.type === "exec" ? (
                            <rect
                              x={node.x - 3}
                              y={cy - 3}
                              width={6}
                              height={6}
                              rx="1"
                              fill={active ? "#e0e0e0" : "#777"}
                              style={{ transition: "fill 0.25s" }}
                            />
                          ) : (
                            <circle
                              cx={node.x}
                              cy={cy}
                              r="3.5"
                              fill={active ? "#fbbf24" : "#d97706"}
                              style={{ transition: "fill 0.25s" }}
                            />
                          )}
                          <text
                            x={node.x + 9}
                            y={cy + 3.5}
                            fontSize="9"
                            fill="#999"
                          >
                            {row.left.name}
                          </text>
                        </>
                      )}

                      {/* Right port */}
                      {row.right && (
                        <>
                          <text
                            x={node.x + node.w - 9}
                            y={cy + 3.5}
                            fontSize="9"
                            fill="#999"
                            textAnchor="end"
                          >
                            {row.right.name}
                          </text>
                          {row.right.type === "exec" ? (
                            <rect
                              x={node.x + node.w - 3}
                              y={cy - 3}
                              width={6}
                              height={6}
                              rx="1"
                              fill={active ? "#e0e0e0" : "#777"}
                              style={{ transition: "fill 0.25s" }}
                            />
                          ) : (
                            <circle
                              cx={node.x + node.w}
                              cy={cy}
                              r="3.5"
                              fill={active ? "#fbbf24" : "#d97706"}
                              style={{ transition: "fill 0.25s" }}
                            />
                          )}
                        </>
                      )}

                      {/* Input field */}
                      {row.inputValue != null &&
                        (() => {
                          const lw = row.left
                            ? row.left.name.length * 6 + 14
                            : 6;
                          const rp = row.right ? 35 : 8;
                          const fx = node.x + lw;
                          const fw = node.w - lw - rp;
                          return (
                            <>
                              <rect
                                x={fx}
                                y={cy - 7}
                                width={fw}
                                height={14}
                                rx="2"
                                fill="#1e1e2e"
                                stroke="#3a3a4a"
                                strokeWidth="0.5"
                              />
                              <text
                                x={fx + 4}
                                y={cy + 3}
                                fontSize="8.5"
                                fontFamily="monospace"
                                fill="#e0c070"
                              >
                                {row.inputValue}
                              </text>
                            </>
                          );
                        })()}
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* Execution log panel */}
        <div className="px-4 py-2 font-mono text-xs h-[104px] overflow-hidden bg-[#222232] border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-white/40">
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
