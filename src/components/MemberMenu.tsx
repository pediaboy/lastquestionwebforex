"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MoreVertical, User, NotebookText, LogOut } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const ITEMS = [
  { href: "/dashboard-member/profil", label: "Profil", icon: User },
  { href: "/dashboard-member/riwayat", label: "History Jurnal", icon: NotebookText },
];

export default function MemberMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="relative z-50 shrink-0 pointer-events-auto" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Menu akun member"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-[#0a0e14] text-white/80 transition-colors hover:border-electric/50 hover:text-white"
      >
        <MoreVertical size={20} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-[100] mt-2 w-56 max-w-[85vw] overflow-hidden rounded-xl border border-white/15 shadow-2xl shadow-black/70"
          style={{ backgroundColor: "#0a0e14" }}
        >
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-white"
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            role="menuitem"
            className="flex w-full items-center gap-3 border-t border-white/15 px-4 py-3 text-left text-sm text-red-300 transition-colors hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
