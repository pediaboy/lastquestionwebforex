"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  ShieldCheck,
  Lock,
  Loader2,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Users,
  Radar,
  Crown,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";

const STORAGE_KEY = "lqf_admin_key";

type Signal = {
  id: string;
  pair: string;
  direction: "BUY" | "SELL";
  entry: string;
  tp: string;
  sl: string;
  note?: string;
  status: "active" | "closed";
  created_at: string;
};

type MemberUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  vip_status: string;
  created_at: string;
};

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [checking, setChecking] = useState(true);

  const [tab, setTab] = useState<"signals" | "members">("signals");
  const [signals, setSignals] = useState<Signal[]>([]);
  const [members, setMembers] = useState<MemberUser[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  const [form, setForm] = useState({ pair: "", direction: "BUY", entry: "", tp: "", sl: "", note: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved) verifyKey(saved);
    else setChecking(false);
  }, []);

  async function verifyKey(key: string) {
    setChecking(true);
    const res = await fetch("/api/admin/signals", { headers: { "x-admin-key": key } });
    if (res.ok) {
      localStorage.setItem(STORAGE_KEY, key);
      setAdminKey(key);
      loadData(key);
    } else {
      localStorage.removeItem(STORAGE_KEY);
      setPinError("Kode admin salah.");
    }
    setChecking(false);
  }

  async function loadData(key: string) {
    setLoadingData(true);
    const [sigRes, memRes] = await Promise.all([
      fetch("/api/admin/signals", { headers: { "x-admin-key": key } }),
      fetch("/api/admin/users", { headers: { "x-admin-key": key } }),
    ]);
    const sigJson = await sigRes.json();
    const memJson = await memRes.json();
    setSignals(sigJson.signals || []);
    setMembers(memJson.users || []);
    setLoadingData(false);
  }

  function handlePinSubmit(e: FormEvent) {
    e.preventDefault();
    setPinError("");
    verifyKey(pinInput.trim());
  }

  async function handleAddSignal(e: FormEvent) {
    e.preventDefault();
    if (!adminKey) return;
    setSubmitting(true);
    await fetch("/api/admin/signals", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(form),
    });
    setForm({ pair: "", direction: "BUY", entry: "", tp: "", sl: "", note: "" });
    await loadData(adminKey);
    setSubmitting(false);
  }

  async function handleDeleteSignal(id: string) {
    if (!adminKey) return;
    await fetch(`/api/admin/signals?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    await loadData(adminKey);
  }

  async function handleCloseSignal(id: string) {
    if (!adminKey) return;
    await fetch("/api/admin/signals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ id, status: "closed" }),
    });
    await loadData(adminKey);
  }

  async function handleSetVip(id: string, vip_status: string) {
    if (!adminKey) return;
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ id, vip_status }),
    });
    await loadData(adminKey);
  }

  if (checking) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-neon" size={28} />
      </section>
    );
  }

  if (!adminKey) {
    return (
      <PageTransition>
        <section className="section-pad flex min-h-[80vh] items-center pt-32 md:pt-40">
          <GlassCard glow className="mx-auto w-full max-w-sm p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-neon">
              <Lock size={22} />
            </div>
            <h1 className="font-display text-xl font-bold text-white">Admin Panel</h1>
            <p className="mt-2 text-sm text-white/50">Masukkan kode akses admin.</p>
            <form onSubmit={handlePinSubmit} className="mt-6 space-y-3">
              <input
                type="password"
                required
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Kode Admin"
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-sm text-white outline-none focus:border-electric/50"
              />
              {pinError && <p className="text-xs text-red-300">{pinError}</p>}
              <GlowButton type="submit" className="w-full">
                Masuk
              </GlowButton>
            </form>
          </GlassCard>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="section-pad pt-32 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Admin Panel</p>
              <h1 className="font-display text-xl font-bold text-white md:text-2xl">
                Kelola Sinyal & Member
              </h1>
            </div>
          </div>

          <div className="mt-8 flex gap-2 rounded-full border border-white/10 bg-base-black p-1 w-fit">
            <button
              onClick={() => setTab("signals")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "signals" ? "bg-electric/20 text-neon" : "text-white/60"
              }`}
            >
              <Radar size={15} /> Sinyal
            </button>
            <button
              onClick={() => setTab("members")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "members" ? "bg-electric/20 text-neon" : "text-white/60"
              }`}
            >
              <Users size={15} /> Member
            </button>
          </div>

          {loadingData && (
            <div className="mt-8 flex justify-center">
              <Loader2 className="animate-spin text-neon" size={24} />
            </div>
          )}

          {!loadingData && tab === "signals" && (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
              <GlassCard glow className="h-fit p-6">
                <h2 className="font-display text-base font-semibold text-white">
                  Tambah Sinyal Baru
                </h2>
                <form onSubmit={handleAddSignal} className="mt-4 space-y-3">
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
                    required
                    placeholder="Entry"
                    value={form.entry}
                    onChange={(e) => setForm({ ...form, entry: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
                  />
                  <input
                    required
                    placeholder="Take Profit"
                    value={form.tp}
                    onChange={(e) => setForm({ ...form, tp: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
                  />
                  <input
                    required
                    placeholder="Stop Loss"
                    value={form.sl}
                    onChange={(e) => setForm({ ...form, sl: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
                  />
                  <textarea
                    placeholder="Catatan (opsional)"
                    value={form.note}
                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                    rows={2}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
                  />
                  <GlowButton
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                    icon={<Plus size={16} />}
                  >
                    {submitting ? "Menyimpan..." : "Tambah Sinyal"}
                  </GlowButton>
                </form>
              </GlassCard>

              <div className="space-y-3">
                {signals.length === 0 && (
                  <GlassCard className="p-8 text-center text-sm text-white/50">
                    Belum ada sinyal.
                  </GlassCard>
                )}
                {signals.map((s) => (
                  <GlassCard key={s.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                            s.direction === "BUY"
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-destructive/10 text-red-400"
                          }`}
                        >
                          {s.direction === "BUY" ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {s.pair}{" "}
                            <span
                              className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold ${
                                s.status === "active"
                                  ? "bg-neon/10 text-neon"
                                  : "bg-white/10 text-white/40"
                              }`}
                            >
                              {s.status.toUpperCase()}
                            </span>
                          </p>
                          <p className="text-xs text-white/45">
                            Entry {s.entry} • TP {s.tp} • SL {s.sl}
                          </p>
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-2">
                        {s.status === "active" && (
                          <button
                            onClick={() => handleCloseSignal(s.id)}
                            className="rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-white/60 hover:text-white"
                          >
                            Tutup
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSignal(s.id)}
                          className="rounded-lg border border-white/10 p-1.5 text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {!loadingData && tab === "members" && (
            <div className="mt-8 space-y-3">
              {members.length === 0 && (
                <GlassCard className="p-8 text-center text-sm text-white/50">
                  Belum ada member terdaftar.
                </GlassCard>
              )}
              {members.map((m) => (
                <GlassCard key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
                  <div>
                    <p className="font-medium text-white">{m.full_name || m.email}</p>
                    <p className="text-xs text-white/45">
                      {m.email} {m.phone ? `• ${m.phone}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        m.vip_status === "vip" || m.vip_status === "admin"
                          ? "bg-neon/10 text-neon"
                          : "bg-white/10 text-white/50"
                      }`}
                    >
                      {m.vip_status.toUpperCase()}
                    </span>
                    {m.vip_status !== "vip" ? (
                      <button
                        onClick={() => handleSetVip(m.id, "vip")}
                        className="flex items-center gap-1.5 rounded-lg border border-electric/40 px-3 py-1.5 text-xs font-semibold text-neon hover:bg-electric/10"
                      >
                        <Crown size={13} /> Jadikan VIP
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSetVip(m.id, "free")}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white"
                      >
                        Set Free
                      </button>
                    )}
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
