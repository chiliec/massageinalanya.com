"use client";

export default function DevLoginButton() {
  return (
    <form action="/auth/dev-login" method="POST">
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-dashed border-amber-400 px-4 py-3 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
      >
        Dev Login (skip Google)
      </button>
    </form>
  );
}
