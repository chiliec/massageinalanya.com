import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900 dark:bg-black dark:text-zinc-50">
      <main className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
          Authentication
        </p>
        <h1 className="mt-4 text-2xl font-semibold">We couldn’t sign you in</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          The Google sign-in flow didn’t complete successfully. Please try again.
        </p>
        <Link
          href="/auth/login"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Back to login
        </Link>
      </main>
    </div>
  );
}
