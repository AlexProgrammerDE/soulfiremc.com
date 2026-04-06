import { readFile } from "node:fs/promises";
import path from "node:path";

const cache = new Map<string, string>();

function getMimeType(filePath: string) {
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".png")) return "image/png";
  if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg"))
    return "image/jpeg";
  if (filePath.endsWith(".webp")) return "image/webp";
  if (filePath.endsWith(".gif")) return "image/gif";
  return "application/octet-stream";
}

export async function getOgAssetDataUri(assetPath?: string) {
  if (!assetPath || !assetPath.startsWith("/")) return undefined;
  if (cache.has(assetPath)) return cache.get(assetPath);

  const filePath = path.join(process.cwd(), "public", assetPath.slice(1));
  const bytes = await readFile(filePath);
  const dataUri = `data:${getMimeType(filePath)};base64,${bytes.toString("base64")}`;

  cache.set(assetPath, dataUri);
  return dataUri;
}
