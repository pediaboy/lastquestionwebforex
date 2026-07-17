"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Calendar, LineChart as LineChartIcon, Newspaper, Eye } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import PremiumGate from "@/components/PremiumGate";
import TradingViewChart from "@/components/TradingViewChart";
import { supabase } from "@/lib/supabaseClient";
import { isVipStatus } from "@/lib/constants";

const ANALYSIS_TYPES = [
  {
    icon: Calendar,
    title: "Analisa Harian",
    desc: "Update pergerakan pasar setiap hari — level kunci, bias arah, dan area yang perlu diwaspadai pada Forex, Gold, dan Crypto.",
  },
  {
    icon: LineChartIcon,
    title: "Weekly Outlook",
    desc: "Gambaran besar pasar selama sepekan ke depan, termasuk skenario utama dan level struktural jangka menengah.",
  },
  {
    icon: Newspaper,
    title: "Market Review",
    desc: "Evaluasi menyeluruh terhadap pergerakan minggu sebelumnya beserta pelajaran yang diambil.",
  },
  {
    icon: Eye,
    title: "Watchlist",
    desc: "Daftar pair dan aset yang sedang kami pantau ketat berdasarkan struktur pasar dan potensi peluang.",
  },
];

export default function MemberAnalisaPage() {
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
        <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
          Analisa & Outlook Market
        </h1>

        <div className="mt-6">
          <PremiumGate isVip={isVip}>
            <div className="space-y-6">
              <TradingViewChart symbol="OANDA:XAUUSD" height={600} />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {ANALYSIS_TYPES.map((item) => (
                  <GlassCard key={item.title} className="p-6" glow>
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-neon">
                      <item.icon size={18} />
                    </div>
                    <h3 className="font-display text-base font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/55">{item.desc}</p>
                  </GlassCard>
                ))}
              </div>
            </div>
          </PremiumGate>
        </div>
      </section>
    </PageTransition>
  );
}
