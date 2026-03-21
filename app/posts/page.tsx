import Link from "next/link";
import { connection } from "next/server";
import { listPosts } from "@/lib/posts";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export default async function PostsPage() {
  await connection();
  const posts = await listPosts();

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="w-full max-w-4xl space-y-8">
        <header className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Blog</p>
          <h1 className="mt-4 text-3xl font-semibold">Posts</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Fresh updates and stories from the studio.
          </p>
        </header>

        <section className="space-y-4">
          {posts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-8 text-sm text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              No posts yet. Check back soon.
            </div>
          ) : (
            posts.map((post) => (
              <article
                key={post.id}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  {formatDate(post.createdAt)}
                </p>
                <h2 className="mt-3 text-2xl font-semibold">
                  <Link href={`/posts/${post.slug}`} className="hover:text-zinc-600 dark:hover:text-zinc-300">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt ? (
                  <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">{post.excerpt}</p>
                ) : null}
                <div className="mt-4">
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-sm font-semibold text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
                  >
                    Read more
                  </Link>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
