import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { DEV_ADMIN_COOKIE } from "@/lib/dev-auth";

export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const cookieStore = await cookies();
  cookieStore.delete(DEV_ADMIN_COOKIE);

  return NextResponse.redirect(new URL("/auth/login", "http://localhost:3000"));
}
