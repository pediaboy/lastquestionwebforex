import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingUp, ShieldCheck, Users, LineChart } from "lucide-react";
import GlowButton from "@/components/GlowButton";
import GlassCard from "@/components/GlassCard";
import Counter from "@/components/Counter";
import { BENEFITS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE.name} — Trading Forex & Crypto Sejak 2021`,
  description: SITE.description,
};

const benefitIcons = [TrendingUp, LineChart, ShieldCheck, Users];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-14 pt-28 text-center sm:pt-32 md:px-10 md:pt-36 lg:px-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-glow" />
        <div
          className="animate-glowPulse pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-electric/20 blur-[120px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-5 sm:gap-6">
          <div className="animate-float inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium tracking-wide text-neon">
            <span className="h-1.5 w-1.5 rounded-full bg-neon" />
            Trading Community Sejak {SITE.foundedYear}
          </div>

          <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Trading Forex & Crypto
            <span className="heading-gradient block">Sejak 2021</span>
          </h1>

          <p className="max-w-2xl text-balance text-sm leading-relaxed text-white/60 sm:text-base md:text-lg">
            {SITE.description}
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:mt-4 sm:flex-row">
            <GlowButton href="/vip" icon={<ArrowRight size={18} />}>
              Gabung VIP
            </GlowButton>
            <GlowButton href="/gratis" variant="secondary">
              Gabung Gratis
            </GlowButton>
          </div>

          <div className="mt-6 grid w-full max-w-3xl grid-cols-2 gap-6 sm:mt-10 sm:gap-8 md:grid-cols-4">
            <Counter target={2021} label="Trading Community" />
            <Counter target={1000} suffix="+" label="Member" />
            <Counter target={2} label="Forex & Crypto" />
            <Counter target={7} label="Analisa / Minggu" />
          </div>
        </div>
      </section>

      {/* QUICK ABOUT STRIP */}
      <section className="section-pad !py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
            Mengapa LASTQUESTION FOREX
          </p>
          <h2 className="mt-4 font-display text-2xl font-bold text-white md:text-4xl">
            Tempat Trader Serius Belajar, Berdiskusi, dan Bertumbuh
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/55 md:text-base">
            Sejak 2021, kami membangun komunitas yang berfokus pada edukasi
            berbasis data — bukan janji instan. Fokus kami adalah membantu
            member memahami cara pasar bergerak, mengelola risiko, dan
            membangun psikologi trading yang matang.
          </p>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="section-pad !pt-0">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit, i) => {
              const Icon = benefitIcons[i % benefitIcons.length];
              return (
                <GlassCard key={benefit} className="p-6" glow>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white">
                    {benefit}
                  </h3>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="section-pad">
        <GlassCard
          glow
          className="mx-auto flex max-w-5xl flex-col items-center gap-6 p-10 text-center md:p-16"
        >
          <h2 className="font-display text-2xl font-bold text-white md:text-4xl">
            Siap Naik Level Bareng LASTQUESTION FOREX?
          </h2>
          <p className="max-w-xl text-sm text-white/55 md:text-base">
            Pilih jalur yang sesuai dengan kebutuhanmu — mulai gratis, atau
            langsung akses penuh lewat membership VIP.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <GlowButton href="/vip" icon={<ArrowRight size={18} />}>
              Gabung VIP
            </GlowButton>
            <GlowButton href="/gratis" variant="secondary">
              Gabung Gratis
            </GlowButton>
          </div>
        </GlassCard>
      </section>
    </>
  );
}
