import { readdir } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const dir = join(process.cwd(), "public", "music");
    const files = await readdir(dir);
    const tracks = files.filter((f) => f.endsWith(".mp3")).map((f) => `/music/${f}`);
    return NextResponse.json(tracks);
  } catch {
    return NextResponse.json([]);
  }
}
