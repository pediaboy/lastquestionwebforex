"use client";

import { useEffect, useState } from "react";
import { Megaphone, Loader2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";

type Announcement = { id: string; title: string; body: string; created_at: string };

export default function PengumumanPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/announcements");
      const json = await res.json();
      setItems(json.items || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-neon" size={28} />
      </section>
    );
  }

  return (
    <PageTransition>
      <section className="pt-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
            <Megaphone size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Pengumuman & Event
            </h1>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {items.length === 0 && (
            <GlassCard className="p-8 text-center text-sm text-white/50">
              Belum ada pengumuman terbaru.
            </GlassCard>
          )}
          {items.map((item) => (
            <GlassCard key={item.id} glow className="p-6">
              <p className="text-xs text-white/40">
                {new Date(item.created_at).toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                  dateStyle: "long",
                })}
              </p>
              <h3 className="mt-1 font-display text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
