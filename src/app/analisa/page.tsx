import type { Metadata } from "next";
import { LineChart, Calendar, Newspaper, Eye } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import GlowButton from "@/components/GlowButton";

export const metadata: Metadata = {
  title: "Analisa Market",
  description:
    "Analisis harian, weekly outlook, dan market review Forex, Gold, serta Crypto dari LASTQUESTION FOREX.",
};

const ANALYSIS_TYPES = [
  {
    icon: Calendar,
    title: "Analisa Harian",
    desc: "Update pergerakan pasar setiap hari — level kunci, bias arah, dan area yang perlu diwaspadai pada Forex, Gold, dan Crypto.",
  },
  {
    icon: LineChart,
    title: "Weekly Outlook",
    desc: "Gambaran besar pasar selama sepekan ke depan, termasuk skenario utama dan level struktural jangka menengah.",
  },
  {
    icon: Newspaper,
    title: "Market Review",
    desc: "Evaluasi menyeluruh terhadap pergerakan minggu sebelumnya — apa yang terjadi, apa yang meleset, dan pelajaran yang diambil.",
  },
  {
    icon: Eye,
    title: "Watchlist",
    desc: "Daftar pair dan aset yang sedang kami pantau ketat berdasarkan struktur pasar dan potensi peluang.",
  },
];

export default function AnalisaPage() {
  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
            Analisa Market
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
            Membaca Pasar dengan Pendekatan yang Terstruktur
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            Analisis kami dibangun dari kombinasi price action, market
            structure, dan konteks fundamental — disampaikan secara rutin ke
            seluruh member.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2">
          {ANALYSIS_TYPES.map((item) => (
            <GlassCard key={item.title} className="p-8" glow>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
                <item.icon size={20} />
              </div>
              <h3 className="font-display text-lg font-semibold text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">
                {item.desc}
              </p>
            </GlassCard>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl text-center">
          <p className="text-sm text-white/50">
            Seluruh analisa dibagikan rutin kepada Member VIP melalui
            Telegram.
          </p>
          <div className="mt-6 flex justify-center">
            <GlowButton href="/vip">Akses Analisa Sekarang</GlowButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
