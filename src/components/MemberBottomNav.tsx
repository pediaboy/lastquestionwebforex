"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GraduationCap, Radar, User } from "lucide-react";

const TABS = [
  { href: "/dashboard-member", label: "Home", icon: Home, exact: true },
  { href: "/dashboard-member/kelas", label: "Kelas", icon: GraduationCap, exact: false },
  { href: "/dashboard-member/sinyal", label: "Sinyal", icon: Radar, exact: false },
  { href: "/dashboard-member/profil", label: "Profil", icon: User, exact: false },
];

export default function MemberBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-base-black/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {TABS.map((tab) => {
          const active = tab.exact ? pathname === tab.href : pathname?.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors ${
                active ? "text-neon" : "text-white/45 hover:text-white/70"
              }`}
            >
              {active && (
                <span className="absolute -top-1.5 h-0.5 w-8 rounded-full bg-neon" />
              )}
              <tab.icon size={20} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
