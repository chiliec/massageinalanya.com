"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type SignOutButtonProps = {
  className?: string;
  label?: string;
};

export default function SignOutButton({
  className,
  label = "Sign out",
}: SignOutButtonProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={
        className ??
        "inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-2 text-sm font-medium transition hover:border-black/20 hover:bg-black/5 dark:border-white/20 dark:hover:border-white/30 dark:hover:bg-white/10"
      }
    >
      {label}
    </button>
  );
}
