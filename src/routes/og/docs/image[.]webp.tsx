import { createFileRoute } from "@tanstack/react-router";
import { DocsOgImage } from "@/components/og/soulfire";
import { createOgImageResponse, soulfireLogoDataUri } from "@/lib/og-image";
import { getSource } from "@/lib/source";

export const Route = createFileRoute("/og/docs/image.webp")({
  server: {
    handlers: {
      GET: async () => {
        const source = await getSource();
        const page = source.getPage([]);

        return createOgImageResponse(
          <DocsOgImage
            title={page?.data.title ?? "Docs"}
            description={page?.data.description}
            logoSrc={soulfireLogoDataUri}
          />,
        );
      },
    },
  },
});
