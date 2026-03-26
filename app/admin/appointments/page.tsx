import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDevMode, isDevAuthenticated } from "@/lib/dev-auth";
import AppointmentsClient from "@/components/admin/appointments-client";

export default async function AdminAppointmentsPage() {
  const devAuth = isDevMode() && (await isDevAuthenticated());
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !devAuth) {
    redirect("/auth/login?next=/admin/appointments");
  }

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  const userEmail = user?.email?.toLowerCase();
  const isAdmin = devAuth || Boolean(adminEmail && userEmail && userEmail === adminEmail);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-12 text-zinc-900">
        <main className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Access denied</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-6 py-12 text-zinc-900">
      <main className="w-full max-w-4xl space-y-6">
        <header className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Admin</p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold">Appointments</h1>
            <a href="/admin" className="text-sm text-zinc-500 hover:text-zinc-900">
              ← Dashboard
            </a>
          </div>
        </header>
        <AppointmentsClient />
      </main>
    </div>
  );
}
