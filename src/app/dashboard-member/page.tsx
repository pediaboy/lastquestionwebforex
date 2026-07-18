"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  TrendingUp,
  BarChart3,
  Target,
  BookOpen,
  LineChart,
  Radar,
  GraduationCap,
  NotebookPen,
  CalendarClock,
  Calculator,
  Trophy,
  Megaphone,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { SITE, waLink } from "@/lib/constants";
import type { DashboardStats } from "@/lib/dashboardStats";
import { useMemberAuth } from "@/lib/MemberAuthContext";

const QUICK_MENU = [
  { href: "/dashboard-member/chart", label: "Chart", icon: LineChart },
  { href: "/dashboard-member/sinyal", label: "Sinyal", icon: Radar },
  { href: "/dashboard-member/kelas", label: "Kelas", icon: GraduationCap },
  { href: "/dashboard-member/jurnal", label: "Journal", icon: NotebookPen },
  { href: "/dashboard-member/kalender", label: "Kalender", icon: CalendarClock },
  { href: "/dashboard-member/kalkulator-lot", label: "Kalkulator", icon: Calculator },
  { href: "/dashboard-member/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard-member/pengumuman", label: "Pengumuman", icon: Megaphone },
];

const STAT_ICONS: Record<keyof DashboardStats, typeof TrendingUp> = {
  win_rate: TrendingUp,
  total_trade: BarChart3,
  profit_bulan: Target,
  kelas_selesai: BookOpen,
};

export default function DashboardMemberPage() {
  const { isVip, accessToken, profile } = useMemberAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    let active = true;

    async function load() {
      try {
        const res = await fetch("/api/dashboard-stats", {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const statsRes = await res.json();
        if (!active) return;
        if (statsRes?.stats) setStats(statsRes.stats);
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
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

  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "Member";

  return (
    <PageTransition>
      <section className="pt-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
            Dashboard Member
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
            Halo, {displayName}
          </h1>
        </div>

        {/* STAT CARDS */}
        {stats && (
          <div className="mt-6 grid grid-cols-2 gap-4">
            {(Object.keys(stats) as (keyof DashboardStats)[]).map((key) => {
              const stat = stats[key];
              const Icon = STAT_ICONS[key];
              return (
                <GlassCard key={key} glow className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric/10 text-neon">
                      <Icon size={18} />
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">{stat.delta}</span>
                  </div>
                  <p className="mt-3 font-display text-2xl font-bold text-white">{stat.value}</p>
                  <p className="mt-1 text-xs text-white/45">{stat.label}</p>
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* QUICK MENU */}
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
          Menu Cepat
        </p>
        <div className="mt-4 grid grid-cols-4 gap-3">
          {QUICK_MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] py-4 text-center transition-all hover:-translate-y-0.5 hover:border-electric/40 hover:bg-electric/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon transition-transform group-hover:scale-105">
                <item.icon size={19} />
              </div>
              <span className="text-[11px] font-medium text-white/70 group-hover:text-white">
                {item.label}
              </span>
            </Link>
          ))}
        </div>

        {!isVip && (
          <GlassCard glow className="mt-8 flex flex-col items-center gap-4 p-8 text-center md:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neon">
              Upgrade Akun
            </p>
            <h2 className="font-display text-xl font-bold text-white md:text-2xl">
              Naik ke VIP untuk Akses Penuh
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/55">
              Dapatkan analisa harian, watchlist, dan komunitas premium
              dengan upgrade ke membership VIP {SITE.name}.
            </p>
            <GlowButton
              href={waLink(
                "Halo Admin, saya ingin upgrade ke Member VIP. Mohon info paket & invoice-nya."
              )}
              target="_blank"
            >
              Upgrade ke VIP
            </GlowButton>
          </GlassCard>
        )}
      </section>
    </PageTransition>
  );
}
