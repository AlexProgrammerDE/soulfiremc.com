import {
  createLoader,
  createSearchParamsCache,
  parseAsStringLiteral,
  type SearchParams,
} from "nuqs/server";
import { CPU_OPTIONS, DEFAULT_CPU, DEFAULT_OS, OS_OPTIONS } from "./options";

const OS_IDS = OS_OPTIONS.map((option) => option.id);
const CPU_IDS = CPU_OPTIONS.map((option) => option.id);

export const downloadSearchParams = {
  os: parseAsStringLiteral(OS_IDS).withDefault(DEFAULT_OS.id),
  cpu: parseAsStringLiteral(CPU_IDS).withDefault(DEFAULT_CPU.id),
};

export const downloadSearchParamsCache =
  createSearchParamsCache(downloadSearchParams);

export const loadDownloadSearchParams = createLoader(downloadSearchParams);

export type DownloadSelection = Awaited<
  ReturnType<typeof loadDownloadSearchParams>
>;
export type DownloadPageSearchParams = Promise<SearchParams>;
