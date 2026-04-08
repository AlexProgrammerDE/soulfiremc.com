import { parseAsInteger } from "nuqs/server";

export const reviewsPageParser = parseAsInteger
  .withDefault(1)
  .withOptions({ clearOnDefault: true, shallow: false });
