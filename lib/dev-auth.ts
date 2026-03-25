import { cookies } from "next/headers";

export const DEV_ADMIN_COOKIE = "dev-admin-session";

export function isDevMode() {
  return process.env.NODE_ENV === "development";
}

export async function isDevAuthenticated(): Promise<boolean> {
  if (!isDevMode()) return false;
  const cookieStore = await cookies();
  return cookieStore.get(DEV_ADMIN_COOKIE)?.value === "true";
}
