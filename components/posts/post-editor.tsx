"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type EditorJS from "@editorjs/editorjs";
import { ToolConstructable } from "@editorjs/editorjs";
import { slugify } from "@/lib/slug";

type Message = {
  type: "success" | "error";
  text: string;
};

export default function PostEditor() {
  const editorRef = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);

  const slugPreview = useMemo(() => slugify(title), [title]);

  useEffect(() => {
    let isMounted = true;

    const initEditor = async () => {
      if (editorRef.current) return;

      const EditorJSModule = await import("@editorjs/editorjs");
      const HeaderModule = await import("@editorjs/header");
      const ListModule = await import("@editorjs/list");

      if (!isMounted) return;

      const editor = new EditorJSModule.default({
        holder: "post-editor",
        placeholder: "Write your post...",
        tools: {
          header: {
            class: HeaderModule.default as unknown as ToolConstructable,
            inlineToolbar: true,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          list: {
            class: ListModule.default as unknown as ToolConstructable,
            inlineToolbar: true,
          },
        },
      });

      editorRef.current = editor;

      try {
        await editor.isReady;
      } catch {
        return;
      }

      if (isMounted) {
        setMessage(null);
      }
    };

    initEditor();

    return () => {
      isMounted = false;
      editorRef.current?.destroy();
      editorRef.current = null;
    };
  }, []);

  const handleSave = async () => {
    setMessage(null);
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setMessage({ type: "error", text: "Please add a title before saving." });
      return;
    }

    if (!editorRef.current) {
      setMessage({ type: "error", text: "Editor is not ready yet." });
      return;
    }

    setSaving(true);

    try {
      const content = await editorRef.current.save();
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: trimmedTitle,
          content,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorText =
          typeof payload?.error === "string" ? payload.error : "Unable to save the post.";
        setMessage({ type: "error", text: errorText });
        return;
      }

      setMessage({
        type: "success",
        text: `Saved. New post slug: /posts/${payload.post?.slug ?? slugPreview}`,
      });
      setTitle("");
      await editorRef.current.clear();
    } catch {
      setMessage({ type: "error", text: "Something went wrong while saving." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Create a new post</h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Posts are saved locally and published immediately to <span className="font-medium">/posts</span>.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-white dark:text-zinc-900"
        >
          {saving ? "Saving..." : "Save post"}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
            placeholder="Post title"
          />
        </label>

        <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
          Slug preview
          <span className="ml-2 text-zinc-900 dark:text-zinc-100">/posts/{slugPreview}</span>
        </p>

        <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 text-base text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-50">
          <div id="post-editor" />
        </div>
      </div>

      {message ? (
        <p
          className={`mt-6 text-sm ${
            message.type === "success" ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {message.text}
        </p>
      ) : null}
    </section>
  );
}
