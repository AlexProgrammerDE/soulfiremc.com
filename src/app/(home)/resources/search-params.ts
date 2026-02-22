import {
  createLoader,
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsStringLiteral,
  type SearchParams,
} from "nuqs/server";

export const CATEGORIES = ["plugin", "script"] as const;

export const TAGS = [
  "combat",
  "farming",
  "utility",
  "movement",
  "building",
  "pvp",
  "survival",
  "minigame",
  "automation",
  "open-source",
] as const;

export const resourcesSearchParams = {
  category: parseAsStringLiteral([...CATEGORIES]).withDefault(null as never),
  tags: parseAsArrayOf(parseAsStringLiteral([...TAGS])).withDefault([]),
};

export const resourcesSearchParamsCache = createSearchParamsCache(
  resourcesSearchParams,
);

export const loadResourcesSearchParams = createLoader(resourcesSearchParams);

export type ResourcesSelection = Awaited<
  ReturnType<typeof loadResourcesSearchParams>
>;
export type ResourcesPageSearchParams = Promise<SearchParams>;
