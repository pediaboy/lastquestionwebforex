"use client";

import { CalendarClock } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import EconomicCalendar from "@/components/EconomicCalendar";

export default function KalenderEkonomiPage() {
  return (
    <PageTransition>
      <section className="pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
            <CalendarClock size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Kalender Ekonomi
            </h1>
          </div>
        </div>
        <p className="mt-3 max-w-2xl text-sm text-white/55">
          Pantau jadwal rilis data ekonomi penting yang berpotensi menggerakkan pasar Forex, Gold, dan Crypto.
        </p>
        <div className="mt-6 w-full">
          <EconomicCalendar height={750} />
        </div>
      </section>
    </PageTransition>
  );
}
