import type { Metadata } from "next";
import { ArrowRight, TrendingUp, ShieldCheck, Users, Brain, BookOpen, Radar } from "lucide-react";
import GlowButton from "@/components/GlowButton";
import GlassCard from "@/components/GlassCard";
import AngularCard from "@/components/AngularCard";
import TypewriterText from "@/components/TypewriterText";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE.name} — Trading Forex & Crypto Sejak 2021`,
  description: SITE.description,
};

const HERO_STATS = [
  { value: "2021", label: "Trading Community" },
  { value: "Forex & Crypto", label: "Fokus Analisis" },
  { value: "Weekly", label: "Analysis" },
  { value: "Community", label: "Support" },
];

const BENEFIT_ITEMS = [
  {
    icon: TrendingUp,
    title: "Analisa Harian & Mingguan",
    description:
      "Update pergerakan market Forex & Crypto setiap hari, lengkap dengan level kunci dan outlook mingguan.",
  },
  {
    icon: ShieldCheck,
    title: "Manajemen Risiko",
    description:
      "Pelajari cara mengatur lot, stop loss, dan risk per trade agar modal tetap aman di setiap kondisi market.",
  },
  {
    icon: Brain,
    title: "Psikologi Trading",
    description:
      "Bangun mental trading yang matang — disiplin dan bebas dari keputusan emosional saat market bergerak liar.",
  },
  {
    icon: Users,
    title: "Komunitas Aktif",
    description:
      "Diskusi & sharing bareng trader lain di grup Telegram, saling belajar dari pengalaman real di market.",
  },
  {
    icon: BookOpen,
    title: "Materi Terstruktur",
    description:
      "Kurikulum belajar dari dasar hingga strategi lanjutan, disusun rapi supaya progress belajar lebih terarah.",
  },
  {
    icon: Radar,
    title: "Update Market Real-time",
    description:
      "Notifikasi pergerakan market penting secara real-time, supaya kamu nggak ketinggalan momentum.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pb-10 pt-24 text-center sm:pt-28 md:px-10 md:pt-32 lg:px-20">
        <div className="pointer-events-none absolute inset-0 bg-grid-glow" />
        <div
          className="animate-glowPulse pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-electric/20 blur-[120px]"
          aria-hidden="true"
        />

        <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center gap-4 sm:gap-5">
          <div className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-neon">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon" />
            Status: Komunitas Aktif Sejak {SITE.foundedYear}
          </div>

          <h1 className="max-w-4xl font-display text-3xl font-bold uppercase leading-[1.15] text-white sm:text-4xl md:text-5xl lg:text-6xl">
            Trade Smarter.
            <br />
            Trade Faster.
            <br />
            <span className="italic text-neon">Trade Better.</span>
          </h1>

          <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.3em] text-white/40 sm:text-sm">
            Fokus:
            <TypewriterText
              words={["Forex & Crypto", "Analisa Teknikal", "Manajemen Risiko", "Psikologi Trading"]}
              className="text-neon"
            />
          </p>

          <p className="max-w-2xl text-balance text-sm leading-relaxed text-white/60 sm:text-base md:text-lg">
            {SITE.name} merupakan komunitas edukasi trading yang berfokus pada
            Forex dan Crypto sejak tahun {SITE.foundedYear}. Kami membantu
            trader memahami market melalui analisis teknikal, fundamental,
            manajemen risiko, serta psikologi trading yang terstruktur.
          </p>

          <div className="mt-1 grid w-full max-w-3xl grid-cols-2 gap-3 sm:mt-2 sm:gap-4 md:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <GlassCard key={stat.label} className="flex flex-col items-center gap-1 px-3 py-4">
                <span className="font-display text-lg font-bold text-white sm:text-xl">
                  {stat.value}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-white/45 sm:text-xs">
                  {stat.label}
                </span>
              </GlassCard>
            ))}
          </div>

          <div className="mt-2 flex flex-col gap-3 sm:mt-3 sm:flex-row">
            <GlowButton href="/vip" shape="cut" icon={<ArrowRight size={18} />}>
              Gabung VIP
            </GlowButton>
            <GlowButton href="/gratis" shape="cut" variant="secondary">
              Gabung Gratis
            </GlowButton>
          </div>
        </div>
      </section>

      {/* QUICK ABOUT STRIP */}
      <section className="section-pad !py-14 md:!py-16">
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

      {/* BENEFITS GRID — angular cut-corner motif, distinct from the glass cards above */}
      <section className="section-pad !pt-0">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFIT_ITEMS.map((item, i) => (
              <AngularCard key={item.title} index={i} className="flex h-full flex-col p-6 pt-14">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
                  <item.icon size={20} />
                </div>
                <h3 className="font-display text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">
                  {item.description}
                </p>
                <a
                  href="/tentang"
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-neon transition-colors hover:text-neon-soft"
                >
                  Pelajari Lebih Lanjut
                  <ArrowRight size={14} />
                </a>
              </AngularCard>
            ))}
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
