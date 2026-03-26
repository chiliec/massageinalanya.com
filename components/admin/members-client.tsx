"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type ContactType = "phone" | "telegram" | "whatsapp" | "instagram" | "other";

interface Member {
  id: string;
  name: string;
  contact_type: ContactType;
  contact_value: string;
  notes: string;
  created_at: string;
}

interface AppointmentNote {
  id: string;
  date: string;
  start_time: string;
  duration: number;
  notes: string;
}

const CONTACT_TYPES: ContactType[] = ["phone", "telegram", "whatsapp", "instagram", "other"];

export default function MembersClient() {
  const supabase = createClient();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [aptNotes, setAptNotes] = useState<Record<string, AppointmentNote[]>>({});

  // Add form
  const [name, setName] = useState("");
  const [contactType, setContactType] = useState<ContactType>("phone");
  const [contactValue, setContactValue] = useState("");

  async function load() {
    const { data } = await supabase
      .from("members")
      .select("*")
      .order("created_at", { ascending: false });
    setMembers(data ?? []);
    setLoading(false);
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  async function add() {
    if (!name.trim()) return;
    await supabase.from("members").insert({
      name: name.trim(),
      contact_type: contactType,
      contact_value: contactValue.trim(),
      notes: "",
    });
    setName("");
    setContactValue("");
    setContactType("phone");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this member?")) return;
    await supabase.from("members").delete().eq("id", id);
    load();
  }

  async function saveNotes(id: string, notes: string) {
    await supabase.from("members").update({ notes }).eq("id", id);
  }

  async function toggle(id: string) {
    if (expanded === id) {
      setExpanded(null);
      return;
    }
    setExpanded(id);
    if (!aptNotes[id]) {
      const { data } = await supabase
        .from("appointments")
        .select("id, date, start_time, duration, notes")
        .eq("member_id", id)
        .order("date", { ascending: false });
      setAptNotes((prev) => ({ ...prev, [id]: data ?? [] }));
    }
  }

  if (loading) {
    return <div className="p-8 text-sm text-zinc-400">Loading…</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add form */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-zinc-700">Add member</h2>
        <div className="flex flex-wrap gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Name"
            className="min-w-[160px] flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <select
            value={contactType}
            onChange={(e) => setContactType(e.target.value as ContactType)}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          >
            {CONTACT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            value={contactValue}
            onChange={(e) => setContactValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && add()}
            placeholder="Contact value"
            className="min-w-[160px] flex-1 rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
          />
          <button
            onClick={add}
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
          >
            Add
          </button>
        </div>
      </section>

      {/* Members list */}
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-zinc-700">
          Members ({members.length})
        </h2>
        {members.length === 0 ? (
          <p className="text-sm text-zinc-400">No members yet.</p>
        ) : (
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.id} className="rounded-2xl border border-zinc-100 p-4">
                {/* Row */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex-1 font-medium text-zinc-900">{m.name}</span>
                  <span className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs text-zinc-500">
                    {m.contact_type}
                  </span>
                  {m.contact_value && (
                    <span className="text-sm text-zinc-500">{m.contact_value}</span>
                  )}
                  <button
                    onClick={() => toggle(m.id)}
                    className="text-xs text-zinc-400 hover:text-zinc-700"
                  >
                    {expanded === m.id ? "hide" : "notes & history"}
                  </button>
                  <button
                    onClick={() => remove(m.id)}
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    delete
                  </button>
                </div>

                {/* Expanded */}
                {expanded === m.id && (
                  <div className="mt-3 space-y-4 border-t border-zinc-100 pt-3">
                    <div>
                      <label className="mb-1 block text-xs text-zinc-400">Notes</label>
                      <textarea
                        defaultValue={m.notes}
                        onBlur={(e) => saveNotes(m.id, e.target.value)}
                        rows={3}
                        placeholder="Notes about this member…"
                        className="w-full resize-none rounded-xl border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-zinc-400"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs text-zinc-400">
                        Appointment history
                      </label>
                      {!aptNotes[m.id] ? (
                        <p className="text-xs text-zinc-400">Loading…</p>
                      ) : aptNotes[m.id].length === 0 ? (
                        <p className="text-xs text-zinc-400">No appointments yet.</p>
                      ) : (
                        <div className="space-y-2">
                          {aptNotes[m.id].map((apt) => (
                            <div
                              key={apt.id}
                              className="rounded-xl border border-zinc-100 p-3"
                            >
                              <div className="mb-1 flex items-center gap-2 text-xs text-zinc-400">
                                <span>{apt.date}</span>
                                <span>·</span>
                                <span>{apt.start_time.slice(0, 5)}</span>
                                <span>·</span>
                                <span>{apt.duration} min</span>
                              </div>
                              {apt.notes && (
                                <p className="mb-1.5 text-sm text-zinc-700">{apt.notes}</p>
                              )}
                              <a
                                href={`/admin/appointments/${apt.id}`}
                                className="text-xs text-zinc-400 underline-offset-2 hover:text-zinc-700 hover:underline"
                              >
                                Open appointment →
                              </a>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
