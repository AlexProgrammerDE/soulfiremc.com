"use client";

import { CircuitBoard, Cpu, Download } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DownloadLinkMap } from "./download-data";

const OS_OPTIONS = [
  {
    id: "windows",
    label: "Windows",
    detail: "Windows 10 or newer",
    icon: (
      <Image
        src="/platform/windows.png"
        alt="Windows"
        width={28}
        height={28}
        className="size-7"
      />
    ),
  },
  {
    id: "macos",
    label: "macOS",
    detail: "Apple Silicon & Intel",
    icon: (
      <Image
        src="/platform/macos.png"
        alt="macOS"
        width={28}
        height={28}
        className="size-7"
      />
    ),
  },
  {
    id: "linux",
    label: "Linux",
    detail: "Most distros supported",
    icon: (
      <Image
        src="/platform/linux.png"
        alt="Linux"
        width={28}
        height={28}
        className="size-7"
      />
    ),
  },
];

const CPU_OPTIONS = [
  {
    id: "x64",
    label: "x86_64 / AMD64",
    detail: "Intel or AMD processors",
    icon: <Cpu className="h-5 w-5 text-primary" />,
  },
  {
    id: "arm64",
    label: "AArch64 / ARM64",
    detail: "Apple Silicon or ARM servers",
    icon: <CircuitBoard className="h-5 w-5 text-primary" />,
  },
];

export function DownloadConfigurator(props: { links: DownloadLinkMap }) {
  const [selectedOs, setSelectedOs] = useState(
    () => OS_OPTIONS[0]?.id ?? "windows",
  );
  const [selectedCpu, setSelectedCpu] = useState(
    () => CPU_OPTIONS[0]?.id ?? "x64",
  );

  const osLabel = useMemo(
    () => OS_OPTIONS.find((option) => option.id === selectedOs)?.label ?? "",
    [selectedOs],
  );
  const cpuLabel = useMemo(
    () => CPU_OPTIONS.find((option) => option.id === selectedCpu)?.label ?? "",
    [selectedCpu],
  );

  const downloadHref = props.links[selectedOs]?.[selectedCpu];

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Choose your build</CardTitle>
        <CardDescription>
          SoulFire is multi-platform. Tell us what you are running and we will
          point you to the best download.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Operating system
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {OS_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOs(option.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition hover:border-primary/60",
                  selectedOs === option.id
                    ? "border-primary bg-primary/10"
                    : "bg-background",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    {option.icon}
                  </div>
                  <div>
                    <div className="text-base font-semibold">
                      {option.label}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {option.detail}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            CPU architecture
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {CPU_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedCpu(option.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition hover:border-primary/60",
                  selectedCpu === option.id
                    ? "border-primary bg-primary/10"
                    : "bg-background",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    {option.icon}
                  </div>
                  <div>
                    <div className="text-base font-semibold">
                      {option.label}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {option.detail}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <Button
          size="lg"
          className="w-full gap-2"
          asChild
          disabled={!downloadHref}
        >
          {downloadHref ? (
            <a href={downloadHref} target="_blank" rel="noopener noreferrer">
              <Download className="h-5 w-5" />
              Download for {osLabel} · {cpuLabel}
            </a>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Coming soon for {osLabel} · {cpuLabel}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
