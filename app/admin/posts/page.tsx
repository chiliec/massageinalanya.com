import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/sign-out-button";
import PostEditor from "@/components/posts/post-editor";
import { listPosts } from "@/lib/posts";

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

export default async function AdminPostsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?next=/admin/posts");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const userEmail = user.email?.toLowerCase();
  const isAdmin = Boolean(adminEmail && userEmail && userEmail === adminEmail);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
        <main className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Admin access
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Signed in as <span className="font-medium">{user.email ?? "unknown"}</span>.
            Only <span className="font-medium">{adminEmail ?? "the configured admin"}</span>{" "}
            can view this page.
          </p>
          <div className="mt-6">
            <SignOutButton label="Sign out" />
          </div>
        </main>
      </div>
    );
  }

  const posts = await listPosts();

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="w-full max-w-4xl space-y-6">
        <header className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Admin dashboard
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Post editor</h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Signed in as <span className="font-medium">{user.email ?? "unknown"}</span>.
              </p>
            </div>
            <SignOutButton />
          </div>
        </header>

        <PostEditor />

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Published posts</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            These are visible at <span className="font-medium">/posts</span>.
          </p>
          <div className="mt-6 space-y-3">
            {posts.length === 0 ? (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">No posts yet.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-dashed border-zinc-200 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300"
                >
                  <div>
                    <p className="font-medium text-zinc-900 dark:text-zinc-50">{post.title}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {formatDate(post.createdAt)} · /posts/{post.slug}
                    </p>
                  </div>
                  <Link
                    href={`/posts/${post.slug}`}
                    className="text-sm font-semibold text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
                  >
                    View
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
