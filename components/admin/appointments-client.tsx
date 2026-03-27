"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

type ContactType = "phone" | "telegram" | "whatsapp" | "instagram" | "other";

const CONTACT_TYPES: ContactType[] = ["phone", "telegram", "whatsapp", "instagram", "other"];

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

// --- helpers ---

const WORK_START = 9;
const WORK_END = 21;
const ALL_HOURS = Array.from({ length: 24 }, (_, i) => i);

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

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Convert "HH:MM" or "HH:MM:SS" to minutes since midnight */
function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

/** Check if two time ranges overlap.
 *  Conflict means the NEW appointment's session+cleanup overlaps with an
 *  existing appointment's session (not its cleanup).
 *  Cleanup is buffer time — another appointment CAN start during cleanup. */
function hasConflict(
  newStart: number,
  newSessionEnd: number,
  existingStart: number,
  existingSessionEnd: number,
) {
  // New session overlaps existing session?
  return newStart < existingSessionEnd && existingStart < newSessionEnd;
}

/** Find conflicts between a proposed slot and existing appointments */
function findConflicts(
  startTime: string,
  duration: number,
  appointments: Appointment[],
  excludeId?: string,
) {
  const newStart = timeToMinutes(startTime);
  const newEnd = newStart + duration; // only session time, not cleanup

  return appointments.filter((apt) => {
    if (excludeId && apt.id === excludeId) return false;
    const aptStart = timeToMinutes(apt.start_time);
    const aptEnd = aptStart + apt.duration; // only session time
    return hasConflict(newStart, newEnd, aptStart, aptEnd);
  });
}

const NEW_MEMBER_VALUE = "__new__";

// --- component ---

export default function AppointmentsClient() {
  const [date, setDate] = useState(todayStr());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  // Show early/late hours
  const [showEarly, setShowEarly] = useState(false);
  const [showLate, setShowLate] = useState(false);

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

  // Inline new member fields
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberContactType, setNewMemberContactType] = useState<ContactType>("phone");
  const [newMemberContactValue, setNewMemberContactValue] = useState("");

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
    let memberId = form.member_id;

    // Create new member first if needed
    if (memberId === NEW_MEMBER_VALUE) {
      if (!newMemberName.trim()) return;
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newMemberName.trim(),
          contact_type: newMemberContactType,
          contact_value: newMemberContactValue.trim(),
        }),
      });
      const created = await res.json();
      if (!created?.id) return;
      memberId = created.id;
      loadMembers();
    }

    if (!memberId || memberId === NEW_MEMBER_VALUE) return;

    setSaving(true);
    await fetch("/api/appointments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        start_time: form.start_time,
        duration: form.duration,
        member_id: memberId,
        skip_cleanup: form.skip_cleanup,
        notes: form.notes,
      }),
    });
    setSaving(false);
    closeDialog();
    loadAppointments();
  }

  async function remove(id: string) {
    if (!confirm("Delete this appointment?")) return;
    await fetch(`/api/appointments?id=${id}`, { method: "DELETE" });
    loadAppointments();
  }

  function openDialogAt(hour: number) {
    // Find the best start time: after the latest appointment+cleanup that overlaps this hour
    const slotStart = hour * 60;
    let bestStart = slotStart;

    for (const apt of appointments) {
      const aptStart = timeToMinutes(apt.start_time);
      const aptTotalEnd = aptStart + apt.duration + (apt.skip_cleanup ? 0 : 15);
      // If this appointment's total time (session+cleanup) extends into this hour
      if (aptTotalEnd > slotStart && aptStart < slotStart + 60) {
        bestStart = Math.max(bestStart, aptTotalEnd);
      }
    }

    const h = Math.floor(bestStart / 60);
    const m = bestStart % 60;

    setForm({
      start_time: `${pad(h)}:${pad(m)}`,
      duration: 60,
      member_id: "",
      skip_cleanup: false,
      notes: "",
    });
    setNewMemberName("");
    setNewMemberContactType("phone");
    setNewMemberContactValue("");
    setDialog(true);
  }

  function closeDialog() {
    setDialog(false);
    setForm({ start_time: "09:00", duration: 60, member_id: "", skip_cleanup: false, notes: "" });
    setNewMemberName("");
    setNewMemberContactType("phone");
    setNewMemberContactValue("");
  }

  // Conflict detection for the dialog form
  const dialogConflicts = useMemo(
    () => findConflicts(form.start_time, form.duration, appointments),
    [form.start_time, form.duration, appointments],
  );

  const isNewMember = form.member_id === NEW_MEMBER_VALUE;
  const hasConflicts = dialogConflicts.length > 0;
  const canCreate =
    !hasConflicts &&
    (isNewMember ? newMemberName.trim().length > 0 : form.member_id.length > 0);

  // Workload counts for the week strip
  const [dayCounts, setDayCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const from = shiftDay(date, -3);
    const to = shiftDay(date, 3);
    fetch(`/api/appointments?from=${from}&to=${to}`)
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data === "object" && !Array.isArray(data)) setDayCounts(data);
      });
  }, [date]);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => shiftDay(date, i - 3));
  }, [date]);

  // Which hours to show
  const earlyHours = ALL_HOURS.filter((h) => h < WORK_START);
  const workHours = ALL_HOURS.filter((h) => h >= WORK_START && h < WORK_END);
  const lateHours = ALL_HOURS.filter((h) => h >= WORK_END);

  // Check if any appointments exist in early/late hours
  const hasEarlyApts = appointments.some((apt) => timeToMinutes(apt.start_time) < WORK_START * 60);
  const hasLateApts = appointments.some((apt) => timeToMinutes(apt.start_time) >= WORK_END * 60);

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
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setDate(todayStr())}
            className="text-xs text-zinc-400 hover:text-zinc-700"
          >
            Today
          </button>
        </div>

        {/* Week strip with workload indicators */}
        <div className="mt-4 grid grid-cols-7 gap-1">
          {weekDays.map((d) => {
            const count = dayCounts[d] || 0;
            const isSelected = d === date;
            const isToday = d === todayStr();
            const dayLabel = new Date(d + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
            const dayNum = new Date(d + "T12:00:00").getDate();

            return (
              <button
                key={d}
                onClick={() => setDate(d)}
                className={`flex flex-col items-center rounded-xl py-1.5 text-xs transition ${
                  isSelected
                    ? "bg-zinc-900 text-white"
                    : isToday
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-500 hover:bg-zinc-50"
                }`}
              >
                <span className="text-[10px] font-medium uppercase">{dayLabel}</span>
                <span className="font-semibold">{dayNum}</span>
                <div className="mt-0.5 flex gap-0.5">
                  {Array.from({ length: count }, (_, i) => (
                    <span
                      key={i}
                      className={`inline-block h-1 w-1 rounded-full ${
                        isSelected ? "bg-white/60" : "bg-zinc-900"
                      }`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Timeline */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-zinc-700">
          {loading
            ? "Loading…"
            : `Timeline · ${appointments.length} appointment${appointments.length !== 1 ? "s" : ""}`}
        </h2>

        <div className="relative">
          {/* Early hours toggle */}
          {!showEarly && (
            <button
              onClick={() => setShowEarly(true)}
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 py-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-800"
            >
              Show 00:00–{pad(WORK_START)}:00
              {hasEarlyApts && <span className="rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">{appointments.filter((a) => timeToMinutes(a.start_time) < WORK_START * 60).length}</span>}
            </button>
          )}

          {/* Early hours */}
          {showEarly && (
            <>
              {earlyHours.map((hour) => (
                <TimelineSlot
                  key={hour}
                  hour={hour}
                  appointments={appointments}
                  onClickSlot={openDialogAt}
                  onDelete={remove}
                />
              ))}
              <button
                onClick={() => setShowEarly(false)}
                className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 py-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-800"
              >
                Hide early hours
              </button>
            </>
          )}

          {/* Work hours (always visible) */}
          {workHours.map((hour) => (
            <TimelineSlot
              key={hour}
              hour={hour}
              appointments={appointments}
              onClickSlot={openDialogAt}
              onDelete={remove}
            />
          ))}

          {/* Late hours toggle */}
          {!showLate && (
            <button
              onClick={() => setShowLate(true)}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 py-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-800"
            >
              Show {pad(WORK_END)}:00–00:00
              {hasLateApts && <span className="rounded-full bg-zinc-900 px-1.5 py-0.5 text-[10px] font-semibold text-white">{appointments.filter((a) => timeToMinutes(a.start_time) >= WORK_END * 60).length}</span>}
            </button>
          )}

          {/* Late hours */}
          {showLate && (
            <>
              {lateHours.map((hour) => (
                <TimelineSlot
                  key={hour}
                  hour={hour}
                  appointments={appointments}
                  onClickSlot={openDialogAt}
                  onDelete={remove}
                />
              ))}
              <button
                onClick={() => setShowLate(false)}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-50 py-2.5 text-xs font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-800"
              >
                Hide late hours
              </button>
            </>
          )}
        </div>
      </section>

      {/* Dialog */}
      {dialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
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
                <label className="mb-1 block text-xs text-zinc-500">Member *</label>
                <select
                  value={form.member_id}
                  onChange={(e) => setForm((f) => ({ ...f, member_id: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                >
                  <option value="">Select member…</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                  <option value={NEW_MEMBER_VALUE}>+ New member</option>
                </select>
              </div>

              {/* Inline new member fields */}
              {isNewMember && (
                <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
                  <p className="text-xs font-semibold text-zinc-500">New member</p>
                  <input
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    placeholder="Name *"
                    className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                  />
                  <div className="flex gap-2">
                    <select
                      value={newMemberContactType}
                      onChange={(e) => setNewMemberContactType(e.target.value as ContactType)}
                      className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                    >
                      {CONTACT_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <input
                      value={newMemberContactValue}
                      onChange={(e) => setNewMemberContactValue(e.target.value)}
                      placeholder="Contact value"
                      className="flex-1 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-400"
                    />
                  </div>
                </div>
              )}

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

              {/* Conflict warning */}
              {dialogConflicts.length > 0 && (
                <div className="rounded-xl border border-red-300 bg-red-50 p-3">
                  <p className="text-sm font-medium text-red-800">
                    Conflicts with {dialogConflicts.length} appointment{dialogConflicts.length > 1 ? "s" : ""} — choose a different time:
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {dialogConflicts.map((c) => (
                      <li key={c.id} className="text-xs text-red-700">
                        {c.start_time.slice(0, 5)} — {c.members?.name ?? "No member"} ({c.duration}m)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={closeDialog}
                className="rounded-xl border border-zinc-200 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={create}
                disabled={saving || !canCreate}
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

const SLOT_HEIGHT = 64; // px per hour

// --- Timeline slot sub-component ---

function TimelineSlot({
  hour,
  appointments,
  onClickSlot,
  onDelete,
}: {
  hour: number;
  appointments: Appointment[];
  onClickSlot: (hour: number) => void;
  onDelete: (id: string) => void;
}) {
  const slotStart = hour * 60;
  const slotEnd = slotStart + 60;

  // Appointments whose session starts in this hour
  const startsHere = appointments.filter((apt) => {
    const aptStart = timeToMinutes(apt.start_time);
    return aptStart >= slotStart && aptStart < slotEnd;
  });

  return (
    <div className="flex border-t border-zinc-100 first:border-t-0">
      {/* Hour label */}
      <div className="w-14 shrink-0 py-3 pr-3 text-right font-mono text-xs text-zinc-400">
        {pad(hour)}:00
      </div>

      {/* Slot content */}
      <div className="relative flex-1 overflow-visible" style={{ height: SLOT_HEIGHT }}>
        {startsHere.map((apt) => {
          const aptStart = timeToMinutes(apt.start_time);
          const offsetMin = aptStart - slotStart;
          const totalMin = apt.duration + (apt.skip_cleanup ? 0 : 15);
          const topPx = (offsetMin / 60) * SLOT_HEIGHT;
          const heightPx = (totalMin / 60) * SLOT_HEIGHT;
          const sessionHeightPx = (apt.duration / 60) * SLOT_HEIGHT;

          return (
            <Link
              key={apt.id}
              href={`/admin/appointments/${apt.id}`}
              className="absolute left-0 right-0 z-10 flex flex-col overflow-hidden rounded-xl transition hover:brightness-110"
              style={{ top: topPx, height: Math.max(heightPx, 40) }}
            >
              {/* Session portion */}
              <div
                className="flex items-center gap-3 bg-zinc-900 px-3 text-white"
                style={{ height: Math.max(sessionHeightPx, 40) }}
              >
                <span className="font-mono text-sm font-semibold">
                  {apt.start_time.slice(0, 5)}
                </span>
                <span className="flex-1 truncate text-sm">
                  {apt.members?.name ?? "No member"}
                </span>
                <span className="shrink-0 text-xs text-zinc-400">
                  {apt.duration}m
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(apt.id);
                  }}
                  className="shrink-0 text-xs text-red-300 hover:text-red-100"
                >
                  ×
                </button>
              </div>
              {/* Cleanup portion (lighter tail) */}
              {!apt.skip_cleanup && (
                <div className="flex-1 bg-zinc-700" />
              )}
            </Link>
          );
        })}

        {/* Clickable empty area */}
        {startsHere.length === 0 && (
          <button
            onClick={() => onClickSlot(hour)}
            className="absolute inset-0 flex items-center justify-center rounded-xl text-xs text-zinc-300 transition hover:bg-zinc-50 hover:text-zinc-500"
          />
        )}
      </div>
    </div>
  );
}
