"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Crown, User, Loader2, ShieldCheck } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/lib/supabaseClient";
import { SITE, waLink } from "@/lib/constants";

type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  vip_status: string;
};

export default function DashboardMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

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

      setProfile(
        data || {
          id: session.user.id,
          email: session.user.email ?? null,
          full_name: (session.user.user_metadata?.full_name as string) ?? null,
          phone: null,
          vip_status: "free",
        }
      );
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-neon" size={28} />
      </section>
    );
  }

  const isVip = profile?.vip_status === "vip";
  const displayName = profile?.full_name || profile?.email?.split("@")[0] || "Member";

  return (
    <PageTransition>
      <section className="section-pad pt-32 md:pt-40">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
                Dashboard Member
              </p>
              <h1 className="mt-2 font-display text-2xl font-bold text-white md:text-3xl">
                Halo, {displayName} 👋
              </h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm text-white/70 transition-colors hover:border-red-400/40 hover:text-red-300"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            <GlassCard glow className="p-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
                <User size={20} />
              </div>
              <p className="text-xs uppercase tracking-widest text-white/40">Email</p>
              <p className="mt-1 truncate text-sm font-medium text-white">
                {profile?.email}
              </p>
            </GlassCard>

            <GlassCard glow className="p-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
                <Crown size={20} />
              </div>
              <p className="text-xs uppercase tracking-widest text-white/40">Status Membership</p>
              <p
                className={`mt-1 text-sm font-semibold ${
                  isVip ? "text-neon" : "text-white/70"
                }`}
              >
                {isVip ? "VIP Member" : "Free Member"}
              </p>
            </GlassCard>

            <GlassCard glow className="p-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-electric/10 text-neon">
                <ShieldCheck size={20} />
              </div>
              <p className="text-xs uppercase tracking-widest text-white/40">Nomor Telepon</p>
              <p className="mt-1 text-sm font-medium text-white">
                {profile?.phone || "Belum diisi"}
              </p>
            </GlassCard>
          </div>

          {!isVip && (
            <GlassCard glow className="mt-8 flex flex-col items-center gap-4 p-8 text-center md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neon">
                Upgrade Akun
              </p>
              <h2 className="font-display text-xl font-bold text-white md:text-2xl">
                Naik ke VIP untuk Akses Penuh
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-white/55">
                Dapatkan analisa harian, watchlist, dan komunitas premium
                dengan upgrade ke membership VIP {SITE.name}.
              </p>
              <GlowButton
                href={waLink(
                  "Halo Admin, saya ingin join VIP Promo Rp250.000, mohon info invoice-nya."
                )}
                target="_blank"
              >
                Upgrade ke VIP
              </GlowButton>
            </GlassCard>
          )}
        </div>
      </section>
    </PageTransition>
  );
}
