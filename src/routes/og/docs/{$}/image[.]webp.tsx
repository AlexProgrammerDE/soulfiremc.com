import { createFileRoute, notFound } from "@tanstack/react-router";
import { DocsOgImage } from "@/components/og/soulfire";
import { stripOgSuffix } from "@/lib/og";
import { createOgImageResponse, soulfireLogoDataUri } from "@/lib/og-image";
import { getSource } from "@/lib/source";

export const Route = createFileRoute("/og/docs/{$}/image.webp")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const slugs = params._splat?.split("/").filter(Boolean) ?? [];
        const source = await getSource();
        const page = source.getPage(stripOgSuffix(slugs));

        if (!page) throw notFound();

        return createOgImageResponse(
          <DocsOgImage
            title={page.data.title ?? page.slugs.at(-1) ?? "Docs"}
            description={page.data.description}
            slugs={page.slugs}
            logoSrc={soulfireLogoDataUri}
          />,
        );
      },
    },
  },
});
