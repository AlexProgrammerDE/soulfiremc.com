import "server-only";

import { createHash } from "node:crypto";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function getGravatarUrl(email: string, size = 160) {
  const hash = createHash("md5").update(normalizeEmail(email)).digest("hex");
  const params = new URLSearchParams({
    d: "retro",
    s: String(size),
  });

  return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
}

export function withGravatarFallback(
  image: string | null | undefined,
  email: string | null | undefined,
  size?: number,
) {
  if (image) {
    return image;
  }

  if (!email) {
    return null;
  }

  return getGravatarUrl(email, size);
}
