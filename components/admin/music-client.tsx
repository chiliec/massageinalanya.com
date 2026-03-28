"use client";

import { useState, useEffect, useRef } from "react";

function trackName(path: string) {
  const name = decodeURIComponent(path.split("/").pop() ?? "");
  return name.replace(/\.mp3$/i, "");
}

export default function MusicClient() {
  const [tracks, setTracks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function fetchTracks() {
    return fetch("/api/music")
      .then((r) => r.json())
      .then((data) => { setTracks(data); setLoading(false); });
  }

  useEffect(() => { fetchTracks(); }, []);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/music", { method: "POST", body: formData });
    if (fileRef.current) fileRef.current.value = "";
    await fetchTracks();
    setUploading(false);
  }

  async function handleDelete(path: string) {
    const fileName = path.split("/").pop();
    if (!fileName) return;
    if (!confirm(`Delete "${trackName(path)}"?`)) return;

    await fetch(`/api/music?file=${encodeURIComponent(fileName)}`, { method: "DELETE" });
    await fetchTracks();
  }

  return (
    <div className="space-y-6">
      {/* Upload */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Upload track</h2>
        <form onSubmit={handleUpload} className="mt-4 flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept=".mp3"
            required
            className="text-sm text-zinc-600 file:mr-3 file:rounded-full file:border-0 file:bg-zinc-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-zinc-700 hover:file:bg-zinc-200"
          />
          <button
            type="submit"
            disabled={uploading}
            className="rounded-2xl bg-zinc-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </section>

      {/* Track list */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-zinc-900">Tracks</h2>

        {loading ? (
          <p className="mt-4 text-sm text-zinc-400">Loading...</p>
        ) : tracks.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">No tracks uploaded yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {tracks.map((path) => (
              <div
                key={path}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-zinc-200 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-zinc-900">
                    {trackName(path)}
                  </p>
                  <audio controls preload="none" className="mt-2 w-full max-w-md">
                    <source src={path} type="audio/mpeg" />
                  </audio>
                </div>
                <button
                  onClick={() => handleDelete(path)}
                  className="text-sm text-red-400 transition hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
