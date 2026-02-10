const FALLBACK_CPU = {
  id: "x64",
  label: "x86_64 / AMD64",
  detail: "Intel or AMD processors",
  icon: "cpu",
} as const;

const ARM_CPU = {
  id: "arm64",
  label: "AArch64 / ARM64",
  detail: "Apple Silicon or ARM servers",
  icon: "circuit",
} as const;

const WINDOWS_OPTION = {
  id: "windows",
  label: "Windows",
  detail: "Windows 10 or newer",
  iconSrc: "/platform/windows.png",
  iconAlt: "Windows",
  preferredCpuId: FALLBACK_CPU.id,
} as const;

export const OS_OPTIONS = [
  WINDOWS_OPTION,
  {
    id: "macos",
    label: "macOS",
    detail: "Apple Silicon & Intel",
    iconSrc: "/platform/macos.png",
    iconAlt: "macOS",
    preferredCpuId: ARM_CPU.id,
  },
  {
    id: "linux",
    label: "Linux",
    detail: "Most distros supported",
    iconSrc: "/platform/linux.png",
    iconAlt: "Linux",
    preferredCpuId: FALLBACK_CPU.id,
  },
] as const;

export type OsOption = (typeof OS_OPTIONS)[number];

export const CPU_OPTIONS = [FALLBACK_CPU, ARM_CPU] as const;

export const DEFAULT_OS = WINDOWS_OPTION;
export const DEFAULT_CPU = FALLBACK_CPU;
export type CpuOption = (typeof CPU_OPTIONS)[number];

export const PREFERRED_CPU_BY_OS = OS_OPTIONS.reduce(
  (acc, option) => {
    acc[option.id] = option.preferredCpuId;
    return acc;
  },
  {} as Record<OsOption["id"], CpuOption["id"]>,
);
