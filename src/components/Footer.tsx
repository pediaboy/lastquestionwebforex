import Link from "next/link";
import { Instagram, Send, MessageCircle } from "lucide-react";
import { NAV_LINKS, SITE, waLink } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-base-black">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-neon to-electric shadow-glow" />
              <span className="font-display text-lg font-bold text-white">
                {SITE.name}
              </span>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/50">
              {SITE.description}
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
              Navigasi
            </h4>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/60 transition-colors hover:text-neon"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/40">
              Kontak
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-neon"
                >
                  <Instagram size={16} /> {SITE.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={SITE.telegramBot}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-neon"
                >
                  <Send size={16} /> Telegram
                </a>
              </li>
              <li>
                <a
                  href={waLink("Halo LASTQUESTION FOREX, saya ingin bertanya.")}
                  target="_blank"
                  className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-neon"
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-8">
          <p className="text-xs leading-relaxed text-white/35">
            <strong className="text-white/50">Disclaimer:</strong> Trading
            Forex dan Crypto memiliki risiko tinggi. Seluruh materi, analisis,
            dan pembelajaran yang disediakan {SITE.name} bertujuan sebagai
            edukasi dan referensi. Tidak ada jaminan keuntungan maupun
            kepastian hasil trading. Keputusan transaksi sepenuhnya menjadi
            tanggung jawab masing-masing pengguna.
          </p>
          <p className="mt-4 text-xs text-white/30">
            © {new Date().getFullYear()} {SITE.name}. Trading Community sejak{" "}
            {SITE.foundedYear}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
