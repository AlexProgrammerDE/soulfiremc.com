import assert from "node:assert/strict";
import test from "node:test";
import {
  type ClientReleaseManifest,
  createClientDownloads,
  createServerDownloads,
  normalizeServerVersion,
} from "@/lib/download-links";

test("createClientDownloads uses latest.json platform URLs and keeps Linux on Flathub", () => {
  const manifest = {
    version: "2.8.1",
    pub_date: "2026-04-14T19:49:44.763Z",
    notes: "See the assets to download this version and install.",
    platforms: {
      "windows-x86_64": {
        url: "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_x64-setup.exe",
      },
      "windows-aarch64": {
        url: "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_2.8.1_arm64-setup.exe",
      },
      "darwin-x86_64": {
        url: "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_x64.app.tar.gz",
      },
      "darwin-aarch64": {
        url: "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/SoulFire_aarch64.app.tar.gz",
      },
      "linux-x86_64": {
        url: "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/soulfire_2.8.1_amd64.AppImage",
      },
      "linux-aarch64": {
        url: "https://github.com/soulfiremc-com/SoulFireClient/releases/download/2.8.1/soulfire_2.8.1_aarch64.AppImage",
      },
    },
  } satisfies ClientReleaseManifest;

  const downloads = createClientDownloads(manifest);

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

test("createServerDownloads builds the CLI and dedicated URLs from the version file", () => {
  assert.deepEqual(createServerDownloads("2.8.1"), [
    {
      name: "SoulFire CLI",
      description: "Headless command-line client",
      url: "https://github.com/soulfiremc-com/SoulFire/releases/download/2.8.1/SoulFireCLI-2.8.1.jar",
    },
    {
      name: "SoulFire Dedicated",
      description: "Dedicated server controller",
      url: "https://github.com/soulfiremc-com/SoulFire/releases/download/2.8.1/SoulFireDedicated-2.8.1.jar",
    },
  ]);
});

test("normalizeServerVersion trims the raw version file contents", () => {
  assert.equal(normalizeServerVersion(" 2.8.1\n"), "2.8.1");
  assert.equal(normalizeServerVersion("   \n"), undefined);
});
