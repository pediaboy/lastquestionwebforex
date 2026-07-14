import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import PageTransition from "@/components/PageTransition";
import blogData from "@/data/blog.json";

type Post = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  date: string;
};

const posts = blogData as Post[];

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Artikel Tidak Ditemukan" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = posts.find((p) => p.slug === params.slug);
  if (!post) return notFound();

  return (
    <PageTransition>
      <article className="section-pad pt-36 md:pt-44">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-neon"
          >
            <ArrowLeft size={16} /> Kembali ke Blog
          </Link>

          <div className="mb-4 flex items-center gap-2 text-xs text-neon">
            <Tag size={13} />
            {post.category}
          </div>

          <h1 className="font-display text-2xl font-bold text-white md:text-4xl">
            {post.title}
          </h1>

          <div className="mt-4 flex items-center gap-4 text-xs text-white/40">
            <span>{post.date}</span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {post.readTime}
            </span>
          </div>

          <GlassCard className="mt-10 p-6 md:p-10">
            <div className="space-y-5 text-sm leading-relaxed text-white/65 md:text-base">
              {post.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </GlassCard>
        </div>
      </article>
    </PageTransition>
  );
}
