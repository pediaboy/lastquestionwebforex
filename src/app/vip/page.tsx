import type { Metadata } from "next";
import { Check, Crown } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { PRICING, VIP_BENEFITS, formatIDR, waLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Member VIP",
  description:
    "Bergabung Member VIP LASTQUESTION FOREX — akses analisa harian, mingguan, watchlist, dan komunitas premium.",
};

export default function VipPage() {
  const invoiceMessage =
    "Halo LASTQUESTION FOREX, saya ingin join Member VIP. Mohon info invoice & prosesnya.";

  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-neon">
            <Crown size={22} />
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
            Member VIP
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
            Akses Penuh ke Analisis & Komunitas Premium
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            Satu langkah lebih dekat ke analisis pasar yang terstruktur,
            komunitas trader serius, dan pendampingan berkelanjutan.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <GlassCard className="flex flex-col p-8">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Harga Normal
            </p>
            <p className="mt-3 font-display text-2xl font-bold text-white/70 line-through decoration-white/30">
              {formatIDR(PRICING.normal)}
            </p>
            <p className="text-xs text-white/40">/ bulan</p>
          </GlassCard>

          <GlassCard
            glow
            className="relative flex flex-col border-electric/50 p-8 md:-translate-y-4"
          >
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-electric to-neon px-4 py-1 text-xs font-semibold text-white shadow-glow">
              Paling Populer
            </span>
            <p className="text-xs uppercase tracking-widest text-neon">
              Harga Promo
            </p>
            <p className="mt-3 font-display text-4xl font-bold text-white">
              {formatIDR(PRICING.promo)}
            </p>
            <p className="text-xs text-white/40">/ bulan</p>
            <div className="mt-6">
              <GlowButton
                href={waLink(invoiceMessage)}
                target="_blank"
                className="w-full"
              >
                Gabung VIP Sekarang
              </GlowButton>
            </div>
          </GlassCard>

          <GlassCard className="flex flex-col p-8">
            <p className="text-xs uppercase tracking-widest text-white/40">
              Harga Renew
            </p>
            <p className="mt-3 font-display text-2xl font-bold text-white">
              {formatIDR(PRICING.renew)}
            </p>
            <p className="text-xs text-white/40">/ bulan, untuk member aktif</p>
          </GlassCard>
        </div>

        <div className="mx-auto mt-16 max-w-3xl">
          <h2 className="mb-6 text-center font-display text-xl font-bold text-white md:text-2xl">
            Benefit Member VIP
          </h2>
          <GlassCard className="grid grid-cols-1 gap-3 p-8 sm:grid-cols-2">
            {VIP_BENEFITS.map((b) => (
              <div key={b} className="flex items-center gap-2.5">
                <Check size={16} className="shrink-0 text-neon" />
                <span className="text-sm text-white/75">{b}</span>
              </div>
            ))}
          </GlassCard>
        </div>

        <div className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-sm text-white/50">
            Invoice & pembayaran diproses langsung melalui WhatsApp — tanpa
            rekening, tanpa ribet.
          </p>
          <div className="mt-6 flex justify-center">
            <GlowButton href={waLink(invoiceMessage)} target="_blank" variant="secondary">
              Hubungi Admin via WhatsApp
            </GlowButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
