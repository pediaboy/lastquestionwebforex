"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import PremiumGate from "@/components/PremiumGate";
import { useMemberAuth } from "@/lib/MemberAuthContext";

const VIDEOS = [
  { title: "Pengenalan Trading Forex", youtubeId: "dQw4w9WgXcQ", vip: false },
  { title: "Cara Membaca Chart Candlestick", youtubeId: "dQw4w9WgXcQ", vip: false },
  { title: "Strategi Order Block Lanjutan", youtubeId: "dQw4w9WgXcQ", vip: true },
  { title: "Studi Kasus Trading XAU/USD", youtubeId: "dQw4w9WgXcQ", vip: true },
];

export default function VideoMateriPage() {
  const { isVip } = useMemberAuth();
  const [active, setActive] = useState(0);

  const current = VIDEOS[active];
  const canWatch = !current.vip || isVip;

  return (
    <PageTransition>
      <section className="pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
            <PlayCircle size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Video Materi
            </h1>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
          <PremiumGate isVip={canWatch}>
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10">
              <iframe
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${current.youtubeId}`}
                title={current.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </PremiumGate>

          <div className="space-y-2">
            {VIDEOS.map((v, idx) => (
              <button
                key={v.title}
                onClick={() => setActive(idx)}
                className={`w-full rounded-xl border p-4 text-left text-sm transition-colors ${
                  idx === active
                    ? "border-electric/50 bg-electric/10 text-white"
                    : "border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
                }`}
              >
                <p className="font-medium">{v.title}</p>
                {v.vip && <p className="mt-1 text-[10px] uppercase tracking-widest text-neon/70">VIP</p>}
              </button>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
