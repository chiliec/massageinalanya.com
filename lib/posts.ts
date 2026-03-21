import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { slugify } from "@/lib/slug";

export type EditorBlock = {
  id?: string;
  type: string;
  data: Record<string, unknown>;
};

export type EditorContent = {
  time?: number;
  blocks: EditorBlock[];
  version?: string;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: EditorContent;
  createdAt: string;
  updatedAt: string;
};

const DEFAULT_POSTS_PATH = path.join(process.cwd(), "data", "posts.json");

function getPostsPath() {
  const override = process.env.POSTS_FILE_PATH?.trim();
  if (override) {
    return path.isAbsolute(override) ? override : path.join(process.cwd(), override);
  }
  return DEFAULT_POSTS_PATH;
}

async function ensurePostsFile() {
  const postsPath = getPostsPath();
  await fs.mkdir(path.dirname(postsPath), { recursive: true });
  try {
    await fs.access(postsPath);
  } catch {
    await fs.writeFile(postsPath, "[]", "utf8");
  }
}

async function readPosts(): Promise<Post[]> {
  await ensurePostsFile();
  const raw = await fs.readFile(getPostsPath(), "utf8");
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as Post[]) : [];
  } catch {
    return [];
  }
}

async function writePosts(posts: Post[]) {
  await ensurePostsFile();
  await fs.writeFile(getPostsPath(), JSON.stringify(posts, null, 2), "utf8");
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "");
}

function buildExcerpt(content: EditorContent, limit = 160) {
  const pieces: string[] = [];
  for (const block of content.blocks ?? []) {
    if (block.type === "paragraph" || block.type === "header") {
      const text = typeof block.data.text === "string" ? block.data.text : "";
      if (text) pieces.push(stripHtml(text));
    }
    if (block.type === "list") {
      const items = Array.isArray(block.data.items) ? block.data.items : [];
      for (const item of items) {
        if (typeof item === "string") pieces.push(stripHtml(item));
      }
    }
    if (pieces.join(" ").length >= limit) break;
  }

  const merged = pieces.join(" ").replace(/\s+/g, " ").trim();
  if (merged.length <= limit) return merged;
  return `${merged.slice(0, limit).trimEnd()}…`;
}

function ensureUniqueSlug(baseSlug: string, existing: Set<string>) {
  let slug = baseSlug || "post";
  let counter = 2;
  while (existing.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
  return slug;
}

export async function listPosts() {
  const posts = await readPosts();
  return posts.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getPostBySlug(slug: string) {
  const posts = await readPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function createPost({
  title,
  content,
}: {
  title: string;
  content: EditorContent;
}) {
  const posts = await readPosts();
  const existingSlugs = new Set(posts.map((post) => post.slug));
  const baseSlug = slugify(title);
  const slug = ensureUniqueSlug(baseSlug, existingSlugs);
  const now = new Date().toISOString();

  const post: Post = {
    id: randomUUID(),
    title,
    slug,
    excerpt: buildExcerpt(content),
    content,
    createdAt: now,
    updatedAt: now,
  };

  await writePosts([post, ...posts]);
  return post;
}
