import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GoogleSignInButton from "./google-sign-in-button";
import SignOutButton from "@/components/auth/sign-out-button";

type LoginPageSearchParams = {
  next?: string | string[];
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<LoginPageSearchParams>;
}) {
  const resolvedSearchParams = await searchParams;
  const nextParam = resolvedSearchParams?.next;
  const nextPath = Array.isArray(nextParam) ? nextParam[0] : nextParam;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const userEmail = user?.email?.toLowerCase();
  const isAdmin = Boolean(adminEmail && userEmail && userEmail === adminEmail);

  if (user && isAdmin) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="w-full max-w-lg">
        <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
            Admin access
          </p>
          <h1 className="mt-4 text-3xl font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Only <span className="font-medium">{adminEmail ?? "the configured admin"}</span>{" "}
            can access the admin section.
          </p>

          <div className="mt-8 space-y-4">
            {user && !isAdmin ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
                <p className="text-sm font-medium">This account isn’t allowed.</p>
                <p className="mt-1 text-sm text-amber-800/90 dark:text-amber-100/80">
                  Signed in as {user.email ?? "unknown"}. Please sign out and use the
                  admin account.
                </p>
                <div className="mt-4">
                  <SignOutButton label="Sign out" />
                </div>
              </div>
            ) : (
              <GoogleSignInButton nextPath={nextPath ?? "/admin"} />
            )}
          </div>

          <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-400">
            You’ll be redirected to Google to complete authentication.
          </p>
        </div>
      </main>
    </div>
  );
}
