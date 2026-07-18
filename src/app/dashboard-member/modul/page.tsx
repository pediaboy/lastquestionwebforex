"use client";

import { useEffect, useState } from "react";
import { BookOpen, Loader2, CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import PremiumGate from "@/components/PremiumGate";
import { useMemberAuth } from "@/lib/MemberAuthContext";

const MODULES = [
  { title: "1. Pengenalan Pasar Forex", desc: "Memahami cara kerja pasar Forex, sesi trading, dan pelaku pasar.", vip: false },
  { title: "2. Membaca Candlestick", desc: "Anatomi candlestick dan pola dasar yang sering muncul.", vip: false },
  { title: "3. Support & Resistance", desc: "Cara mengidentifikasi level kunci pada chart.", vip: false },
  { title: "4. Manajemen Risiko", desc: "Position sizing, risk-reward ratio, dan aturan satu persen.", vip: false },
  { title: "5. Market Structure Lanjutan", desc: "Break of structure, change of character, dan swing point.", vip: true },
  { title: "6. Order Block & Fair Value Gap", desc: "Konsep smart money dan area institusional.", vip: true },
  { title: "7. Liquidity & Stop Hunt", desc: "Memahami pergerakan harga di sekitar area likuiditas.", vip: true },
  { title: "8. Strategi Entry Presisi", desc: "Menggabungkan konfirmasi multi-timeframe untuk entry akurat.", vip: true },
];

export default function ModulTradingPage() {
  const { isVip, accessToken } = useMemberAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) return;
    setLoading(false);
  }, [accessToken]);

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
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Modul Trading Terstruktur
            </h1>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {MODULES.map((mod) => {
            const card = (
              <GlassCard key={mod.title} className="flex items-center gap-4 p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-electric/10 text-neon">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <p className="font-semibold text-white">{mod.title}</p>
                  <p className="mt-1 text-sm text-white/55">{mod.desc}</p>
                </div>
              </GlassCard>
            );
            return mod.vip ? (
              <PremiumGate key={mod.title} isVip={isVip} compact>
                {card}
              </PremiumGate>
            ) : (
              card
            );
          })}
        </div>
      </section>
    </PageTransition>
  );
}
