import {blog, docs} from "fumadocs-mdx:collections/server";
import {loader, multiple} from "fumadocs-core/source";
import {toFumadocsSource} from "fumadocs-mdx/runtime/server";
import {openapiPlugin, openapiSource} from "fumadocs-openapi/server";
import {openapi} from "@/lib/docs/openapi";
import {lucideIconsPlugin} from "fumadocs-core/source/lucide-icons";

export const source = loader(
  multiple({
    docs: docs.toFumadocsSource(),
    openapi: await openapiSource(openapi, {
      baseDir: "openapi/(generated)",
      groupBy: "tag",
    }),
  }),
  {
    baseUrl: "/docs",
    plugins: [lucideIconsPlugin(), openapiPlugin()],
  },
);

export const blogSource = loader({
  baseUrl: "/blog",
  source: toFumadocsSource(blog, []),
});
