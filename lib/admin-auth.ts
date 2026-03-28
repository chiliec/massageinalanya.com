import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDevAuthenticated, isDevMode } from "@/lib/dev-auth";

/**
 * Check whether an email belongs to a configured admin.
 * Reads ADMIN_EMAILS (comma-separated) with fallback to ADMIN_EMAIL.
 */
export function isAdminEmail(email: string | undefined | null): boolean {
  const raw = process.env.ADMIN_EMAILS ?? process.env.ADMIN_EMAIL ?? "";
  if (!raw || !email) return false;
  const allowed = raw.split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return allowed.includes(email.toLowerCase());
}

/**
 * Check if the current request is from an admin user.
 * Returns null if authorized, or a NextResponse error if not.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const devAuth = isDevMode() && (await isDevAuthenticated());

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !devAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = devAuth || isAdminEmail(user?.email);

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null; // authorized
}
