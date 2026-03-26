"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

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

type TimerState = "idle" | "running" | "paused" | "ended" | "alarm";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${pad(m)}:${pad(s)}`;
}

export default function AppointmentDetail({ appointment }: { appointment: Appointment }) {
  const totalSeconds = appointment.duration * 60;

  const [notes, setNotes] = useState(appointment.notes);
  const [notesSaved, setNotesSaved] = useState(false);

  // Timer
  const [timerState, setTimerState] = useState<TimerState>("idle");
  const [remaining, setRemaining] = useState(totalSeconds);
  const [tracks, setTracks] = useState<string[]>([]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const alarmTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch("/api/music")
      .then((r) => r.json())
      .then(setTracks);
  }, []);

  function endTimer() {
    clearInterval(intervalRef.current!);
    musicRef.current?.pause();
    setTimerState("ended");

    // Alarm fires after 60 s of no action
    alarmTimeoutRef.current = setTimeout(() => {
      const alarm = new Audio("/alarm.mp3");
      alarm.loop = true;
      alarm.play().catch(() => {});
      alarmRef.current = alarm;
      setTimerState("alarm");
    }, 60_000);
  }

  function startInterval() {
    clearInterval(intervalRef.current!);
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current!);
          // defer so we're not calling setState inside setState
          setTimeout(endTimer, 0);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  }

  function start() {
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
      clearTimeout(alarmTimeoutRef.current!);
      musicRef.current?.pause();
      alarmRef.current?.pause();
    };
  }, []);

  function dismiss() {
    clearTimeout(alarmTimeoutRef.current!);
    alarmRef.current?.pause();
    alarmRef.current = null;
    musicRef.current?.pause();
    musicRef.current = null;
    clearInterval(intervalRef.current!);
    setRemaining(totalSeconds);
    setTimerState("idle");
  }

  function reset() {
    clearInterval(intervalRef.current!);
    clearTimeout(alarmTimeoutRef.current!);
    musicRef.current?.pause();
    musicRef.current = null;
    alarmRef.current?.pause();
    alarmRef.current = null;
    setRemaining(totalSeconds);
    setTimerState("idle");
  }

  async function saveNotes() {
    await fetch("/api/appointments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: appointment.id, notes }),
    });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  const isEnded = timerState === "ended" || timerState === "alarm";
  const isLow = remaining < 60 && timerState === "running";

  return (
    <div className="space-y-6">
      {/* Red overlay when session ends */}
      {isEnded && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-600"
          onClick={dismiss}
        >
          <p className="text-5xl font-bold text-white">Session ended</p>
          <p className="mt-4 text-xl text-red-200">
            {timerState === "alarm" ? "Alarm playing!" : "Tap to dismiss (alarm in 1 min)"}
          </p>
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
          <Link href="/admin/appointments" className="text-sm text-zinc-400 hover:text-zinc-700">
            ← Back
          </Link>
        </div>
      </section>

      {/* Timer */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
          Session timer
        </p>

        <div
          className={`mt-6 font-mono text-9xl font-bold tabular-nums transition-colors ${
            isLow ? "text-red-500" : "text-zinc-900"
          }`}
        >
          {formatTime(remaining)}
        </div>

        <p className="mt-2 text-sm text-zinc-400">{appointment.duration} min session</p>

        <div className="mt-8 flex items-center justify-center gap-3">
          {timerState === "idle" && (
            <button
              onClick={start}
              className="rounded-2xl bg-zinc-900 px-12 py-4 text-xl font-semibold text-white transition hover:bg-zinc-700"
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
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-700">Session notes</h3>
          {notesSaved && <span className="text-xs text-green-600">Saved</span>}
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Notes for this session…"
          className="w-full resize-none rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={saveNotes}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Save notes
          </button>
        </div>
      </section>
    </div>
  );
}
