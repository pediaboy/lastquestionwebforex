import type { Metadata } from "next";
import FaqAccordion from "@/components/FaqAccordion";
import PageTransition from "@/components/PageTransition";
import faqData from "@/data/faq.json";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Pertanyaan yang sering diajukan seputar Forex, Crypto, membership VIP, dan komunitas LASTQUESTION FOREX.",
};

export default function FaqPage() {
  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
            FAQ
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
            Pertanyaan yang Sering Diajukan
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            Belum menemukan jawaban? Hubungi kami langsung lewat halaman
            Kontak.
          </p>
        </div>

        <div className="mt-16">
          <FaqAccordion items={faqData} />
        </div>
      </section>
    </PageTransition>
  );
}
