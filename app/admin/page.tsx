import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/sign-out-button";
import { isDevMode, isDevAuthenticated } from "@/lib/dev-auth";

export default async function AdminPage() {
  const devAuth = isDevMode() && (await isDevAuthenticated());

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !devAuth) {
    redirect("/auth/login?next=/admin");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const userEmail = user?.email?.toLowerCase();
  const isAdmin = devAuth || Boolean(adminEmail && userEmail && userEmail === adminEmail);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
        <main className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Admin access
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Access denied</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Signed in as <span className="font-medium">{user?.email ?? "unknown"}</span>.
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

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="w-full max-w-4xl space-y-6">
        <header className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Admin dashboard
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Welcome back</h1>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Signed in as <span className="font-medium">{user?.email ?? (devAuth ? "dev-admin" : "unknown")}</span>.
              </p>
            </div>
            {devAuth && !user ? (
              <form action="/auth/dev-logout" method="POST">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:border-black/20 hover:bg-black/5 dark:border-white/20 dark:hover:border-white/30 dark:hover:bg-white/10"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <SignOutButton />
            )}
          </div>
        </header>

        <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-lg font-semibold">Admin tools</h2>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            This section is ready for admin-only controls and content management.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-dashed border-zinc-200 p-4 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              Add booking controls
            </div>
            <a
              href="/admin/posts"
              className="rounded-2xl border border-dashed border-zinc-200 p-4 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-300 dark:hover:border-zinc-700 dark:hover:text-zinc-50"
            >
              Manage blog posts
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
