import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getPostBySlug } from "@/lib/posts";
import PostRenderer from "@/components/posts/post-renderer";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ post_url: string }>;
}) {
  await connection();
  const { post_url } = await params;
  const post = await getPostBySlug(post_url);

  if (!post) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="w-full max-w-3xl space-y-8">
        <nav>
          <Link href="/posts" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
            ← Back to posts
          </Link>
        </nav>

        <header className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
            {formatDate(post.createdAt)}
          </p>
          <h1 className="mt-4 text-3xl font-semibold">{post.title}</h1>
          {post.excerpt ? (
            <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">{post.excerpt}</p>
          ) : null}
        </header>

        <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <PostRenderer content={post.content} />
        </article>
      </main>
    </div>
  );
}
