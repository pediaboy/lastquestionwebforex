"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Headset, Loader2, Send } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { supabase } from "@/lib/supabaseClient";

type ChatMsg = { id: string; sender: "user" | "admin"; message: string; created_at: string };

export default function ChatAdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [thread, setThread] = useState<ChatMsg[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function refresh(accessToken: string) {
    const res = await fetch("/api/chat", { headers: { Authorization: `Bearer ${accessToken}` } });
    const json = await res.json();
    setThread(json.thread || []);
  }

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
      await refresh(session.access_token);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!token || !message.trim()) return;
    setSending(true);
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ message }),
    });
    const json = await res.json();
    if (json.message) setThread((prev) => [...prev, json.message]);
    setMessage("");
    setSending(false);
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
            <Headset size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Chat Admin
            </h1>
          </div>
        </div>

        <GlassCard glow className="mt-6 flex h-[65vh] flex-col p-5">
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {thread.length === 0 && (
              <p className="mt-10 text-center text-sm text-white/45">
                Mulai percakapan dengan admin LASTQUESTION FOREX.
              </p>
            )}
            {thread.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === "admin" ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    msg.sender === "admin"
                      ? "border border-white/10 bg-white/[0.04] text-white/85"
                      : "bg-gradient-to-r from-electric to-neon text-white"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSend} className="mt-4 flex gap-2 border-t border-white/10 pt-4">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan untuk admin..."
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
            />
            <GlowButton type="submit" disabled={sending} icon={<Send size={15} />}>
              Kirim
            </GlowButton>
          </form>
        </GlassCard>
      </section>
    </PageTransition>
  );
}
