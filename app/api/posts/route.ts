import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createPost, type EditorContent } from "@/lib/posts";
import { isDevAuthenticated, isDevMode } from "@/lib/dev-auth";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isEditorContent(value: unknown): value is EditorContent {
  if (!isRecord(value)) return false;
  const blocks = value.blocks;
  if (!Array.isArray(blocks)) return false;
  return blocks.every((block) => {
    if (!isRecord(block)) return false;
    if (typeof block.type !== "string") return false;
    return isRecord(block.data);
  });
}

export async function POST(request: Request) {
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
  const isAdmin = devAuth || Boolean(adminEmail && userEmail && adminEmail === userEmail);

  if (!adminEmail && !devAuth) {
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

  if (!isEditorContent(content)) {
    return NextResponse.json({ error: "Content blocks are required." }, { status: 400 });
  }

  const post = await createPost({
    title: trimmedTitle,
    content,
  });

  return NextResponse.json({ post });
}
