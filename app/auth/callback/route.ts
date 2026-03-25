import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";

  if (!next.startsWith("/")) {
    next = "/";
  }

  // Build the redirect base URL — prefer x-forwarded-host in production
  // so the redirect goes to the real domain, not the internal origin.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";
  let baseUrl = origin;
  if (!isLocalEnv && forwardedHost) {
    baseUrl = `https://${forwardedHost}`;
  }

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error) {
        return NextResponse.redirect(`${baseUrl}${next}`);
      }

      console.error("[auth/callback] exchangeCodeForSession error:", error.message);
    } catch (err) {
      console.error("[auth/callback] Unexpected error:", err);
    }
  }

  return NextResponse.redirect(`${baseUrl}/auth/auth-code-error`);
}
