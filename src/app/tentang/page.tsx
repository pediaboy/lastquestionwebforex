import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import { FOCUS_AREAS, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal LASTQUESTION FOREX, komunitas edukasi Forex & Crypto yang berdiri sejak 2021.",
};

export default function TentangPage() {
  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
            Tentang Kami
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
            Komunitas Trading yang Dibangun Berdasarkan{" "}
            <span className="heading-gradient">Konsistensi & Data</span>
          </h1>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-6 text-sm leading-relaxed text-white/60 md:text-base">
          <p>
            {SITE.name} berdiri sejak tahun {SITE.foundedYear}, lahir dari
            keresahan yang sama dialami banyak trader pemula: minimnya tempat
            belajar yang benar-benar terstruktur, jujur, dan berbasis data.
            Kami percaya bahwa trading bukan soal keberuntungan sesaat,
            melainkan hasil dari pemahaman pasar yang dibangun secara
            konsisten dari waktu ke waktu.
          </p>
          <p>
            Fokus utama kami mencakup analisis Forex, Crypto, dan Gold — mulai
            dari pergerakan pasangan mata uang mayor, dinamika Bitcoin dan
            Ethereum, hingga korelasi antar-aset dalam skala makro. Kami
            mengajarkan cara membaca <em>price action</em>,{" "}
            <em>market structure</em>, <em>supply & demand</em>, serta{" "}
            <em>liquidity</em> — fondasi analisis teknikal yang relevan di
            hampir semua kondisi pasar.
          </p>
          <p>
            Namun analisis teknikal saja tidak cukup. Kami menaruh perhatian
            besar pada <em>risk management</em> dan <em>money management</em>{" "}
            sebagai pilar utama bertahan di dunia trading, serta{" "}
            <em>trading psychology</em> sebagai faktor yang sering diabaikan
            padahal menentukan hasil jangka panjang. Ditambah dengan
            fundamental analysis dan news trading untuk melengkapi sudut
            pandang member dalam membaca sentimen pasar.
          </p>
          <p>
            Baik kamu seorang <em>swing trader</em>, <em>scalper</em>, maupun
            trader <em>intraday</em>, LASTQUESTION FOREX dirancang untuk
            menjadi rumah belajar yang fleksibel. Komunitas ini dibangun agar
            setiap member memiliki tempat berdiskusi, saling mengoreksi, dan
            terus meningkatkan kemampuan analisis pasar secara konsisten —
            bukan sesaat, tapi sebagai proses jangka panjang.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <h2 className="mb-8 text-center font-display text-xl font-bold text-white md:text-2xl">
            Fokus Pembelajaran Kami
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {FOCUS_AREAS.map((item) => (
              <GlassCard
                key={item}
                className="flex items-center gap-2 px-4 py-3"
              >
                <CheckCircle2 size={16} className="shrink-0 text-neon" />
                <span className="text-sm text-white/75">{item}</span>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
