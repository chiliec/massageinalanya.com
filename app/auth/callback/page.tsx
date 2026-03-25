"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const exchanged = useRef(false);

  useEffect(() => {
    if (exchanged.current) return;
    exchanged.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const next = params.get("next") || "/admin";

    if (!code) {
      router.replace("/auth/auth-code-error");
      return;
    }

    const supabase = createClient();
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.error("[auth/callback] exchange error:", error.message);
        router.replace("/auth/auth-code-error");
      } else {
        router.replace(next.startsWith("/") ? next : "/admin");
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-zinc-500">Completing sign-in...</p>
    </div>
  );
}
