import type { Metadata } from "next";
import { Instagram, Send, MessageCircle } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import { SITE, waLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi LASTQUESTION FOREX melalui Instagram, Telegram, atau WhatsApp.",
};

const CHANNELS = [
  {
    icon: Instagram,
    label: "Instagram",
    value: SITE.instagramHandle,
    href: SITE.instagramUrl,
  },
  {
    icon: Send,
    label: "Telegram",
    value: "Gabung Grup / Bot",
    href: SITE.telegramBot,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: SITE.whatsappRaw,
    href: waLink("Halo LASTQUESTION FOREX, saya ingin bertanya."),
  },
];

export default function KontakPage() {
  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
            Kontak
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
            Ada Pertanyaan? Hubungi Kami
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            Tim kami siap membantu seputar keanggotaan, materi trading, atau
            informasi lainnya.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
          {CHANNELS.map((c) => (
            <a key={c.label} href={c.href} target="_blank" rel="noreferrer">
              <GlassCard className="flex flex-col items-center gap-3 p-8 text-center" glow>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-electric/10 text-neon">
                  <c.icon size={22} />
                </div>
                <p className="text-xs uppercase tracking-widest text-white/40">
                  {c.label}
                </p>
                <p className="font-display text-base font-semibold text-white">
                  {c.value}
                </p>
              </GlassCard>
            </a>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
