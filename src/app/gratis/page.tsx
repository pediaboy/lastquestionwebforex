import type { Metadata } from "next";
import { Gift, ArrowRight, Send, MessageCircle, ImageUp } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { BROKER_IFRAME_SRC, SITE, waLink } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Gabung Gratis",
  description:
    "Gabung komunitas LASTQUESTION FOREX secara gratis dengan deposit minimal USD 50 melalui broker partner.",
};

const FREE_BENEFITS = [
  "Analisa Harian",
  "Materi VIP",
  "Update Forex",
  "Update Crypto",
  "Community Discussion",
  "Weekly Market Outlook",
];

const CONFIRM_MESSAGE = `Halo Admin LASTQUESTION FOREX.

Saya telah berhasil melakukan registrasi broker.

Berikut saya lampirkan screenshot bukti registrasi.

Mohon dilakukan verifikasi.

Terima kasih.`;

export default function GratisPage() {
  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        {/* INTRO */}
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
        </div>

        {/* PREMIUM INFO CARD - AKSES VIP GRATIS */}
        <div className="mx-auto mt-10 max-w-2xl">
          <GlassCard glow className="glow-border p-7 text-left md:p-9">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neon">
              Akses VIP Gratis
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/60 md:text-base">
              Deposit minimal <strong className="text-white/85">USD 50</strong>{" "}
              melalui broker partner resmi untuk mendapatkan akses komunitas
              VIP tanpa biaya membership bulanan.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {FREE_BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-2.5">
                  <span className="text-neon">✔</span>
                  <span className="text-sm text-white/75">{b}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="mt-8 flex justify-center">
          <GlowButton
            href={SITE.telegramBot}
            target="_blank"
            icon={<ArrowRight size={18} />}
          >
            Gabung Gratis
          </GlowButton>
        </div>

        {/* REGISTRASI BROKER */}
        <div className="mx-auto mt-24 max-w-3xl" id="registrasi-broker">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
              Langkah Selanjutnya
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold text-white md:text-3xl">
              Registrasi Broker Partner
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/55">
              Buka akun trading melalui broker partner resmi menggunakan
              formulir berikut. Setelah proses registrasi selesai, lakukan
              deposit minimal USD 50 agar akun dapat diverifikasi dan
              memperoleh akses ke komunitas {SITE.name}.
            </p>
          </div>

          <GlassCard
            glow
            className="glow-border mt-8 overflow-hidden rounded-[24px] p-6 shadow-glow-strong md:p-10"
          >
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
              <iframe
                src={BROKER_IFRAME_SRC}
                width="100%"
                height="490px"
                title="Valetax Registration"
                className="block w-full"
              />
            </div>

            <div className="mt-6 rounded-xl border border-electric/20 bg-white/[0.03] p-5">
              <p className="text-sm font-medium text-white/80">
                Sudah selesai melakukan registrasi?
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/55">
                Silakan kirim screenshot halaman berhasil registrasi kepada
                Admin agar akun dapat diverifikasi lebih cepat.
              </p>
            </div>
          </GlassCard>
        </div>

        {/* KONFIRMASI REGISTRASI */}
        <div className="mx-auto mt-16 max-w-2xl">
          <GlassCard
            glow
            className="glow-border flex flex-col items-center gap-5 p-8 text-center md:p-12"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-electric/10 text-neon">
              <Send size={24} />
            </div>
            <h2 className="font-display text-xl font-bold text-white md:text-2xl">
              Konfirmasi Registrasi
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/55">
              Apabila Anda telah berhasil membuat akun broker, silakan kirim
              screenshot bukti registrasi kepada Admin untuk proses
              verifikasi.
            </p>
            <GlowButton
              href={waLink(CONFIRM_MESSAGE)}
              target="_blank"
              icon={<ImageUp size={18} />}
              className="w-full sm:w-auto"
            >
              Kirim Screenshot Registrasi
            </GlowButton>
            <p className="flex items-center gap-1.5 text-xs text-white/35">
              <MessageCircle size={13} /> Terhubung langsung ke WhatsApp Admin
            </p>
          </GlassCard>
        </div>
      </section>
    </PageTransition>
  );
}
