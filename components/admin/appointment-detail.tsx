"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AutoSaveNotes from "@/components/admin/auto-save-notes";

interface Member {
  id: string;
  name: string;
  contact_type: string;
  contact_value: string;
}

interface Appointment {
  id: string;
  date: string;
  start_time: string;
  duration: number;
  skip_cleanup: boolean;
  notes: string;
  member_id: string | null;
  members: Member | null;
}

type TimerState = "idle" | "running" | "paused" | "ended";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

export default function AppointmentDetail({ appointment }: { appointment: Appointment }) {
  const router = useRouter();
  const defaultSeconds = appointment.duration * 60;

  async function deleteAppointment() {
    if (!confirm("Delete this appointment?")) return;
    await fetch(`/api/appointments?id=${appointment.id}`, { method: "DELETE" });
    router.push("/admin/appointments");
  }

  // Timer — editable hours/minutes before starting
  const [editHours, setEditHours] = useState(Math.floor(defaultSeconds / 3600));
  const [editMinutes, setEditMinutes] = useState(Math.floor((defaultSeconds % 3600) / 60));
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [remaining, setRemaining] = useState(defaultSeconds);
  const [tracks, setTracks] = useState<string[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  function editedTotalSeconds() {
    return editHours * 3600 + editMinutes * 60;
  }

  useEffect(() => {
    fetch("/api/music")
      .then((r) => r.json())
      .then(setTracks);
  }, []);

  function endTimer() {
    clearInterval(intervalRef.current!);
    musicRef.current?.pause();
    setTimerState("ended");
  }

  function startInterval() {
    clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          setTimeout(endTimer, 0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  function start() {
    if (timerState === "idle") {
      setRemaining(editedTotalSeconds());
    }
    if (tracks.length > 0 && !musicRef.current) {
      const track = tracks[Math.floor(Math.random() * tracks.length)];
      const audio = new Audio(track);
      audio.loop = true;
      audio.play().catch(() => {});
      musicRef.current = audio;
    } else {
      musicRef.current?.play().catch(() => {});
    }
    startInterval();
    setTimerState("running");
  }

  function pause() {
    clearInterval(intervalRef.current!);
    musicRef.current?.pause();
    setTimerState("paused");
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current!);
      musicRef.current?.pause();
    };
  }, []);

  function dismiss() {
    musicRef.current?.pause();
    musicRef.current = null;
    clearInterval(intervalRef.current!);
    const total = editedTotalSeconds();
    setRemaining(total);
    setTimerState("idle");
  }

  function reset() {
    clearInterval(intervalRef.current!);
    musicRef.current?.pause();
    musicRef.current = null;
    const total = editedTotalSeconds();
    setRemaining(total);
    setTimerState("idle");
  }

  const saveNotes = useCallback(async (val: string) => {
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appointment.id, notes: val }),
    });
  }, [appointment.id]);

  const isLow = remaining < 60 && timerState === "running";

  return (
    <div className="space-y-6">
      {/* Red overlay when session ends */}
      {timerState === "ended" && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-600"
          onClick={dismiss}
        >
          <p className="text-5xl font-bold text-white">Session ended</p>
          <p className="mt-4 text-xl text-red-200">Tap anywhere to dismiss</p>
          <button
            onClick={dismiss}
            className="mt-10 rounded-2xl bg-white px-12 py-5 text-2xl font-semibold text-red-600 shadow-lg transition hover:bg-red-50"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Appointment info */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Appointment
            </p>
            <h2 className="mt-1 text-2xl font-semibold text-zinc-900">
              {appointment.members?.name ?? (
                <span className="font-normal text-zinc-400">No member assigned</span>
              )}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {appointment.date} · {appointment.start_time.slice(0, 5)} · {appointment.duration} min
              {!appointment.skip_cleanup && " + 15 min cleanup"}
            </p>
            {appointment.members && (
              <p className="mt-0.5 text-sm text-zinc-400">
                {appointment.members.contact_type}: {appointment.members.contact_value}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={deleteAppointment}
              className="text-sm text-red-400 hover:text-red-600"
            >
              Delete
            </button>
            <Link href="/admin/appointments" className="text-sm text-zinc-400 hover:text-zinc-700">
              ← Back
            </Link>
          </div>
        </div>
      </section>

      {/* Timer */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
          Session timer
        </p>

        {timerState === "idle" ? (
          <div className="mt-6 flex items-center justify-center gap-1">
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = Math.max(0, Math.min(23, parseInt(e.currentTarget.textContent || "0", 10) || 0));
                setEditHours(v);
                e.currentTarget.textContent = pad(v);
                setRemaining(v * 3600 + editMinutes * 60);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
              }}
              className="inline-block min-w-[1ch] font-mono text-8xl font-bold text-zinc-900 outline-none sm:text-9xl"
            >
              {pad(editHours)}
            </span>
            <span className="font-mono text-8xl font-bold text-zinc-300 sm:text-9xl">:</span>
            <span
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => {
                const v = Math.max(0, Math.min(59, parseInt(e.currentTarget.textContent || "0", 10) || 0));
                setEditMinutes(v);
                e.currentTarget.textContent = pad(v);
                setRemaining(editHours * 3600 + v * 60);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") { e.preventDefault(); e.currentTarget.blur(); }
              }}
              className="inline-block min-w-[1ch] font-mono text-8xl font-bold text-zinc-900 outline-none sm:text-9xl"
            >
              {pad(editMinutes)}
            </span>
          </div>
        ) : (
          <div
            className={`mt-6 font-mono text-8xl font-bold tabular-nums transition-colors sm:text-9xl ${
              isLow ? "text-red-500" : "text-zinc-900"
            }`}
          >
            {formatTime(remaining)}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-3">
          {timerState === "idle" && (
            <button
              onClick={start}
              disabled={editedTotalSeconds() === 0}
              className="rounded-2xl bg-zinc-900 px-12 py-4 text-xl font-semibold text-white transition hover:bg-zinc-700 disabled:opacity-40"
            >
              Start
            </button>
          )}

          {timerState === "running" && (
            <button
              onClick={pause}
              className="rounded-2xl border border-zinc-200 px-12 py-4 text-xl font-semibold text-zinc-900 transition hover:bg-zinc-50"
            >
              Pause
            </button>
          )}

          {timerState === "paused" && (
            <>
              <button
                onClick={start}
                className="rounded-2xl bg-zinc-900 px-12 py-4 text-xl font-semibold text-white transition hover:bg-zinc-700"
              >
                Resume
              </button>
              <button
                onClick={reset}
                className="rounded-2xl border border-zinc-200 px-5 py-4 text-sm text-zinc-500 transition hover:bg-zinc-50"
              >
                Reset
              </button>
            </>
          )}
        </div>

        {timerState === "running" && (
          <p className="mt-4 text-xs text-zinc-400">Music playing</p>
        )}
        {timerState === "paused" && (
          <p className="mt-4 text-xs text-zinc-400">Paused</p>
        )}
      </section>

      {/* Notes */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <AutoSaveNotes
          label="Session notes"
          value={appointment.notes}
          placeholder="Notes for this session…"
          rows={4}
          onSave={saveNotes}
        />
      </section>
    </div>
  );
}
