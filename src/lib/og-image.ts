import { ImageResponse } from "@takumi-rs/image-response/wasm";
import takumiWasmModule from "@takumi-rs/wasm/next";
import type { ReactElement } from "react";
import logoSvgUrl from "@/assets/logo-square.svg?inline";

const baseImageOptions = {
  format: "webp" as const,
  headers: {
    "Cache-Control": "public, immutable, max-age=31536000",
  },
  height: 630,
  module: takumiWasmModule,
  width: 1200,
};

export function createOgImageResponse(element: ReactElement) {
  return new ImageResponse(element, baseImageOptions);
}

export const soulfireLogoDataUri = logoSvgUrl;

const embeddedLogos = import.meta.glob<string>(
  "/src/assets/{accounts,providers}/*.{png,svg,gif,jpg,jpeg,webp}",
  { query: "?inline", import: "default", eager: true },
);

const logosByPublicPath = new Map<string, string>(
  Object.entries(embeddedLogos).map(([modulePath, dataUri]) => {
    const publicPath = modulePath.replace(/^.*\/src\/assets/, "");
    return [publicPath, dataUri];
  }),
);

export function getEmbeddedLogo(publicPath?: string) {
  if (!publicPath) return undefined;
  return logosByPublicPath.get(publicPath);
}
