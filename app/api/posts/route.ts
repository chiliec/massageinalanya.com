import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPost } from "@/lib/posts";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const userEmail = user.email?.toLowerCase();
  const isAdmin = Boolean(adminEmail && userEmail && adminEmail === userEmail);

  if (!adminEmail) {
    return NextResponse.json({ error: "ADMIN_EMAIL is not configured." }, { status: 500 });
  }

  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { title, content } = payload as { title?: string; content?: unknown };
  const trimmedTitle = title?.trim() ?? "";

  if (!trimmedTitle) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  if (!content || typeof content !== "object") {
    return NextResponse.json({ error: "Content is required." }, { status: 400 });
  }

  if (!Array.isArray((content as { blocks?: unknown }).blocks)) {
    return NextResponse.json({ error: "Content blocks are required." }, { status: 400 });
  }

  const post = await createPost({
    title: trimmedTitle,
    content: content as { blocks: unknown[] },
  });

  return NextResponse.json({ post });
}
