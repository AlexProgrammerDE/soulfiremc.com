export type ClientDownloadOs = "windows" | "macos" | "linux";
export type ClientDownloadArch = "x64" | "arm64";
export type DownloadLinkMap = Record<
  ClientDownloadOs,
  Record<ClientDownloadArch, string>
>;

export type ClientReleaseManifestPlatform = {
  signature?: string;
  url: string;
};

export type ClientReleaseManifestPlatformKey =
  | "windows-x86_64"
  | "windows-aarch64"
  | "darwin-x86_64"
  | "darwin-aarch64"
  | "linux-x86_64"
  | "linux-aarch64";

export type ClientReleaseManifest = {
  version: string;
  notes?: string;
  pub_date?: string;
  platforms: Partial<
    Record<ClientReleaseManifestPlatformKey, ClientReleaseManifestPlatform>
  >;
};

export type ServerDownload = {
  name: string;
  description: string;
  url: string;
};

export const CLIENT_RELEASES_URL =
  "https://github.com/soulfiremc-com/SoulFireClient/releases/latest";
export const FLATHUB_URL = "https://flathub.org/apps/com.soulfiremc.soulfire";

const GH_SERVER_BASE =
  "https://github.com/soulfiremc-com/SoulFire/releases/download";
const CLIENT_RELEASE_DOWNLOAD_BASE =
  "https://github.com/soulfiremc-com/SoulFireClient/releases/download";

const CLIENT_PLATFORM_KEYS: Record<
  Exclude<ClientDownloadOs, "linux">,
  Record<ClientDownloadArch, ClientReleaseManifestPlatformKey>
> = {
  windows: {
    x64: "windows-x86_64",
    arm64: "windows-aarch64",
  },
  macos: {
    x64: "darwin-x86_64",
    arm64: "darwin-aarch64",
  },
};

function getClientPlatformUrl(
  manifest: ClientReleaseManifest | null,
  platform: ClientReleaseManifestPlatformKey,
): string | undefined {
  return manifest?.platforms[platform]?.url;
}

function buildMacosDmgUrl(
  version: string | undefined,
  arch: ClientDownloadArch,
): string | undefined {
  if (!version) {
    return undefined;
  }

  const normalizedArch = arch === "arm64" ? "aarch64" : "x64";
  return `${CLIENT_RELEASE_DOWNLOAD_BASE}/${version}/SoulFire_${version}_${normalizedArch}.dmg`;
}

export function createClientDownloads(
  manifest: ClientReleaseManifest | null,
): DownloadLinkMap {
  const version = manifest?.version?.trim();

  return {
    windows: {
      x64:
        getClientPlatformUrl(manifest, CLIENT_PLATFORM_KEYS.windows.x64) ??
        CLIENT_RELEASES_URL,
      arm64:
        getClientPlatformUrl(manifest, CLIENT_PLATFORM_KEYS.windows.arm64) ??
        CLIENT_RELEASES_URL,
    },
    macos: {
      x64: buildMacosDmgUrl(version, "x64") ?? CLIENT_RELEASES_URL,
      arm64: buildMacosDmgUrl(version, "arm64") ?? CLIENT_RELEASES_URL,
    },
    linux: {
      x64: FLATHUB_URL,
      arm64: FLATHUB_URL,
    },
  };
}

export function createServerDownloads(version: string): ServerDownload[] {
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

export function normalizeServerVersion(raw: string): string | undefined {
  const version = raw.trim();
  return version ? version : undefined;
}
