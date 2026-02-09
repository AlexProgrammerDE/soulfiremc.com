export type DownloadLinkMap = Record<string, Record<string, string>>;
export type PlatformRow = {
  label: string;
  os: "windows" | "macos" | "linux";
  arch: "x64" | "arm64";
  archLabel: string;
  url: string;
};

const GH_CLIENT_BASE =
  "https://github.com/AlexProgrammerDE/SoulFireClient/releases/download";
const GH_SERVER_BASE =
  "https://github.com/AlexProgrammerDE/SoulFire/releases/download";
const FLATHUB_URL = "https://flathub.org/apps/com.soulfiremc.soulfire";

export function createClientDownloads(version: string): DownloadLinkMap {
  return {
    windows: {
      x64: `${GH_CLIENT_BASE}/${version}/SoulFire_${version}_x64-setup.exe`,
      arm64: `${GH_CLIENT_BASE}/${version}/SoulFire_${version}_arm64-setup.exe`,
    },
    macos: {
      x64: `${GH_CLIENT_BASE}/${version}/SoulFire_${version}_x64.dmg`,
      arm64: `${GH_CLIENT_BASE}/${version}/SoulFire_${version}_aarch64.dmg`,
    },
    linux: {
      x64: FLATHUB_URL,
      arm64: FLATHUB_URL,
    },
  };
}

export function createPlatformRows(
  clientDownloads: DownloadLinkMap,
): PlatformRow[] {
  return [
    {
      label: "Windows (x86_64)",
      os: "windows",
      arch: "x64",
      archLabel: "x86_64 / AMD64",
      url: clientDownloads.windows?.x64 ?? "#",
    },
    {
      label: "Windows (AArch64)",
      os: "windows",
      arch: "arm64",
      archLabel: "AArch64 / ARM64",
      url: clientDownloads.windows?.arm64 ?? "#",
    },
    {
      label: "macOS (Intel)",
      os: "macos",
      arch: "x64",
      archLabel: "x86_64 / AMD64",
      url: clientDownloads.macos?.x64 ?? "#",
    },
    {
      label: "macOS (Apple Silicon)",
      os: "macos",
      arch: "arm64",
      archLabel: "AArch64 / ARM64",
      url: clientDownloads.macos?.arm64 ?? "#",
    },
    {
      label: "Linux (x86_64)",
      os: "linux",
      arch: "x64",
      archLabel: "x86_64 / AMD64",
      url: clientDownloads.linux?.x64 ?? FLATHUB_URL,
    },
    {
      label: "Linux (AArch64)",
      os: "linux",
      arch: "arm64",
      archLabel: "AArch64 / ARM64",
      url: clientDownloads.linux?.arm64 ?? FLATHUB_URL,
    },
  ];
}

export function createServerDownloads(version: string) {
  return [
    {
      name: "SoulFire CLI",
      description: "Headless command-line client",
      url: `${GH_SERVER_BASE}/${version}/SoulFireCLI-${version}.jar`,
    },
    {
      name: "SoulFire Dedicated",
      description: "Dedicated server controller",
      url: `${GH_SERVER_BASE}/${version}/SoulFireDedicated-${version}.jar`,
    },
  ];
}
