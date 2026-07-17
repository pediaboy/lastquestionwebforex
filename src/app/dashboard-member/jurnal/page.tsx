"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { NotebookPen, Loader2, Plus, Trash2, TrendingUp, TrendingDown } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/lib/supabaseClient";

type Entry = {
  id: string;
  pair: string;
  direction: "BUY" | "SELL";
  entry: string;
  exit_price: string;
  profit_loss: string;
  notes?: string;
  trade_date: string;
  created_at: string;
};

const emptyForm = {
  pair: "",
  direction: "BUY" as "BUY" | "SELL",
  entry: "",
  exit_price: "",
  profit_loss: "",
  notes: "",
  trade_date: new Date().toISOString().slice(0, 10),
};

export default function JurnalTradingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      if (!active) return;
      setToken(session.access_token);
      const res = await fetch("/api/journal", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      setEntries(json.entries || []);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    const res = await fetch("/api/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (json.entry) setEntries((prev) => [json.entry, ...prev]);
    setForm(emptyForm);
    setSubmitting(false);
  }

  async function handleDelete(id: string) {
    if (!token) return;
    await fetch(`/api/journal?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }

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
            <NotebookPen size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Jurnal Trading
            </h1>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr]">
          <GlassCard glow className="h-fit p-6">
            <h2 className="font-display text-base font-semibold text-white">Catat Transaksi Baru</h2>
            <form onSubmit={handleAdd} className="mt-4 space-y-3">
              <input
                required
                placeholder="Pair (contoh: XAU/USD)"
                value={form.pair}
                onChange={(e) => setForm({ ...form, pair: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, direction: "BUY" })}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold ${
                    form.direction === "BUY"
                      ? "border-emerald-400/50 bg-emerald-500/10 text-emerald-400"
                      : "border-white/10 text-white/50"
                  }`}
                >
                  BUY
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, direction: "SELL" })}
                  className={`flex-1 rounded-lg border py-2.5 text-sm font-semibold ${
                    form.direction === "SELL"
                      ? "border-red-400/50 bg-destructive/10 text-red-400"
                      : "border-white/10 text-white/50"
                  }`}
                >
                  SELL
                </button>
              </div>
              <input
                type="date"
                required
                value={form.trade_date}
                onChange={(e) => setForm({ ...form, trade_date: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
              />
              <input
                placeholder="Harga Entry"
                value={form.entry}
                onChange={(e) => setForm({ ...form, entry: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
              />
              <input
                placeholder="Harga Exit"
                value={form.exit_price}
                onChange={(e) => setForm({ ...form, exit_price: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
              />
              <input
                placeholder="Profit/Loss (contoh: +$45 atau -$20)"
                value={form.profit_loss}
                onChange={(e) => setForm({ ...form, profit_loss: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
              />
              <textarea
                placeholder="Catatan / evaluasi (opsional)"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
              />
              <GlowButton type="submit" disabled={submitting} className="w-full" icon={<Plus size={16} />}>
                {submitting ? "Menyimpan..." : "Simpan Catatan"}
              </GlowButton>
            </form>
          </GlassCard>

          <div className="space-y-3">
            {entries.length === 0 && (
              <GlassCard className="p-8 text-center text-sm text-white/50">
                Belum ada catatan trading. Mulai isi jurnal di sisi kiri.
              </GlassCard>
            )}
            {entries.map((entry) => (
              <GlassCard key={entry.id} className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        entry.direction === "BUY"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-destructive/10 text-red-400"
                      }`}
                    >
                      {entry.direction === "BUY" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{entry.pair}</p>
                      <p className="text-xs text-white/45">
                        {entry.trade_date} • Entry {entry.entry || "-"} → Exit {entry.exit_price || "-"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.profit_loss && (
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          entry.profit_loss.trim().startsWith("-")
                            ? "bg-destructive/10 text-red-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}
                      >
                        {entry.profit_loss}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="rounded-lg border border-white/10 p-1.5 text-red-300 hover:bg-red-500/10"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                {entry.notes && (
                  <p className="mt-3 text-sm leading-relaxed text-white/55">{entry.notes}</p>
                )}
              </GlassCard>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
