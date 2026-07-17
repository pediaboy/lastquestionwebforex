"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, Mail, Lock, User, Phone, Loader2, CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [needsConfirm, setNeedsConfirm] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, phone },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        setError("Registrasi gagal, silakan coba lagi.");
        setLoading(false);
        return;
      }

      // Create profile + fire Telegram notification (server-side, service role)
      await fetch("/api/auth-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "register",
          userId: user.id,
          email,
          fullName,
          phone,
        }),
      });

      setDone(true);
      setNeedsConfirm(!data.session);

      if (data.session) {
        setTimeout(() => router.push("/dashboard-member"), 1200);
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <PageTransition>
        <section className="section-pad flex min-h-[70vh] items-center pt-36 md:pt-44">
          <GlassCard glow className="mx-auto max-w-md p-8 text-center md:p-10">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neon/10 text-neon">
              <CheckCircle2 size={26} />
            </div>
            <h1 className="font-display text-xl font-bold text-white md:text-2xl">
              Registrasi Berhasil
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              {needsConfirm
                ? "Silakan cek email kamu untuk verifikasi akun sebelum login ke dashboard member."
                : "Akun kamu sudah aktif. Mengalihkan ke dashboard..."}
            </p>
            {needsConfirm && (
              <Link
                href="/login"
                className="mt-6 inline-block text-sm font-semibold text-neon hover:underline"
              >
                Ke halaman Login →
              </Link>
            )}
          </GlassCard>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <section className="section-pad flex min-h-[80vh] items-center pt-32 md:pt-40">
        <GlassCard glow className="mx-auto w-full max-w-md p-7 md:p-10">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-neon">
              <UserPlus size={22} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              Daftar Member
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Buat akun untuk mengakses dashboard member LASTQUESTION FOREX.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                required
                type="text"
                placeholder="Nama Lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-electric/50"
              />
            </div>

            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                required
                type="tel"
                placeholder="Nomor WhatsApp"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-electric/50"
              />
            </div>

            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-electric/50"
              />
            </div>

            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/35" />
              <input
                required
                minLength={6}
                type="password"
                placeholder="Password (min. 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-electric/50"
              />
            </div>

            {error && (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <GlowButton
              type="submit"
              disabled={loading}
              className="mt-2 w-full"
              icon={loading ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </GlowButton>
          </form>

          <p className="mt-6 text-center text-sm text-white/45">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-neon hover:underline">
              Login di sini
            </Link>
          </p>
        </GlassCard>
      </section>
    </PageTransition>
  );
}
