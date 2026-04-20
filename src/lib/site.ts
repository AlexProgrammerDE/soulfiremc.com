export const siteName = "SoulFire";
export const siteUrl =
  import.meta.env.VITE_SITE_URL?.trim() || "https://soulfiremc.com";
export const siteDescription =
  "Advanced Minecraft bot tool for testing, automation, and development. Run bot sessions on your servers.";
export const defaultSocialImageUrl = `${siteUrl}/og/site/home/image.webp`;

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  if (path === "/") {
    return `${siteUrl}/`;
  }

  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
