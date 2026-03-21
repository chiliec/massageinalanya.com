"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type GoogleSignInButtonProps = {
  nextPath?: string | null;
};

export default function GoogleSignInButton({
  nextPath,
}: GoogleSignInButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const redirectUrl = new URL("/auth/callback", window.location.origin);

      if (nextPath && nextPath.startsWith("/")) {
        redirectUrl.searchParams.set("next", nextPath);
      }

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl.toString(),
        },
      });

      if (signInError) {
        setError(signInError.message);
      }
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to start Google sign-in."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleSignIn}
        disabled={isLoading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
      >
        {isLoading ? "Redirecting..." : "Continue with Google"}
      </button>
      {error ? (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
