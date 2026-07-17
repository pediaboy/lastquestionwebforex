"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(
          loginError.message === "Email not confirmed"
            ? "Email belum diverifikasi. Silakan cek inbox kamu terlebih dahulu."
            : "Email atau password salah."
        );
        setLoading(false);
        return;
      }

      const user = data.user;
      if (user) {
        // Fire-and-forget Telegram notification, don't block redirect
        fetch("/api/auth-event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "login",
            userId: user.id,
            email: user.email,
            fullName: user.user_metadata?.full_name,
          }),
        }).catch(() => {});
      }

      router.push("/dashboard-member");
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  }

  return (
    <PageTransition>
      <section className="section-pad flex min-h-[80vh] items-center pt-32 md:pt-40">
        <GlassCard glow className="mx-auto w-full max-w-md p-7 md:p-10">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-neon">
              <LogIn size={22} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              Login Member
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Masuk ke dashboard member LASTQUESTION FOREX.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                type="password"
                placeholder="Password"
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
              icon={loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            >
              {loading ? "Memproses..." : "Masuk"}
            </GlowButton>
          </form>

          <p className="mt-6 text-center text-sm text-white/45">
            Belum punya akun?{" "}
            <Link href="/register" className="font-semibold text-neon hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </GlassCard>
      </section>
    </PageTransition>
  );
}
