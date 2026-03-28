import { NextResponse } from "next/server";
import { createPost, type EditorContent } from "@/lib/posts";
import { requireAdmin } from "@/lib/admin-auth";

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
  const denied = await requireAdmin();
  if (denied) return denied;

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
