import { createStandardSchemaV1, parseAsInteger } from "nuqs";

export const reviewsPageParser = parseAsInteger
  .withDefault(1)
  .withOptions({ clearOnDefault: true, shallow: false });

export const reviewsSearchParams = {
  reviewsPage: reviewsPageParser,
};

export const validateReviewsSearch = createStandardSchemaV1(
  reviewsSearchParams,
  {
    partialOutput: true,
  },
);
