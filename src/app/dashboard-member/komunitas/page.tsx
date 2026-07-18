"use client";

import { useEffect, useState, FormEvent } from "react";
import { MessagesSquare, Loader2, Send } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import GlowButton from "@/components/GlowButton";
import PageTransition from "@/components/PageTransition";
import { useMemberAuth } from "@/lib/MemberAuthContext";

type Post = { id: string; author_name: string; message: string; created_at: string };

export default function KomunitasPage() {
  const { accessToken } = useMemberAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    let active = true;
    async function load() {
      const res = await fetch("/api/community", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.json();
      if (!active) return;
      setPosts(json.posts || []);
      setLoading(false);
    }
    load();
    return () => {
      active = false;
    };
  }, [accessToken]);

  async function handleSend(e: FormEvent) {
    e.preventDefault();
    if (!accessToken || !message.trim()) return;
    setSending(true);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ message }),
    });
    const json = await res.json();
    if (json.post) setPosts((prev) => [json.post, ...prev]);
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
            <MessagesSquare size={20} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-neon/80">Dashboard Member</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-white md:text-3xl">
              Diskusi Komunitas
            </h1>
          </div>
        </div>

        <GlassCard glow className="mt-6 p-5">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Bagikan pandangan atau pertanyaanmu ke komunitas..."
              className="flex-1 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm text-white outline-none focus:border-electric/50"
            />
            <GlowButton type="submit" disabled={sending} icon={<Send size={15} />}>
              Kirim
            </GlowButton>
          </form>
        </GlassCard>

        <div className="mt-5 space-y-3">
          {posts.length === 0 && (
            <GlassCard className="p-8 text-center text-sm text-white/50">
              Belum ada diskusi. Jadilah yang pertama memulai percakapan.
            </GlassCard>
          )}
          {posts.map((post) => (
            <GlassCard key={post.id} className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{post.author_name}</p>
                <p className="text-xs text-white/40">
                  {new Date(post.created_at).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-white/70">{post.message}</p>
            </GlassCard>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
