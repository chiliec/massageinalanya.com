import { readdir, writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";

const MUSIC_DIR = join(process.cwd(), "public", "music");

function sanitizeFilename(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, "_").replace(/\.{2,}/g, "_");
}

export async function GET() {
  try {
    const files = await readdir(MUSIC_DIR);
    const tracks = files.filter((f) => f.endsWith(".mp3")).map((f) => `/music/${f}`);
    return NextResponse.json(tracks);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const formData = await request.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (!file.name.toLowerCase().endsWith(".mp3")) {
    return NextResponse.json({ error: "Only .mp3 files are allowed" }, { status: 400 });
  }

  const safeName = sanitizeFilename(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  await mkdir(MUSIC_DIR, { recursive: true });
  await writeFile(join(MUSIC_DIR, safeName), buffer);

  return NextResponse.json({ path: `/music/${safeName}` });
}

export async function DELETE(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { searchParams } = new URL(request.url);
  const fileName = searchParams.get("file");

  if (!fileName) {
    return NextResponse.json({ error: "File name required" }, { status: 400 });
  }

  const safeName = sanitizeFilename(fileName);
  const filePath = join(MUSIC_DIR, safeName);

  try {
    await unlink(filePath);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
