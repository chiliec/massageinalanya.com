import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client with the service-role key — bypasses RLS.
 * Only use this in server-side code (API routes, server components).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. Set it in .env.local."
    );
  }

  return createClient(url, serviceRoleKey);
}
