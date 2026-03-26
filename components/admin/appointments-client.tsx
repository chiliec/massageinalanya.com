"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Member {
  id: string;
  name: string;
}

interface Appointment {
  id: string;
  member_id: string | null;
  date: string;
  start_time: string;
  duration: number;
  skip_cleanup: boolean;
  notes: string;
  members: { name: string } | null;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function shiftDay(dateStr: string, delta: number) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + delta);
  return d.toISOString().slice(0, 10);
}

function displayDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AppointmentsClient() {
  const [date, setDate] = useState(todayStr());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  // Dialog
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState({
    start_time: "09:00",
    duration: 60,
    member_id: "",
    skip_cleanup: false,
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  async function loadAppointments() {
    setLoading(true);
    const res = await fetch(`/api/appointments?date=${date}`);
    const data = await res.json();
    setAppointments(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function loadMembers() {
    const res = await fetch("/api/members");
    const data = await res.json();
    setMembers(Array.isArray(data) ? data : []);
  }

  // eslint-disable-next-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps
  useEffect(() => { loadAppointments(); }, [date]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadMembers(); }, []);

  async function create() {
    setSaving(true);
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        start_time: form.start_time,
        duration: form.duration,
        member_id: form.member_id || null,
        skip_cleanup: form.skip_cleanup,
        notes: form.notes,
      }),
    });
    setSaving(false);
    setDialog(false);
    setForm({ start_time: "09:00", duration: 60, member_id: "", skip_cleanup: false, notes: "" });
    loadAppointments();
  }

  async function remove(id: string) {
    if (!confirm("Delete this appointment?")) return;
    await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
    loadAppointments();
  }

  function openDialog() {
    setForm({ start_time: "09:00", duration: 60, member_id: "", skip_cleanup: false, notes: "" });
    setDialog(true);
  }

  return (
    <div className="space-y-6">
      {/* Date nav */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => setDate(shiftDay(date, -1))}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50"
          >
            ←
          </button>
          <div className="flex-1 text-center">
            <p className="text-sm font-medium text-zinc-900">{displayDate(date)}</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 text-xs text-zinc-400 outline-none"
            />
          </div>
          <button
            onClick={() => setDate(shiftDay(date, 1))}
            className="rounded-xl border border-zinc-200 px-4 py-2 text-sm hover:bg-zinc-50"
          >
            →
          </button>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setDate(todayStr())}
            className="text-xs text-zinc-400 hover:text-zinc-700"
          >
            Today
          </button>
          <button
            onClick={openDialog}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            + Add appointment
          </button>
        </div>
      </section>

      {/* Appointments */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-zinc-700">
          {loading
            ? "Loading…"
            : `${appointments.length} appointment${appointments.length !== 1 ? "s" : ""}`}
        </h2>

        {!loading && appointments.length === 0 ? (
          <p className="text-sm text-zinc-400">No appointments on this day.</p>
        ) : (
          <div className="space-y-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center gap-4 rounded-2xl border border-zinc-100 p-4"
              >
                <div className="min-w-[56px] text-center">
                  <p className="font-mono text-lg font-semibold text-zinc-900">
                    {apt.start_time.slice(0, 5)}
                  </p>
                  <p className="text-xs text-zinc-400">{apt.duration} min</p>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-900">
                    {apt.members?.name ?? (
                      <span className="font-normal text-zinc-400">No member</span>
                    )}
                  </p>
                  {apt.notes && (
                    <p className="mt-0.5 truncate text-xs text-zinc-500">{apt.notes}</p>
                  )}
                  {!apt.skip_cleanup && (
                    <p className="text-xs text-zinc-400">+ 15 min cleanup</p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/admin/appointments/${apt.id}`}
                    className="rounded-xl border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => remove(apt.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Dialog */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
            <h2 className="mb-5 text-lg font-semibold">New appointment</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Time</label>
                <input
                  type="time"
                  value={form.start_time}
                  onChange={(e) => setForm((f) => ({ ...f, start_time: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-500">Duration</label>
                <div className="flex gap-2">
                  {[60, 90].map((d) => (
                    <button
                      key={d}
                      onClick={() => setForm((f) => ({ ...f, duration: d }))}
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                        form.duration === d
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 text-zinc-700 hover:bg-zinc-50"
                      }`}
                    >
                      {d} min
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-500">Member</label>
                <select
                  value={form.member_id}
                  onChange={(e) => setForm((f) => ({ ...f, member_id: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                >
                  <option value="">No member</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-zinc-500">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  rows={2}
                  placeholder="Optional…"
                  className="w-full resize-none rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                />
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
                <input
                  type="checkbox"
                  checked={form.skip_cleanup}
                  onChange={(e) => setForm((f) => ({ ...f, skip_cleanup: e.target.checked }))}
                />
                Skip 15 min cleanup
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDialog(false)}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={create}
                disabled={saving}
                className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
              >
                {saving ? "Saving…" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
