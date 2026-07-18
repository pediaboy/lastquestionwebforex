"use client";

import { useEffect, useState } from "react";
import { Trophy, Loader2, Medal } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import type { LeaderboardRow } from "@/lib/leaderboard";
import { useMemberAuth } from "@/lib/MemberAuthContext";

const PODIUM_STYLE: Record<number, string> = {
  0: "text-neon",
  1: "text-white/70",
  2: "text-amber-500/80",
};

export default function LeaderboardPage() {
  const { accessToken } = useMemberAuth();
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const [rows, setRows] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    setLoading(true);
    fetch(`/api/leaderboard?period=${period}`)
      .then((r) => r.json())
      .then((json) => {
        if (!active) return;
        setRows(json.rows || []);
        setLoading(false);
      })
      .catch(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [period, accessToken]);

  const top3 = rows.slice(0, 3);
  const rest = rows.slice(3);
  // Reorder for podium visual: #2, #1, #3
  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean) as LeaderboardRow[];

  return (
    <PageTransition>
      <section className="pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
              <Trophy size={20} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
              <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
                Leaderboard
              </h1>
            </div>
          </div>

          <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
            {(["weekly", "monthly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                  period === p ? "bg-electric/15 text-neon" : "text-white/50 hover:text-white"
                }`}
              >
                {p === "weekly" ? "Mingguan" : "Bulanan"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="animate-spin text-neon" size={26} />
          </div>
        ) : rows.length === 0 ? (
          <GlassCard className="mt-8 p-8 text-center text-sm text-white/50">
            Belum ada data leaderboard untuk periode ini.
          </GlassCard>
        ) : (
          <>
            {/* PODIUM TOP 3 */}
            {top3.length > 0 && (
              <div className="mt-8 grid grid-cols-3 gap-3">
                {podiumOrder.map((row) => {
                  const rank = rows.indexOf(row);
                  return (
                    <GlassCard
                      key={row.id}
                      glow
                      className={`flex flex-col items-center gap-2 p-4 text-center ${
                        rank === 0 ? "-mt-3 pb-6" : ""
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full bg-electric/10 ${PODIUM_STYLE[rank]}`}
                      >
                        {rank === 0 ? <Trophy size={18} /> : <Medal size={18} />}
                      </div>
                      <p className="text-xs text-white/40">#{rank + 1}</p>
                      <p className="truncate text-sm font-semibold text-white">{row.name}</p>
                      <p className="font-display text-lg font-bold text-neon">+{row.pips} pips</p>
                      <p className="text-[11px] text-white/45">WR: {row.win_rate}%</p>
                    </GlassCard>
                  );
                })}
              </div>
            )}

            {/* FULL LIST */}
            <div className="mt-6 space-y-3">
              {rows.map((row, idx) => (
                <GlassCard key={row.id} glow className="flex items-center gap-4 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-electric/10 text-sm font-bold text-neon">
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-white">{row.name}</p>
                    <p className="text-xs text-white/45">{row.trades} trades</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="font-semibold text-neon">+{row.pips} pips</p>
                    <p className="text-xs text-white/45">WR: {row.win_rate}%</p>
                  </div>
                </GlassCard>
              ))}
              {rest.length === 0 && rows.length <= 3 && (
                <GlassCard className="p-6 text-center text-sm text-white/50">
                  Leaderboard komunitas penuh segera hadir — terus aktif trading dan isi jurnalmu.
                </GlassCard>
              )}
            </div>
          </>
        )}
      </section>
    </PageTransition>
  );
}
