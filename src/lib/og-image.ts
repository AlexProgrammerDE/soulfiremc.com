import logoSvgUrl from "@/assets/logo-square.svg?inline";
import { ImageResponse } from "@takumi-rs/image-response/wasm";
import takumiWasmModule from "@takumi-rs/wasm/next";
import type { ReactElement } from "react";

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
