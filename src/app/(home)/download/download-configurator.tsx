"use client";

import { CircuitBoard, Cpu, Download } from "lucide-react";
import Image from "next/image";
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
import type { DownloadLinkMap } from "./download-data";
import { CPU_OPTIONS, DEFAULT_CPU, DEFAULT_OS, OS_OPTIONS } from "./options";
import { type DownloadSelection, downloadSearchParams } from "./search-params";

export function DownloadConfigurator(props: {
  links: DownloadLinkMap;
  initialSelection: DownloadSelection;
}) {
  const [{ os, cpu }, setSelection] = useQueryStates(downloadSearchParams, {
    history: "replace",
    shallow: false,
  });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const selection = isHydrated ? { os, cpu } : props.initialSelection;

  const selectedOs =
    OS_OPTIONS.find((option) => option.id === selection.os) ?? DEFAULT_OS;
  const selectedCpu =
    CPU_OPTIONS.find((option) => option.id === selection.cpu) ?? DEFAULT_CPU;

  const downloadHref = props.links[selection.os]?.[selection.cpu];

  const handleOsChange = (value: typeof selection.os) => {
    setSelection((prev) => ({
      ...prev,
      os: value,
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
          className="w-full gap-2"
          asChild
          disabled={!downloadHref}
        >
          {downloadHref ? (
            <a href={downloadHref} target="_blank" rel="noopener noreferrer">
              <Download className="h-5 w-5" />
              Download for {selectedOs.label} · {selectedCpu.label}
            </a>
          ) : (
            <>
              <Download className="h-5 w-5" />
              Coming soon for {selectedOs.label} · {selectedCpu.label}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
