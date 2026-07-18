"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, TrendingDown, Radar } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import PremiumGate from "@/components/PremiumGate";
import TypewriterText from "@/components/TypewriterText";
import { useMemberAuth } from "@/lib/MemberAuthContext";

type SignalItem = {
  id: string;
  pair: string;
  direction: "BUY" | "SELL";
  entry: string | null;
  tp: string | null;
  sl: string | null;
  note?: string | null;
  created_at: string;
};

export default function SinyalPage() {
  const { isVip, accessToken } = useMemberAuth();
  const [loading, setLoading] = useState(true);
  const [signals, setSignals] = useState<SignalItem[]>([]);

  useEffect(() => {
    if (!accessToken) return;
    let active = true;

    async function load() {
      const res = await fetch("/api/signals", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.json();
      if (!active) return;
      setSignals(json.signals || []);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [accessToken]);

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
              Sinyal Trading
            </h1>
            <p className="mt-2 flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] text-white/40">
              <TypewriterText
                words={["Update Real-time", "Akurasi Terjaga", "Analisa Profesional", "Entry, TP & SL Jelas"]}
                className="text-neon"
              />
            </p>
          </div>

          <div className="mt-8">
            <PremiumGate isVip={isVip}>
              <div className="space-y-4">
                {signals.length === 0 && (
                  <GlassCard className="flex flex-col items-center gap-3 p-10 text-center">
                    <Radar size={22} className="text-white/30" />
                    <p className="text-sm text-white/50">
                      Belum ada sinyal aktif saat ini.
                    </p>
                  </GlassCard>
                )}

                {signals.map((s) => (
                  <GlassCard key={s.id} glow className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                            s.direction === "BUY"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-destructive/10 text-red-400"
                          }`}
                        >
                          {s.direction === "BUY" ? (
                            <TrendingUp size={18} />
                          ) : (
                            <TrendingDown size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-display text-lg font-bold text-white">
                            {s.pair}
                          </p>
                          <p
                            className={`text-xs font-semibold uppercase tracking-widest ${
                              s.direction === "BUY" ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {s.direction}
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-white/40">
                        {new Date(s.created_at).toLocaleString("id-ID", {
                          timeZone: "Asia/Jakarta",
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] py-3">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">
                          Entry
                        </p>
                        <p className="mt-1 text-sm font-semibold text-white">{s.entry}</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] py-3">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">TP</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-400">{s.tp}</p>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/[0.03] py-3">
                        <p className="text-[10px] uppercase tracking-widest text-white/40">SL</p>
                        <p className="mt-1 text-sm font-semibold text-red-400">{s.sl}</p>
                      </div>
                    </div>

                    {s.note && (
                      <p className="mt-3 text-sm leading-relaxed text-white/55">{s.note}</p>
                    )}
                  </GlassCard>
                ))}
              </div>
            </PremiumGate>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
