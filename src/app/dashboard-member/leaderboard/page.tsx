"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Loader2, Medal } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/lib/supabaseClient";

type Row = { name: string; trades: number; wins: number };

export default function LeaderboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Row[]>([]);

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
      const res = await fetch("/api/journal", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      if (!active) return;
      const entries = json.entries || [];
      const wins = entries.filter((e: { profit_loss?: string }) => e.profit_loss && !e.profit_loss.trim().startsWith("-")).length;
      const { data: profile } = await supabase
        .from("forex_profiles")
        .select("full_name, email")
        .eq("id", session.user.id)
        .maybeSingle();
      setRows([
        {
          name: profile?.full_name || profile?.email?.split("@")[0] || "Anda",
          trades: entries.length,
          wins,
        },
      ]);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [router]);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-neon" size={28} />
      </section>
    );
  }

  return (
    <PageTransition>
      <section className="pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
            <Trophy size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Leaderboard Member
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-white/55">
          Peringkat dihitung dari konsistensi pengisian Jurnal Trading — makin rajin dan disiplin mencatat, makin tinggi peringkatmu.
        </p>

        <div className="mt-6 space-y-3">
          {rows.map((row, idx) => (
            <GlassCard key={row.name} glow className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-neon">
                <Medal size={18} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">
                  #{idx + 1} {row.name}
                </p>
                <p className="text-xs text-white/45">
                  {row.trades} transaksi tercatat • {row.wins} profit
                </p>
              </div>
            </GlassCard>
          ))}
          <GlassCard className="p-6 text-center text-sm text-white/50">
            Leaderboard komunitas penuh segera hadir — terus aktif isi jurnal tradingmu.
          </GlassCard>
        </div>
      </section>
    </PageTransition>
  );
}
