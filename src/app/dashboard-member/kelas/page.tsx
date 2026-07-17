"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, Clock, Layers } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import PremiumGate from "@/components/PremiumGate";
import { supabase } from "@/lib/supabaseClient";
import { isVipStatus } from "@/lib/constants";

const CLASSES = [
  { title: "Dasar Forex untuk Pemula", level: "Pemula", duration: "3 Jam", modules: 6, vip: false },
  { title: "Manajemen Risiko & Psikologi Trading", level: "Pemula", duration: "2 Jam", modules: 5, vip: false },
  { title: "Price Action & Market Structure", level: "Menengah", duration: "4 Jam", modules: 8, vip: true },
  { title: "Advanced Order Block & Liquidity", level: "Lanjutan", duration: "5 Jam", modules: 10, vip: true },
  { title: "Trading Emas (XAU/USD) Mendalam", level: "Lanjutan", duration: "3.5 Jam", modules: 7, vip: true },
  { title: "Strategi Trading Crypto", level: "Menengah", duration: "3 Jam", modules: 6, vip: true },
];

export default function KatalogKelasPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isVip, setIsVip] = useState(false);

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
      const { data: profile } = await supabase
        .from("forex_profiles")
        .select("vip_status")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!active) return;
      setIsVip(isVipStatus(profile?.vip_status));
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
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Katalog Kelas
            </h1>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CLASSES.map((cls) => {
            const card = (
              <GlassCard key={cls.title} glow className="flex h-full flex-col p-6">
                <span className="w-fit rounded-full bg-electric/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-neon">
                  {cls.level}
                </span>
                <h3 className="mt-3 font-display text-base font-semibold text-white">{cls.title}</h3>
                <div className="mt-4 flex flex-1 items-end gap-4 text-xs text-white/45">
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} /> {cls.duration}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Layers size={13} /> {cls.modules} Modul
                  </span>
                </div>
              </GlassCard>
            );
            return cls.vip ? (
              <PremiumGate key={cls.title} isVip={isVip}>
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
