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
  Megaphone,
  Headset,
  Send,
  LayoutDashboard,
  Trophy,
  Save,
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

type Announcement = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

type ChatMsg = { id: string; sender: "user" | "admin"; message: string; created_at: string };

type ChatThread = {
  user_id: string;
  name: string;
  messages: ChatMsg[];
  last_message_at: string;
};

type StatCard = { value: string; delta: string; label: string };
type DashboardStatsState = {
  win_rate: StatCard;
  total_trade: StatCard;
  profit_bulan: StatCard;
  kelas_selesai: StatCard;
};

type LeaderboardRow = { id: string; name: string; pips: number; trades: number; win_rate: number };
type LeaderboardState = { weekly: LeaderboardRow[]; monthly: LeaderboardRow[] };

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [checking, setChecking] = useState(true);

  const [tab, setTab] = useState<"signals" | "members" | "announcements" | "chat" | "dashboard" | "leaderboard">(
    "signals"
  );
  const [signals, setSignals] = useState<Signal[]>([]);
  const [members, setMembers] = useState<MemberUser[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [activeChatUser, setActiveChatUser] = useState<string | null>(null);
  const [chatReply, setChatReply] = useState("");
  const [loadingData, setLoadingData] = useState(false);

  const [dashStats, setDashStats] = useState<DashboardStatsState | null>(null);
  const [dashSaving, setDashSaving] = useState(false);
  const [dashSaved, setDashSaved] = useState(false);

  const [leaderboard, setLeaderboard] = useState<LeaderboardState>({ weekly: [], monthly: [] });
  const [lbPeriod, setLbPeriod] = useState<"weekly" | "monthly">("weekly");
  const [lbSaving, setLbSaving] = useState(false);
  const [lbSaved, setLbSaved] = useState(false);

  const [form, setForm] = useState({ pair: "", direction: "BUY", entry: "", tp: "", sl: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [annForm, setAnnForm] = useState({ title: "", body: "" });
  const [annSubmitting, setAnnSubmitting] = useState(false);

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
    const [sigRes, memRes, annRes, chatRes, statsRes, lbRes] = await Promise.all([
      fetch("/api/admin/signals", { headers: { "x-admin-key": key } }),
      fetch("/api/admin/users", { headers: { "x-admin-key": key } }),
      fetch("/api/admin/announcements", { headers: { "x-admin-key": key } }),
      fetch("/api/admin/chat", { headers: { "x-admin-key": key } }),
      fetch("/api/admin/dashboard-stats", { headers: { "x-admin-key": key } }),
      fetch("/api/admin/leaderboard", { headers: { "x-admin-key": key } }),
    ]);
    const sigJson = await sigRes.json();
    const memJson = await memRes.json();
    const annJson = await annRes.json();
    const chatJson = await chatRes.json();
    const statsJson = await statsRes.json();
    const lbJson = await lbRes.json();
    setSignals(sigJson.signals || []);
    setMembers(memJson.users || []);
    setAnnouncements(annJson.items || []);
    setChatThreads(chatJson.threads || []);
    if (statsJson.stats) setDashStats(statsJson.stats);
    if (lbJson.weekly || lbJson.monthly) setLeaderboard({ weekly: lbJson.weekly || [], monthly: lbJson.monthly || [] });
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

  async function handleAddAnnouncement(e: FormEvent) {
    e.preventDefault();
    if (!adminKey || !annForm.title.trim() || !annForm.body.trim()) return;
    setAnnSubmitting(true);
    await fetch("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(annForm),
    });
    setAnnForm({ title: "", body: "" });
    await loadData(adminKey);
    setAnnSubmitting(false);
  }

  async function handleDeleteAnnouncement(id: string) {
    if (!adminKey) return;
    await fetch(`/api/admin/announcements?id=${id}`, {
      method: "DELETE",
      headers: { "x-admin-key": adminKey },
    });
    await loadData(adminKey);
  }

  async function handleSendChatReply(userId: string) {
    if (!adminKey || !chatReply.trim()) return;
    const message = chatReply;
    setChatReply("");
    await fetch("/api/admin/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ user_id: userId, message }),
    });
    await loadData(adminKey);
  }

  function updateStatField(key: keyof DashboardStatsState, field: keyof StatCard, value: string) {
    setDashStats((prev) => (prev ? { ...prev, [key]: { ...prev[key], [field]: value } } : prev));
  }

  async function handleSaveStats() {
    if (!adminKey || !dashStats) return;
    setDashSaving(true);
    setDashSaved(false);
    await fetch("/api/admin/dashboard-stats", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(dashStats),
    });
    setDashSaving(false);
    setDashSaved(true);
    setTimeout(() => setDashSaved(false), 2000);
  }

  function updateLbRow(idx: number, field: keyof LeaderboardRow, value: string) {
    setLeaderboard((prev) => {
      const rows = [...prev[lbPeriod]];
      const row = { ...rows[idx] };
      if (field === "name") row.name = value;
      else (row[field] as number) = Number(value) || 0;
      rows[idx] = row;
      return { ...prev, [lbPeriod]: rows };
    });
  }

  function addLbRow() {
    setLeaderboard((prev) => {
      const rows = [...prev[lbPeriod], { id: crypto.randomUUID(), name: "", pips: 0, trades: 0, win_rate: 0 }];
      return { ...prev, [lbPeriod]: rows };
    });
  }

  function removeLbRow(idx: number) {
    setLeaderboard((prev) => {
      const rows = prev[lbPeriod].filter((_, i) => i !== idx);
      return { ...prev, [lbPeriod]: rows };
    });
  }

  async function handleSaveLeaderboard() {
    if (!adminKey) return;
    setLbSaving(true);
    setLbSaved(false);
    // sort each list by pips descending so ranks stay accurate
    const sorted: LeaderboardState = {
      weekly: [...leaderboard.weekly].sort((a, b) => b.pips - a.pips),
      monthly: [...leaderboard.monthly].sort((a, b) => b.pips - a.pips),
    };
    setLeaderboard(sorted);
    await fetch("/api/admin/leaderboard", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify(sorted),
    });
    setLbSaving(false);
    setLbSaved(true);
    setTimeout(() => setLbSaved(false), 2000);
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
            <button
              onClick={() => setTab("announcements")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "announcements" ? "bg-electric/20 text-neon" : "text-white/60"
              }`}
            >
              <Megaphone size={15} /> Pengumuman
            </button>
            <button
              onClick={() => setTab("chat")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "chat" ? "bg-electric/20 text-neon" : "text-white/60"
              }`}
            >
              <Headset size={15} /> Chat Member
            </button>
            <button
              onClick={() => setTab("dashboard")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "dashboard" ? "bg-electric/20 text-neon" : "text-white/60"
              }`}
            >
              <LayoutDashboard size={15} /> Dashboard
            </button>
            <button
              onClick={() => setTab("leaderboard")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                tab === "leaderboard" ? "bg-electric/20 text-neon" : "text-white/60"
              }`}
            >
              <Trophy size={15} /> Leaderboard
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

          {!loadingData && tab === "announcements" && (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.4fr]">
              <GlassCard glow className="h-fit p-6">
                <h2 className="font-display text-base font-semibold text-white">
                  Buat Pengumuman Baru
                </h2>
                <form onSubmit={handleAddAnnouncement} className="mt-4 space-y-3">
                  <input
                    required
                    placeholder="Judul pengumuman"
                    value={annForm.title}
                    onChange={(e) => setAnnForm({ ...annForm, title: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
                  />
                  <textarea
                    required
                    rows={4}
                    placeholder="Isi pengumuman..."
                    value={annForm.body}
                    onChange={(e) => setAnnForm({ ...annForm, body: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
                  />
                  <GlowButton type="submit" disabled={annSubmitting} className="w-full" icon={<Plus size={16} />}>
                    {annSubmitting ? "Mengirim..." : "Publikasikan"}
                  </GlowButton>
                </form>
              </GlassCard>

              <div className="space-y-3">
                {announcements.length === 0 && (
                  <GlassCard className="p-8 text-center text-sm text-white/50">
                    Belum ada pengumuman.
                  </GlassCard>
                )}
                {announcements.map((a) => (
                  <GlassCard key={a.id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{a.title}</p>
                        <p className="mt-1 text-sm text-white/55">{a.body}</p>
                        <p className="mt-2 text-xs text-white/40">
                          {new Date(a.created_at).toLocaleString("id-ID", {
                            timeZone: "Asia/Jakarta",
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteAnnouncement(a.id)}
                        className="shrink-0 rounded-lg border border-white/10 p-1.5 text-red-300 hover:bg-red-500/10"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {!loadingData && tab === "chat" && (
            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.6fr]">
              <div className="space-y-2">
                {chatThreads.length === 0 && (
                  <GlassCard className="p-8 text-center text-sm text-white/50">
                    Belum ada percakapan dari member.
                  </GlassCard>
                )}
                {chatThreads.map((t) => (
                  <button
                    key={t.user_id}
                    onClick={() => setActiveChatUser(t.user_id)}
                    className={`w-full rounded-xl border p-4 text-left text-sm transition-colors ${
                      activeChatUser === t.user_id
                        ? "border-electric/50 bg-electric/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
                    }`}
                  >
                    <p className="font-medium">{t.name}</p>
                    <p className="mt-1 truncate text-xs text-white/45">
                      {t.messages[t.messages.length - 1]?.message}
                    </p>
                  </button>
                ))}
              </div>

              <GlassCard glow className="flex h-[65vh] flex-col p-5">
                {!activeChatUser && (
                  <p className="m-auto text-sm text-white/45">Pilih percakapan di sisi kiri.</p>
                )}
                {activeChatUser && (
                  <>
                    <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                      {(chatThreads.find((t) => t.user_id === activeChatUser)?.messages || []).map(
                        (msg) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                                msg.sender === "admin"
                                  ? "bg-gradient-to-r from-electric to-neon text-white"
                                  : "border border-white/10 bg-white/[0.04] text-white/85"
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendChatReply(activeChatUser);
                      }}
                      className="mt-4 flex gap-2 border-t border-white/10 pt-4"
                    >
                      <input
                        value={chatReply}
                        onChange={(e) => setChatReply(e.target.value)}
                        placeholder="Balas member..."
                        className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
                      />
                      <GlowButton type="submit" icon={<Send size={15} />}>
                        Kirim
                      </GlowButton>
                    </form>
                  </>
                )}
              </GlassCard>
            </div>
          )}

          {!loadingData && tab === "dashboard" && (
            <div className="mt-8 max-w-3xl">
              <GlassCard glow className="p-6">
                <h2 className="font-display text-base font-semibold text-white">
                  Kartu Statistik Dashboard Member
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  4 kartu ini tampil di halaman Home dashboard member (Win Rate, Total Trade, dst).
                </p>

                {!dashStats ? (
                  <div className="mt-6 flex justify-center">
                    <Loader2 className="animate-spin text-neon" size={22} />
                  </div>
                ) : (
                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {(Object.keys(dashStats) as (keyof DashboardStatsState)[]).map((key) => (
                      <div key={key} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-neon/80">
                          {key === "win_rate" && "Win Rate"}
                          {key === "total_trade" && "Total Trade"}
                          {key === "profit_bulan" && "Profit Bulan Ini"}
                          {key === "kelas_selesai" && "Kelas Selesai"}
                        </p>
                        <div className="mt-3 space-y-2">
                          <div>
                            <label className="text-[11px] text-white/40">Label</label>
                            <input
                              value={dashStats[key].label}
                              onChange={(e) => updateStatField(key, "label", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-electric/50"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-white/40">Nilai Utama (contoh: 87%)</label>
                            <input
                              value={dashStats[key].value}
                              onChange={(e) => updateStatField(key, "value", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-electric/50"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-white/40">Delta/Badge (contoh: +2.3%)</label>
                            <input
                              value={dashStats[key].delta}
                              onChange={(e) => updateStatField(key, "delta", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-electric/50"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center gap-3">
                  <GlowButton
                    onClick={handleSaveStats}
                    disabled={dashSaving || !dashStats}
                    icon={dashSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  >
                    {dashSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </GlowButton>
                  {dashSaved && <span className="text-xs text-emerald-400">Tersimpan! Live di dashboard member.</span>}
                </div>
              </GlassCard>
            </div>
          )}

          {!loadingData && tab === "leaderboard" && (
            <div className="mt-8 max-w-3xl">
              <GlassCard glow className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-base font-semibold text-white">
                      Leaderboard Member
                    </h2>
                    <p className="mt-1 text-sm text-white/50">
                      Atur peringkat yang tampil di halaman Leaderboard member (diurutkan otomatis berdasarkan pips saat disimpan).
                    </p>
                  </div>
                  <div className="flex rounded-full border border-white/10 bg-white/[0.03] p-1">
                    {(["weekly", "monthly"] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setLbPeriod(p)}
                        className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                          lbPeriod === p ? "bg-electric/20 text-neon" : "text-white/50"
                        }`}
                      >
                        {p === "weekly" ? "Mingguan" : "Bulanan"}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  {leaderboard[lbPeriod].map((row, idx) => (
                    <div
                      key={row.id}
                      className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                    >
                      <input
                        value={row.name}
                        onChange={(e) => updateLbRow(idx, "name", e.target.value)}
                        placeholder="Nama member"
                        className="min-w-0 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none focus:border-electric/50"
                      />
                      <input
                        type="number"
                        value={row.pips}
                        onChange={(e) => updateLbRow(idx, "pips", e.target.value)}
                        placeholder="Pips"
                        className="w-20 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-center text-sm text-white outline-none focus:border-electric/50"
                      />
                      <input
                        type="number"
                        value={row.trades}
                        onChange={(e) => updateLbRow(idx, "trades", e.target.value)}
                        placeholder="Trades"
                        className="w-20 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-center text-sm text-white outline-none focus:border-electric/50"
                      />
                      <input
                        type="number"
                        value={row.win_rate}
                        onChange={(e) => updateLbRow(idx, "win_rate", e.target.value)}
                        placeholder="WR %"
                        className="w-16 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2 text-center text-sm text-white outline-none focus:border-electric/50"
                      />
                      <button
                        onClick={() => removeLbRow(idx)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white/50 hover:border-red-400/50 hover:text-red-400"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  {leaderboard[lbPeriod].length === 0 && (
                    <p className="py-4 text-center text-sm text-white/40">Belum ada baris. Klik &quot;Tambah Baris&quot;.</p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={addLbRow}
                    className="flex items-center gap-1.5 rounded-lg border border-white/10 px-4 py-2 text-xs font-semibold text-white/70 hover:border-electric/40 hover:text-white"
                  >
                    <Plus size={14} /> Tambah Baris
                  </button>
                  <GlowButton
                    onClick={handleSaveLeaderboard}
                    disabled={lbSaving}
                    icon={lbSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  >
                    {lbSaving ? "Menyimpan..." : "Simpan Perubahan"}
                  </GlowButton>
                  {lbSaved && <span className="text-xs text-emerald-400">Tersimpan! Live di dashboard member.</span>}
                </div>
              </GlassCard>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
