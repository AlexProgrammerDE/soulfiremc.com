const WINDOWS_OPTION = {
  id: "windows",
  label: "Windows",
  detail: "Windows 10 or newer",
  iconSrc: "/platform/windows.png",
  iconAlt: "Windows",
} as const;

const FALLBACK_CPU = {
  id: "x64",
  label: "x86_64 / AMD64",
  detail: "Intel or AMD processors",
  icon: "cpu",
} as const;

export const OS_OPTIONS = [
  WINDOWS_OPTION,
  {
    id: "macos",
    label: "macOS",
    detail: "Apple Silicon & Intel",
    iconSrc: "/platform/macos.png",
    iconAlt: "macOS",
  },
  {
    id: "linux",
    label: "Linux",
    detail: "Most distros supported",
    iconSrc: "/platform/linux.png",
    iconAlt: "Linux",
  },
] as const;

export const CPU_OPTIONS = [
  FALLBACK_CPU,
  {
    id: "arm64",
    label: "AArch64 / ARM64",
    detail: "Apple Silicon or ARM servers",
    icon: "circuit",
  },
] as const;

export const DEFAULT_OS = WINDOWS_OPTION;
export const DEFAULT_CPU = FALLBACK_CPU;

export type OsOption = (typeof OS_OPTIONS)[number];
export type CpuOption = (typeof CPU_OPTIONS)[number];
