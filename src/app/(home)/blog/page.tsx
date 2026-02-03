import Link from "next/link";
import { blogSource } from "@/lib/source";

export default function BlogIndex() {
  const posts = blogSource.getPages().sort((a, b) => {
    const dateA = a.data.date ? new Date(a.data.date).getTime() : 0;
    const dateB = b.data.date ? new Date(b.data.date).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <Link
            key={post.url}
            href={post.url}
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{post.data.title}</h2>
            {post.data.description && (
              <p className="text-muted-foreground mb-4">{post.data.description}</p>
            )}
            <div className="flex gap-4 text-sm text-muted-foreground">
              {post.data.author && <span>By {post.data.author}</span>}
              {post.data.date && (
                <time dateTime={new Date(post.data.date).toISOString()}>
                  {new Date(post.data.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
