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

    async function handleCallback() {
      const supabase = createClient();
      const code = params.get("code");

      if (code) {
        // Try explicit exchange first
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          router.replace(destination);
          return;
        }
      }

      // If explicit exchange failed (code already consumed by auto-exchange)
      // or no code present, check if a session exists anyway.
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.replace(destination);
        return;
      }

      router.replace("/auth/auth-code-error");
    }

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-zinc-500">Completing sign-in...</p>
    </div>
  );
}
