import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/posts/route";
import { listPosts } from "@/lib/posts";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

type MockUser = { email?: string } | null;

let mockUser: MockUser = null;

vi.mock("@/lib/supabase/server", () => ({
  createClient: async () => ({
    auth: {
      getUser: async () => ({ data: { user: mockUser } }),
    },
  }),
}));

async function createTempPostsFile() {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "blog-posts-"));
  const filePath = path.join(dir, "posts.json");
  await fs.writeFile(filePath, "[]", "utf8");
  return filePath;
}

beforeEach(async () => {
  process.env.ADMIN_EMAILS = "admin@example.com";
  process.env.POSTS_FILE_PATH = await createTempPostsFile();
  mockUser = null;
});

describe("POST /api/posts", () => {
  it("returns 401 when unauthenticated", async () => {
    mockUser = null;
    const request = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Hello", content: { blocks: [] } }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Unauthorized");
  });

  it("returns 403 when user is not admin", async () => {
    mockUser = { email: "user@example.com" };
    const request = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Hello", content: { blocks: [] } }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(403);
    expect(payload.error).toBe("Forbidden");
  });

  it("publishes a post for admin and persists it", async () => {
    mockUser = { email: "admin@example.com" };
    const request = new Request("http://localhost/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Şifa Günlüğü",
        content: {
          blocks: [
            {
              type: "paragraph",
              data: { text: "First entry." },
            },
          ],
        },
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.post.slug).toBe("sifa-gunlugu");

    const posts = await listPosts();
    expect(posts).toHaveLength(1);
    expect(posts[0].title).toBe("Şifa Günlüğü");
    expect(posts[0].slug).toBe("sifa-gunlugu");
  });
});
