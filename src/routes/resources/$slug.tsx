import { createFileRoute, notFound } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import ResourceDetailPageContent from "@/app/(home)/resources/[slug]/page";
import { SiteShell } from "@/components/site-shell";
import { getCanonicalLinks, getPageMeta } from "@/lib/seo";
import { getResourcePageImage } from "@/lib/og";
import {
  getResourceBySlug,
} from "@/lib/resources-data";
import {
  emptyReviewSummary,
  getAggregateRatingJsonLd,
  getPaginatedWrittenReviews,
  getReviewJsonLd,
  getReviewSummaries,
} from "@/lib/reviews";

const resourceDetailLoader = createServerFn({ method: "GET" })
  .inputValidator((value: { slug: string }) => value)
  .handler(async ({ data }) => {
    const resource = getResourceBySlug(data.slug);
    if (!resource) {
      throw notFound();
    }

    const reviewSummaries = await getReviewSummaries("resource", [resource.slug]).catch(
      () =>
        ({} as Record<
          string,
          { averageRating: number | null; reviewCount: number }
        >),
    );
    const reviewSummary = reviewSummaries[resource.slug] ?? emptyReviewSummary();
    const writtenReviews = await getPaginatedWrittenReviews(
      "resource",
      resource.slug,
      reviewSummary.reviewCount,
      { page: 1 },
    ).catch(() => ({
      entries: [],
      page: 1,
      pageSize: 8,
      totalCount: 0,
      totalPages: 0,
    }));

    const softwareJsonLd = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `https://soulfiremc.com/resources/${resource.slug}#software`,
      name: resource.name,
      description: resource.description,
      applicationCategory: resource.category === "plugin" ? "Plugin" : "Script",
      author: { "@type": "Person", name: resource.author },
      ...(resource.version && { softwareVersion: resource.version }),
      ...(resource.startDate && { dateCreated: resource.startDate }),
      image: resource.logo
        ? `https://soulfiremc.com${resource.logo}`
        : "https://soulfiremc.com/logo.png",
      url: `https://soulfiremc.com/resources/${resource.slug}`,
      downloadUrl: resource.url,
      ...(resource.sourceUrl && { sameAs: resource.sourceUrl }),
      ...(getAggregateRatingJsonLd(reviewSummary) && {
        aggregateRating: getAggregateRatingJsonLd(reviewSummary),
      }),
      ...(getReviewJsonLd(writtenReviews.entries) && {
        review: getReviewJsonLd(writtenReviews.entries),
      }),
    };

    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `https://soulfiremc.com/resources/${resource.slug}#breadcrumb`,
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
          name: "Resources",
          item: "https://soulfiremc.com/resources",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: resource.name,
          item: `https://soulfiremc.com/resources/${resource.slug}`,
        },
      ],
    };

    const pageJsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `https://soulfiremc.com/resources/${resource.slug}#webpage`,
      name: `${resource.name} - SoulFire ${resource.category === "plugin" ? "Plugin" : "Script"}`,
      description: resource.description,
      url: `https://soulfiremc.com/resources/${resource.slug}`,
      inLanguage: "en-US",
      breadcrumb: {
        "@id": `https://soulfiremc.com/resources/${resource.slug}#breadcrumb`,
      },
      mainEntity: {
        "@id": `https://soulfiremc.com/resources/${resource.slug}#software`,
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
      resource,
      reviewSummary,
      softwareJsonLd: JSON.parse(JSON.stringify(softwareJsonLd)),
      writtenReviews: JSON.parse(JSON.stringify(writtenReviews)),
    };
  });

export const Route = createFileRoute("/resources/$slug")({
  loader: async ({ params }) => resourceDetailLoader({ data: { slug: params.slug } }),
  head: ({ loaderData }) => {
    const data = loaderData;

    if (!data) {
      return {
        meta: [],
      };
    }

    return {
      meta: getPageMeta({
        title: `${data.resource.name} - SoulFire ${data.resource.category === "plugin" ? "Plugin" : "Script"}`,
        description: data.resource.description,
        path: `/resources/${data.resource.slug}`,
        imageUrl: getResourcePageImage(data.resource.slug).url,
        imageAlt: `${data.resource.name} preview`,
      }),
      links: getCanonicalLinks(`/resources/${data.resource.slug}`),
    };
  },
  component: ResourceDetailPage,
});

function ResourceDetailPage() {
  const data = Route.useLoaderData();

  return (
    <SiteShell>
      <ResourceDetailPageContent {...data} />
    </SiteShell>
  );
}
