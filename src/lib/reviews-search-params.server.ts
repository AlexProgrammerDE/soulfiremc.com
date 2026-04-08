import {
  createLoader,
  createSearchParamsCache,
  type SearchParams,
} from "nuqs/server";
import { reviewsPageParser } from "./reviews-search-params";

export const reviewsSearchParams = {
  reviewsPage: reviewsPageParser,
};

export const reviewsSearchParamsCache =
  createSearchParamsCache(reviewsSearchParams);

export const loadReviewsSearchParams = createLoader(reviewsSearchParams);

export type ReviewsPageSearchParams = Promise<SearchParams>;
