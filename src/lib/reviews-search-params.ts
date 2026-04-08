import { parseAsInteger } from "nuqs";

export const reviewsPageParser = parseAsInteger
  .withDefault(1)
  .withOptions({ clearOnDefault: true, shallow: false });
