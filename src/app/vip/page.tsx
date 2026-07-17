import type { Metadata } from "next";
import { Check, Crown } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { formatIDR, waLink } from "@/lib/constants";
import { getVipPackages } from "@/lib/vipPackages";

export const metadata: Metadata = {
  title: "Member VIP",
  description:
    "Bergabung Member VIP LASTQUESTION FOREX — akses analisa harian, mingguan, watchlist, dan komunitas premium.",
};

// Always fetch fresh pricing from the DB so admin panel edits show instantly,
// with zero rebuild/redeploy needed.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function VipPage() {
  const packages = await getVipPackages();
  const sorted = [...packages].sort((a, b) => a.price - b.price);

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
          {sorted.map((pkg) => {
            const invoiceMessage = `Halo LASTQUESTION FOREX, saya ingin join ${pkg.name} (${formatIDR(
              pkg.price
            )} / ${pkg.duration_days} hari). Mohon info invoice & prosesnya.`;

            return (
              <GlassCard
                key={pkg.id}
                glow={pkg.popular}
                className={`relative flex flex-col p-8 ${
                  pkg.popular ? "border-electric/50 md:-translate-y-4" : ""
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-electric to-neon px-4 py-1 text-xs font-semibold text-white shadow-glow">
                    Paling Populer
                  </span>
                )}
                <p
                  className={`text-xs uppercase tracking-widest ${
                    pkg.popular ? "text-neon" : "text-white/40"
                  }`}
                >
                  {pkg.tier}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold text-white">{pkg.name}</h3>
                <p
                  className={`mt-3 font-display font-bold text-white ${
                    pkg.popular ? "text-4xl" : "text-2xl"
                  }`}
                >
                  {formatIDR(pkg.price)}
                </p>
                <p className="text-xs text-white/40">/ {pkg.duration_days} hari</p>

                {pkg.features.length > 0 && (
                  <div className="mt-6 flex-1 space-y-2.5">
                    {pkg.features.map((f) => (
                      <div key={f} className="flex items-start gap-2.5">
                        <Check size={15} className="mt-0.5 shrink-0 text-neon" />
                        <span className="text-sm text-white/75">{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6">
                  <GlowButton
                    href={waLink(invoiceMessage)}
                    target="_blank"
                    className="w-full"
                    variant={pkg.popular ? "primary" : "secondary"}
                  >
                    Gabung {pkg.name}
                  </GlowButton>
                </div>
              </GlassCard>
            );
          })}
        </div>

        <div className="mx-auto mt-14 max-w-2xl text-center">
          <p className="text-sm text-white/50">
            Invoice & pembayaran diproses langsung melalui WhatsApp — tanpa
            rekening, tanpa ribet.
          </p>
          <div className="mt-6 flex justify-center">
            <GlowButton
              href={waLink(
                "Halo Admin, saya ingin upgrade ke Member VIP. Mohon info paket & invoice-nya."
              )}
              target="_blank"
              variant="secondary"
            >
              Hubungi Admin via WhatsApp
            </GlowButton>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
