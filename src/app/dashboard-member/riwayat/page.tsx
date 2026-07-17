"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { History, Loader2, LogIn, UserPlus } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/lib/supabaseClient";

type ActivityLog = {
  id: string;
  action: string;
  created_at: string;
  ip_address: string | null;
};

export default function HistoryJurnalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    let active = true;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
        return;
      }

      const { data } = await supabase
        .from("forex_activity_logs")
        .select("id, action, created_at, ip_address")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!active) return;
      setLogs(data || []);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-neon" size={28} />
      </section>
    );
  }

  return (
    <PageTransition>
      <section className="section-pad pt-4">
        <div className="mx-auto max-w-3xl">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
              Dashboard Member
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
              Track Record
            </h1>
          </div>

          <div className="mt-8 space-y-3">
            {logs.length === 0 && (
              <GlassCard className="p-8 text-center text-sm text-white/50">
                Belum ada riwayat aktivitas.
              </GlassCard>
            )}

            {logs.map((log) => (
              <GlassCard key={log.id} className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-neon">
                  {log.action === "register" ? <UserPlus size={18} /> : <LogIn size={18} />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white">
                    {log.action === "register" ? "Registrasi Akun" : "Login ke Dashboard"}
                  </p>
                  <p className="mt-0.5 text-xs text-white/45">
                    {new Date(log.created_at).toLocaleString("id-ID", {
                      timeZone: "Asia/Jakarta",
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}{" "}
                    WIB
                  </p>
                </div>
                <History size={16} className="shrink-0 text-white/25" />
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
