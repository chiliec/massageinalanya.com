"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface AutoSaveNotesProps {
  label: string;
  value: string;
  placeholder?: string;
  rows?: number;
  onSave: (value: string) => Promise<void>;
}

/**
 * Use a `key` prop on this component to force remount when the value source changes.
 * Autosaves on blur and after 1.5s of inactivity.
 */
export default function AutoSaveNotes({
  label,
  value: initialValue,
  placeholder = "Write notes…",
  rows = 3,
  onSave,
}: AutoSaveNotesProps) {
  const [text, setText] = useState(initialValue);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textRef = useRef(initialValue);
  const savedRef = useRef(initialValue);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  const save = useCallback(async () => {
    const val = textRef.current;
    if (val === savedRef.current) return;
    setStatus("saving");
    await onSave(val);
    savedRef.current = val;
    setStatus("saved");
    setTimeout(() => setStatus((s) => (s === "saved" ? "idle" : s)), 2000);
  }, [onSave]);

  function handleChange(val: string) {
    setText(val);
    setStatus("idle");
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 1500);
  }

  function handleBlur() {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    save();
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs text-zinc-400">{label}</label>
        {status === "saving" && <span className="text-xs text-zinc-400">Saving…</span>}
        {status === "saved" && <span className="text-xs text-green-600">Saved</span>}
      </div>
      <textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={handleBlur}
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
      />
    </div>
  );
}
