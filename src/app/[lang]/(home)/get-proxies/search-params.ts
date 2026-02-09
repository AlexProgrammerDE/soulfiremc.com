import {
  createLoader,
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsStringLiteral,
  type SearchParams,
} from "nuqs/server";

export const BADGES = [
  "residential",
  "datacenter",
  "isp",
  "mobile",
  "free-tier",
  "unlimited-bandwidth",
  "budget-friendly",
  "enterprise",
  "high-quality",
] as const;

export const proxiesSearchParams = {
  badges: parseAsArrayOf(parseAsStringLiteral([...BADGES])).withDefault([]),
};

export const proxiesSearchParamsCache =
  createSearchParamsCache(proxiesSearchParams);

export const loadProxiesSearchParams = createLoader(proxiesSearchParams);

export type ProxiesSelection = Awaited<
  ReturnType<typeof loadProxiesSearchParams>
>;
export type ProxiesPageSearchParams = Promise<SearchParams>;
