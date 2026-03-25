"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;

    const params = new URLSearchParams(window.location.search);
    const next = params.get("next") || "/admin";
    const destination = next.startsWith("/") ? next : "/admin";

    const supabase = createClient();

    // createBrowserClient auto-detects the ?code= param and exchanges it.
    // We just listen for the resulting session.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === "SIGNED_IN") {
          subscription.unsubscribe();
          router.replace(destination);
        } else if (event === "INITIAL_SESSION") {
          // If there's already a session (e.g., auto-exchange completed
          // before the listener was attached), check directly.
          supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
              subscription.unsubscribe();
              router.replace(destination);
            }
          });
        }
      }
    );

    // Timeout fallback — if nothing happens in 10s, show error page
    const timeout = setTimeout(() => {
      subscription.unsubscribe();
      router.replace("/auth/auth-code-error");
    }, 10_000);

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-zinc-500">Completing sign-in...</p>
    </div>
  );
}
