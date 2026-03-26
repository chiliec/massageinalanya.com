import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isDevMode, isDevAuthenticated } from "@/lib/dev-auth";
import AppointmentDetail from "@/components/admin/appointment-detail";

export default async function AppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const devAuth = isDevMode() && (await isDevAuthenticated());
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !devAuth) {
    redirect(`/auth/login?next=/admin/appointments/${id}`);
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

  const { data: appointment } = await supabase
    .from("appointments")
    .select("*, members(*)")
    .eq("id", id)
    .single();

  if (!appointment) notFound();

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-6 py-12 text-zinc-900">
      <main className="w-full max-w-2xl space-y-6">
        <AppointmentDetail appointment={appointment} />
      </main>
    </div>
  );
}
