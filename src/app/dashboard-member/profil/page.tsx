"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { User, Crown, Mail, Loader2, Save } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/lib/supabaseClient";
import { isVipStatus } from "@/lib/constants";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  vip_status: string;
};

export default function ProfilPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

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
      const { data } = await supabase
        .from("forex_profiles")
        .select("id, email, full_name, phone, vip_status")
        .eq("id", session.user.id)
        .maybeSingle();
      if (!active) return;
      const p = data || {
        id: session.user.id,
        email: session.user.email ?? null,
        full_name: null,
        phone: null,
        vip_status: "free",
      };
      setProfile(p);
      setFullName(p.full_name || "");
      setPhone(p.phone || "");
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSaved(false);
    await supabase
      .from("forex_profiles")
      .update({ full_name: fullName, phone, updated_at: new Date().toISOString() })
      .eq("id", profile.id);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-neon" size={28} />
      </section>
    );
  }

  const isVip = isVipStatus(profile?.vip_status);

  return (
    <PageTransition>
      <section className="pt-4">
        <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
          Profil & Akun Saya
        </h1>

        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
          <GlassCard glow className="p-6 md:p-8">
            <h2 className="font-display text-base font-semibold text-white">Edit Informasi</h2>
            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Nama Lengkap
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nama lengkap Anda"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs uppercase tracking-widest text-white/40">
                  Nomor Telepon / WhatsApp
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
                />
              </div>
              <GlowButton type="submit" disabled={saving} icon={<Save size={16} />}>
                {saving ? "Menyimpan..." : saved ? "Tersimpan" : "Simpan Perubahan"}
              </GlowButton>
            </form>
          </GlassCard>

          <div className="space-y-4">
            <GlassCard className="flex items-center gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-neon">
                <Mail size={17} />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-widest text-white/40">Email</p>
                <p className="truncate text-sm font-medium text-white">{profile?.email}</p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-neon">
                <Crown size={17} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40">Status Membership</p>
                <p className={`text-sm font-semibold ${isVip ? "text-neon" : "text-white/70"}`}>
                  {isVip ? "VIP Member" : "Free Member"}
                </p>
              </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-3 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-electric/10 text-neon">
                <User size={17} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-widest text-white/40">User ID</p>
                <p className="truncate text-xs font-mono text-white/50">{profile?.id}</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
