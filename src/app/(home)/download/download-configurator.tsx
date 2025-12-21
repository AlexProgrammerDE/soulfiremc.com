"use client";

import { CircuitBoard, Cpu, Download } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClientDownloads, type DownloadLinkMap } from "./download-data";
import {
  CPU_OPTIONS,
  type CpuOption,
  DEFAULT_CPU,
  DEFAULT_OS,
  OS_OPTIONS,
  type OsOption,
  PREFERRED_CPU_BY_OS,
} from "./options";
import {
  type DownloadSelection,
  downloadSearchParams,
  loadDownloadSearchParams,
} from "./search-params";

function detectBrowserOS(): OsOption["id"] | null {
  if (typeof window === "undefined") return null;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() ?? "";

  // Check for Windows
  if (userAgent.includes("win") || platform.includes("win")) {
    return "windows";
  }

  // Check for macOS
  if (
    userAgent.includes("mac") ||
    platform.includes("mac") ||
    platform.includes("iphone") ||
    platform.includes("ipad")
  ) {
    return "macos";
  }

  // Check for Linux (including Android which is Linux-based, but we'll treat as Linux)
  if (
    userAgent.includes("linux") ||
    userAgent.includes("x11") ||
    platform.includes("linux")
  ) {
    return "linux";
  }

  return null;
}

function detectBrowserCPU(): CpuOption["id"] | null {
  if (typeof window === "undefined") return null;

  const userAgent = window.navigator.userAgent.toLowerCase();
  const platform = window.navigator.platform?.toLowerCase() ?? "";

  // Check for ARM architecture
  // Common indicators: aarch64, arm64, arm in platform/userAgent
  if (
    platform.includes("aarch64") ||
    platform.includes("arm64") ||
    platform.includes("arm") ||
    userAgent.includes("aarch64") ||
    userAgent.includes("arm64")
  ) {
    return "arm64";
  }

  // Check for x86_64/AMD64 architecture
  // Common indicators: x86_64, x64, amd64, win64, wow64 (Windows 64-bit), x86_64 in platform
  if (
    platform.includes("x86_64") ||
    platform.includes("x64") ||
    platform.includes("amd64") ||
    platform.includes("win64") ||
    userAgent.includes("x86_64") ||
    userAgent.includes("x64") ||
    userAgent.includes("amd64") ||
    userAgent.includes("win64") ||
    userAgent.includes("wow64")
  ) {
    return "x64";
  }

  // For macOS, we can use navigator.userAgentData if available (Chromium browsers)
  // to detect Apple Silicon vs Intel
  const userAgentData = (navigator as NavigatorWithUAData).userAgentData;
  if (userAgentData?.getHighEntropyValues) {
    // This is async, so we can't use it directly here
    // But we can check platform hints synchronously if available
    if (userAgentData.platform === "macOS") {
      // On macOS, if we can't detect ARM, assume Apple Silicon for newer browsers
      // since most new Macs are ARM-based
      // However, this is a heuristic and may not be accurate
    }
  }

  // Default: return null to use OS-based preference
  return null;
}

interface NavigatorWithUAData extends Navigator {
  userAgentData?: {
    platform?: string;
    getHighEntropyValues?: (
      hints: string[],
    ) => Promise<{ architecture?: string }>;
  };
}

export function DownloadSelectionComponent({
  clientVersion,
}: {
  clientVersion: string;
}) {
  const searchParams = useSearchParams();
  const selection = loadDownloadSearchParams(searchParams);
  const clientDownloads = createClientDownloads(clientVersion);

  // Check if the user explicitly set search params
  const hasExplicitParams = searchParams.has("os") || searchParams.has("cpu");

  return (
    <>
      <DownloadConfigurator
        links={clientDownloads}
        initialSelection={selection}
        hasExplicitParams={hasExplicitParams}
      />
      <DownloadTip selection={selection} />
    </>
  );
}

function DownloadConfigurator(props: {
  links: DownloadLinkMap;
  initialSelection: DownloadSelection;
  hasExplicitParams: boolean;
}) {
  const [{ os, cpu }, setSelection] = useQueryStates(downloadSearchParams, {
    history: "replace",
    shallow: false,
  });
  const [isHydrated, setIsHydrated] = useState(false);
  const [hasAppliedOsDetection, setHasAppliedOsDetection] = useState(false);

  // Apply OS and CPU detection on initial hydration if no explicit params were provided
  useEffect(() => {
    if (!hasAppliedOsDetection && !props.hasExplicitParams) {
      const detectedOs = detectBrowserOS();
      const detectedCpu = detectBrowserCPU();

      if (detectedOs) {
        setSelection({
          os: detectedOs,
          // Use detected CPU if available, otherwise fall back to OS preference
          cpu: detectedCpu ?? PREFERRED_CPU_BY_OS[detectedOs],
        });
      } else if (detectedCpu) {
        // If we only detected CPU but not OS, just update CPU
        setSelection((prev) => ({
          ...prev,
          cpu: detectedCpu,
        }));
      }
      setHasAppliedOsDetection(true);
    }
    setIsHydrated(true);
  }, [hasAppliedOsDetection, props.hasExplicitParams, setSelection]);

  const selection = isHydrated ? { os, cpu } : props.initialSelection;

  const downloadHref = props.links[selection.os]?.[selection.cpu];
  const isDirectGithubDownload = downloadHref?.includes("github.com") ?? false;

  const handleOsChange = (value: typeof selection.os) => {
    setSelection((prev) => ({
      ...prev,
      os: value,
      cpu: PREFERRED_CPU_BY_OS[value],
    }));
  };

  const handleCpuChange = (value: typeof selection.cpu) => {
    setSelection((prev) => ({
      ...prev,
      cpu: value,
    }));
  };

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
                onClick={() => handleOsChange(option.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition hover:border-primary/60",
                  selection.os === option.id
                    ? "border-primary bg-primary/10"
                    : "bg-background",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    <Image
                      src={option.iconSrc}
                      alt={option.iconAlt}
                      width={28}
                      height={28}
                      className="size-7"
                    />
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
                onClick={() => handleCpuChange(option.id)}
                className={cn(
                  "rounded-xl border p-4 text-left transition hover:border-primary/60",
                  selection.cpu === option.id
                    ? "border-primary bg-primary/10"
                    : "bg-background",
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2 text-primary">
                    {option.icon === "cpu" ? (
                      <Cpu className="h-5 w-5 text-primary" />
                    ) : (
                      <CircuitBoard className="h-5 w-5 text-primary" />
                    )}
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
          className="w-full gap-2 text-xs sm:text-sm"
          asChild
          disabled={!downloadHref}
        >
          {downloadHref ? (
            <a
              href={downloadHref}
              {...(isDirectGithubDownload
                ? { download: "" }
                : { target: "_blank", rel: "noopener noreferrer" })}
            >
              <Download className="h-5 w-5" />
              Download
            </a>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Coming soon
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

function DownloadTip(props: { selection: DownloadSelection }) {
  const selectedOs =
    OS_OPTIONS.find((option) => option.id === props.selection.os) ?? DEFAULT_OS;
  const selectedCpu =
    CPU_OPTIONS.find((option) => option.id === props.selection.cpu) ??
    DEFAULT_CPU;

  return (
    <div className="rounded-xl border bg-muted/30 p-4 text-sm">
      <p className="font-semibold text-primary">Tip</p>
      <p className="text-muted-foreground">
        x86_64 means Intel and AMD CPUs. AArch64 refers to ARM processors like
        Apple Silicon or Snapdragon laptops.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Currently set to{" "}
        <span className="font-medium text-foreground">{selectedOs.label}</span>{" "}
        • {selectedCpu.label}
      </p>
    </div>
  );
}
