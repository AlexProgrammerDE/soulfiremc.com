import type { LatestReleaseResponse } from "@/lib/releases";

export type ClientDownloadOs = "windows" | "macos" | "linux";
export type ClientDownloadArch = "x64" | "arm64";
export type DownloadLinkMap = Record<
  ClientDownloadOs,
  Record<ClientDownloadArch, string>
>;

const CLIENT_RELEASES_URL =
  "https://github.com/soulfiremc-com/SoulFireClient/releases/latest";
const FLATHUB_URL = "https://flathub.org/apps/com.soulfiremc.soulfire";

const CLIENT_ASSET_PATTERNS: Record<
  ClientDownloadOs,
  Record<ClientDownloadArch, RegExp[]>
> = {
  windows: {
    x64: [/^SoulFire_.*_x64-setup\.exe$/],
    arm64: [/^SoulFire_.*_arm64-setup\.exe$/],
  },
  macos: {
    x64: [/^SoulFire_.*_x64\.dmg$/],
    arm64: [/^SoulFire_.*_(?:aarch64|arm64)\.dmg$/],
  },
};

function findAssetDownloadUrl(
  release: LatestReleaseResponse | null,
  patterns: RegExp[],
): string | undefined {
  const assets = release?.assets ?? [];

  for (const pattern of patterns) {
    const asset = assets.find((candidate) => pattern.test(candidate.name));
    if (asset?.browser_download_url) {
      return asset.browser_download_url;
    }
  }

  return undefined;
}

export function createClientDownloads(
  release: LatestReleaseResponse | null,
): DownloadLinkMap {
  const releasePageUrl = release?.html_url ?? CLIENT_RELEASES_URL;

  return {
    windows: {
      x64:
        findAssetDownloadUrl(release, CLIENT_ASSET_PATTERNS.windows.x64) ??
        releasePageUrl,
      arm64:
        findAssetDownloadUrl(release, CLIENT_ASSET_PATTERNS.windows.arm64) ??
        releasePageUrl,
    },
    macos: {
      x64:
        findAssetDownloadUrl(release, CLIENT_ASSET_PATTERNS.macos.x64) ??
        releasePageUrl,
      arm64:
        findAssetDownloadUrl(release, CLIENT_ASSET_PATTERNS.macos.arm64) ??
        releasePageUrl,
    },
    linux: {
      x64: FLATHUB_URL,
      arm64: FLATHUB_URL,
    },
  };
}
