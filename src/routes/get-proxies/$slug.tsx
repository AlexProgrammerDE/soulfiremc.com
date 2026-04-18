import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { ImageObject } from "schema-dts";
import ProxyProviderPageContent from "@/app/(home)/get-proxies/[slug]/page";
import { SiteShell } from "@/components/site-shell";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";
import { getProxyPageImage } from "@/lib/og";
import {
  getProviderBySlug,
} from "@/lib/proxies-data";
import {
  emptyReviewSummary,
  getAggregateRatingJsonLd,
  getPaginatedWrittenReviews,
  getReviewJsonLd,
  getReviewSummaries,
} from "@/lib/reviews";

const proxyDetailLoader = createServerFn({ method: "GET" })
  .inputValidator((value: { slug: string }) => value)
  .handler(async ({ data }) => {
    const provider = getProviderBySlug(data.slug);
    if (!provider) {
      throw notFound();
    }

    const reviewSummaries = await getReviewSummaries("proxy", [provider.slug]).catch(
      () =>
        ({} as Record<
          string,
          { averageRating: number | null; reviewCount: number }
        >),
    );
    const reviewSummary = reviewSummaries[provider.slug] ?? emptyReviewSummary();
    const writtenReviews = await getPaginatedWrittenReviews(
      "proxy",
      provider.slug,
      reviewSummary.reviewCount,
      { page: 1 },
    ).catch(() => ({
      entries: [],
      page: 1,
      pageSize: 8,
      totalCount: 0,
      totalPages: 0,
    }));

    const productJsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `https://soulfiremc.com/get-proxies/${provider.slug}#product`,
      name: provider.name,
      description: provider.summary,
      image: provider.logo
        ? `https://soulfiremc.com${provider.logo}`
        : "https://soulfiremc.com/logo.png",
      brand: {
        "@type": "Brand",
        name: provider.name,
      },
      url: `https://soulfiremc.com/get-proxies/${provider.slug}`,
      category: "Proxy Service",
      ...(provider.startDate && { dateCreated: provider.startDate }),
      ...(getAggregateRatingJsonLd(reviewSummary) && {
        aggregateRating: getAggregateRatingJsonLd(reviewSummary),
      }),
      ...(getReviewJsonLd(writtenReviews.entries) && {
        review: getReviewJsonLd(writtenReviews.entries),
      }),
      ...(provider.gallery &&
        provider.gallery.length > 0 && {
          image: provider.gallery.map(
            (img): ImageObject => ({
              "@type": "ImageObject",
              url: `https://soulfiremc.com${img.src}`,
              name: img.alt,
            }),
          ),
        }),
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `https://soulfiremc.com/get-proxies/${provider.slug}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://soulfiremc.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Get Proxies",
          item: "https://soulfiremc.com/get-proxies",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: provider.name,
          item: `https://soulfiremc.com/get-proxies/${provider.slug}`,
        },
      ],
    };

    const pageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `https://soulfiremc.com/get-proxies/${provider.slug}#webpage`,
      name: `${provider.name} - Proxy Provider for SoulFire`,
      description: provider.summary,
      url: `https://soulfiremc.com/get-proxies/${provider.slug}`,
      inLanguage: "en-US",
      breadcrumb: {
        "@id": `https://soulfiremc.com/get-proxies/${provider.slug}#breadcrumb`,
      },
      mainEntity: {
        "@id": `https://soulfiremc.com/get-proxies/${provider.slug}#product`,
      },
      isPartOf: {
        "@type": "WebSite",
        name: "SoulFire",
        url: "https://soulfiremc.com",
      },
    };

    return {
      breadcrumbJsonLd: JSON.parse(JSON.stringify(breadcrumbJsonLd)),
      pageJsonLd: JSON.parse(JSON.stringify(pageJsonLd)),
      productJsonLd: JSON.parse(JSON.stringify(productJsonLd)),
      provider,
      reviewSummary,
      writtenReviews: JSON.parse(JSON.stringify(writtenReviews)),
    };
  });

export const Route = createFileRoute("/get-proxies/$slug")({
  loader: async ({ params }) => proxyDetailLoader({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    const data = loaderData;

    if (!data) {
      return { meta: [] };
    }

    return {
      meta: getPageMeta({
        title: `${data.provider.name} - Proxy Provider for SoulFire`,
        description: data.provider.summary,
        path: `/get-proxies/${data.provider.slug}`,
        imageUrl: getProxyPageImage(data.provider.slug).url,
        imageAlt: `${data.provider.name} preview`,
      }),
      links: getCanonicalLinks(`/get-proxies/${data.provider.slug}`),
    };
  },
  component: GetProxyDetailPage,
});

function GetProxyDetailPage() {
  const data = Route.useLoaderData();

  return (
    <SiteShell>
      <ProxyProviderPageContent {...data} />
    </SiteShell>
  );
}
