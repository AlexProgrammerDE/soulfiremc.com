import { blogSource } from "@/lib/source";

export function GET() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://soulfiremc.com";

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>SoulFire Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Latest updates, tutorials, and insights from the SoulFire team</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml" />
    ${posts
      .map((post) => {
        const pubDate = post.data.date
          ? new Date(post.data.date).toUTCString()
          : new Date().toUTCString();

        return `
    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${siteUrl}${post.url}</link>
      <guid isPermaLink="true">${siteUrl}${post.url}</guid>
      <description><![CDATA[${post.data.description || ""}]]></description>
      <pubDate>${pubDate}</pubDate>
      ${post.data.author ? `<author>${post.data.author}</author>` : ""}
      ${post.data.tags?.map((tag) => `<category>${tag}</category>`).join("\n      ") || ""}
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
