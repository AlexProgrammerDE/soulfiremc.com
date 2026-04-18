import * as fs from "node:fs";
import * as path from "node:path";
import { Generator, getConfig } from "@tanstack/router-generator";

const root = process.cwd();

const config = getConfig();
const generator = new Generator({ config, root });

await generator.run();

const routeTreePath = path.join(root, "src/routeTree.gen.ts");
const registrationSnippet = `
import type { getRouter } from './router.tsx'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
  }
}
`;

const generated = fs
  .readFileSync(routeTreePath, "utf8")
  .replace(registrationSnippet, "");

fs.writeFileSync(routeTreePath, `${generated}${registrationSnippet}`);
