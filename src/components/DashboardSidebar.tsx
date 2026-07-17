"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  GraduationCap,
  BookOpen,
  PlayCircle,
  LineChart,
  Radar,
  Newspaper,
  CalendarClock,
  NotebookPen,
  History,
  Calculator,
  PiggyBank,
  BookMarked,
  Trophy,
  MessagesSquare,
  Headset,
  Megaphone,
  Menu,
  X,
} from "lucide-react";
import { SITE } from "@/lib/constants";

const NAV_GROUPS = [
  {
    label: "Utama",
    items: [
      { href: "/dashboard-member", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard-member/profil", label: "Profil & Akun", icon: User },
    ],
  },
  {
    label: "Belajar",
    items: [
      { href: "/dashboard-member/kelas", label: "Katalog Kelas", icon: GraduationCap },
      { href: "/dashboard-member/modul", label: "Modul Trading", icon: BookOpen },
      { href: "/dashboard-member/video", label: "Video Materi", icon: PlayCircle },
      { href: "/dashboard-member/glosarium", label: "Glosarium", icon: BookMarked },
    ],
  },
  {
    label: "Market",
    items: [
      { href: "/dashboard-member/chart", label: "Chart Realtime", icon: LineChart },
      { href: "/dashboard-member/sinyal", label: "Sinyal Trading", icon: Radar },
      { href: "/dashboard-member/analisa", label: "Analisa & Outlook", icon: Newspaper },
      { href: "/dashboard-member/kalender", label: "Kalender Ekonomi", icon: CalendarClock },
    ],
  },
  {
    label: "Performa",
    items: [
      { href: "/dashboard-member/jurnal", label: "Jurnal Trading", icon: NotebookPen },
      { href: "/dashboard-member/riwayat", label: "Track Record", icon: History },
      { href: "/dashboard-member/kalkulator-lot", label: "Kalkulator Lot & Margin", icon: Calculator },
      { href: "/dashboard-member/kalkulator-profit", label: "Kalkulator Profit", icon: PiggyBank },
      { href: "/dashboard-member/leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
  {
    label: "Komunitas",
    items: [
      { href: "/dashboard-member/komunitas", label: "Diskusi Komunitas", icon: MessagesSquare },
      { href: "/dashboard-member/chat", label: "Chat Admin", icon: Headset },
      { href: "/dashboard-member/pengumuman", label: "Pengumuman", icon: Megaphone },
    ],
  },
];

function SidebarContent({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-electric/15 text-neon">
          <LineChart size={18} />
        </div>
        <div>
          <p className="font-display text-sm font-bold text-white">{SITE.shortName}</p>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Member Area</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/35">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                      active
                        ? "bg-electric/15 text-neon"
                        : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    <item.icon size={16} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/10 bg-base-black lg:block">
        <SidebarContent pathname={pathname} />
      </aside>

      {/* Mobile topbar trigger (fixed so it overlays correctly regardless of DOM position) */}
      <button
        onClick={() => setMobileOpen(true)}
        aria-label="Buka menu navigasi"
        className="fixed left-4 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0a0e14] text-white/80 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Mobile slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-white/10 bg-base-black shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Tutup menu navigasi"
              className="absolute right-3 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70"
            >
              <X size={18} />
            </button>
            <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}
