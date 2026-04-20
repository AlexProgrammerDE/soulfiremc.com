import { createFileRoute, notFound } from "@tanstack/react-router";
import { ResourceOgImage } from "@/components/og/site";
import { stripOgSuffix } from "@/lib/og";
import { createOgImageResponse, getEmbeddedLogo } from "@/lib/og-image";
import { getResourceBySlug } from "@/lib/resources-data";

export const Route = createFileRoute("/og/resources/{$}/image.webp")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slugs = params._splat?.split("/").filter(Boolean) ?? [];
        const [resourceSlug] = stripOgSuffix(slugs);
        const resource = resourceSlug
          ? getResourceBySlug(resourceSlug)
          : undefined;

        if (!resource) throw notFound();

        return createOgImageResponse(
          <ResourceOgImage
            name={resource.name}
            description={resource.description}
            author={resource.author}
            category={resource.category}
            badges={resource.badges}
            version={resource.version}
            logoSrc={getEmbeddedLogo(resource.logo)}
          />,
        );
      },
    },
  },
});
