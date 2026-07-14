import type { Metadata } from "next";
import { Gift, ArrowRight } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { BROKER_IFRAME_SRC, SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gabung Gratis",
  description:
    "Gabung komunitas LASTQUESTION FOREX secara gratis dengan deposit minimal USD 50 melalui broker partner.",
};

export default function GratisPage() {
  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-neon">
            <Gift size={22} />
          </div>
          <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
            Gabung Gratis
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
            Mulai Belajar Tanpa Biaya Keanggotaan
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            Gabung ke komunitas Telegram {SITE.name} secara gratis dengan
            syarat melakukan deposit minimal <strong>USD 50</strong> melalui
            broker partner resmi kami.
          </p>
          <div className="mt-8 flex justify-center">
            <GlowButton
              href={SITE.telegramBot}
              target="_blank"
              icon={<ArrowRight size={18} />}
            >
              Gabung Gratis
            </GlowButton>
          </div>
        </div>

        <div className="mx-auto mt-20 max-w-3xl" id="registrasi-broker">
          <GlassCard glow className="p-6 md:p-10">
            <h2 className="font-display text-xl font-bold text-white md:text-2xl">
              Registrasi Broker Partner
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Lakukan registrasi melalui formulir berikut untuk membuka akun
              trading pada broker partner.
            </p>
            <div className="mt-6 overflow-hidden rounded-xl border border-white/10">
              <iframe
                src={BROKER_IFRAME_SRC}
                width="100%"
                height="490px"
                title="Valetax Registration"
                className="block w-full"
              />
            </div>
          </GlassCard>
        </div>
      </section>
    </PageTransition>
  );
}
