import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDevAuthenticated, isDevMode } from "@/lib/dev-auth";

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

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const userEmail = user?.email?.toLowerCase();
  const isAdmin =
    devAuth || Boolean(adminEmail && userEmail && adminEmail === userEmail);

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null; // authorized
}
