import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEV_ADMIN_COOKIE } from "@/lib/dev-auth";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const cookieStore = await cookies();
  cookieStore.set(DEV_ADMIN_COOKIE, "true", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return NextResponse.redirect(new URL("/admin", "http://localhost:3000"));
}
