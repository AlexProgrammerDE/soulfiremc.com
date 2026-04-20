import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import mdx from "fumadocs-mdx/vite";
import { defineConfig } from "vite";
import * as MdxConfig from "./source.config";

const securityHeaders = {
  "X-DNS-Prefetch-Control": "on",
  "X-XSS-Protection": "0",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Content-Type-Options": "nosniff",
};

export default defineConfig(() => ({
  envPrefix: ["VITE_"],
  resolve: {
    dedupe: [
      "react",
      "react-dom",
      "@tanstack/history",
      "@tanstack/query-core",
      "@tanstack/react-query",
      "@tanstack/react-router",
      "@tanstack/react-store",
      "@tanstack/router-core",
      "@tanstack/store",
    ],
    tsconfigPaths: true,
  },
  plugins: [
    devtools(),
    mdx(MdxConfig),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tailwindcss(),
    tanstackStart({
      sitemap: {
        enabled: true,
        host: "https://soulfiremc.com",
      },
      prerender: {
        enabled: true,
        crawlLinks: true,
        autoSubfolderIndex: false,
        filter: ({ path }: { path: string }) =>
          !(
            path.startsWith("/_") ||
            path.startsWith("/api") ||
            path.startsWith("/og") ||
            path.startsWith("//") ||
            (path !== "/" && path.endsWith("/")) ||
            path.includes("://") ||
            path === "/discord" ||
            path === "/github" ||
            path === "/donate" ||
            path === "/demo-video"
          ),
      },
    }),
    react(),
  ],
  server: {
    headers: securityHeaders,
  },
}));
