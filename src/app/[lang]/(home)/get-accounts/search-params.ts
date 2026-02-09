import {
  createLoader,
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsStringLiteral,
  type SearchParams,
} from "nuqs/server";

export const CATEGORIES = ["token-accounts", "mfa-accounts"] as const;

export const BADGES = [
  "high-quality",
  "instant-delivery",
  "lifetime-warranty",
  "bulk-discount",
  "soulfire-compatible",
] as const;

export const SORT_OPTIONS = ["default", "price-asc", "price-desc"] as const;

export const accountsSearchParams = {
  category: parseAsStringLiteral([...CATEGORIES]),
  badges: parseAsArrayOf(parseAsStringLiteral([...BADGES])).withDefault([]),
  sort: parseAsStringLiteral([...SORT_OPTIONS]).withDefault("default"),
};

export const accountsSearchParamsCache =
  createSearchParamsCache(accountsSearchParams);

export const loadAccountsSearchParams = createLoader(accountsSearchParams);

export type AccountsSelection = Awaited<
  ReturnType<typeof loadAccountsSearchParams>
>;
export type AccountsPageSearchParams = Promise<SearchParams>;
