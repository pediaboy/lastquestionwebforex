import type { Metadata } from "next";
import { Clock, Tag } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import blogData from "@/data/blog.json";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Artikel edukasi Forex, Crypto, Gold, dan Bitcoin dari LASTQUESTION FOREX.",
};

export default function BlogPage() {
  return (
    <PageTransition>
      <section className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-neon/80">
            Blog
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
            Artikel & Edukasi Trading
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
            Bacaan seputar Forex, Crypto, Gold, dan psikologi trading —
            ditulis untuk membantu kamu memahami pasar lebih dalam.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogData.map((post) => (
            <GlassCard key={post.slug} className="relative flex flex-col p-6" glow>
              <Link href={`/blog/${post.slug}`} className="absolute inset-0" aria-label={post.title} />
              <div className="mb-3 flex items-center gap-2 text-xs text-neon">
                <Tag size={13} />
                {post.category}
              </div>
              <h2 className="font-display text-lg font-semibold text-white">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/55">
                {post.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-white/40">
                <span>{post.date}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="relative z-10 mt-4 flex items-center gap-1.5 text-sm font-medium text-neon"
              >
                Baca Selengkapnya <ArrowRight size={14} />
              </Link>
            </GlassCard>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
