import assert from "node:assert/strict";
import test from "node:test";
import { createClientDownloads } from "@/lib/client-downloads";
import type { LatestReleaseResponse } from "@/lib/releases";

test("createClientDownloads uses GitHub artifacts for macOS and Windows, but keeps Linux on Flathub", () => {
  const release = {
    html_url:
      "https://github.com/soulfiremc-com/SoulFireClient/releases/tag/2.8.1",
    assets: [
      {
        name: "soulfire_2.8.1_amd64.AppImage",
        browser_download_url:
          "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/soulfire_2.8.1_amd64.AppImage",
      },
      {
        name: "soulfire_2.8.1_arm64.deb",
        browser_download_url:
          "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/soulfire_2.8.1_arm64.deb",
      },
      {
        name: "SoulFire_2.8.1_aarch64.dmg",
        browser_download_url:
          "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_aarch64.dmg",
      },
      {
        name: "SoulFire_2.8.1_x64.dmg",
        browser_download_url:
          "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_x64.dmg",
      },
      {
        name: "SoulFire_2.8.1_arm64-setup.exe",
        browser_download_url:
          "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_arm64-setup.exe",
      },
      {
        name: "SoulFire_2.8.1_x64-setup.exe",
        browser_download_url:
          "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_x64-setup.exe",
      },
    ],
  } as LatestReleaseResponse;

  const downloads = createClientDownloads(release);

  assert.equal(
    downloads.windows.x64,
    "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_x64-setup.exe",
  );
  assert.equal(
    downloads.windows.arm64,
    "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_arm64-setup.exe",
  );
  assert.equal(
    downloads.macos.x64,
    "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_x64.dmg",
  );
  assert.equal(
    downloads.macos.arm64,
    "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_aarch64.dmg",
  );
  assert.equal(
    downloads.linux.x64,
    "https://flathub.org/apps/com.soulfiremc.soulfire",
  );
  assert.equal(
    downloads.linux.arm64,
    "https://flathub.org/apps/com.soulfiremc.soulfire",
  );
});
