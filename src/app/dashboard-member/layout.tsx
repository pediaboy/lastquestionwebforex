"use client";

import { Loader2 } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import MemberMenu from "@/components/MemberMenu";
import MemberBottomNav from "@/components/MemberBottomNav";
import { SITE } from "@/lib/constants";
import { MemberAuthProvider, useMemberAuth } from "@/lib/MemberAuthContext";

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { loading } = useMemberAuth();

  if (loading) {
    return (
      <section className="flex min-h-[100svh] items-center justify-center">
        <Loader2 className="animate-spin text-neon" size={28} />
      </section>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardSidebar />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-white/10 bg-base-black/95 px-4 py-3 backdrop-blur md:px-6">
          <p className="hidden text-sm font-medium text-white/50 lg:block">
            {SITE.shortName} Member Area
          </p>
          <p className="pl-12 text-sm font-medium text-white/50 lg:hidden">
            {SITE.shortName}
          </p>
          <MemberMenu />
        </header>

        <main className="px-4 pb-24 pt-4 md:px-6 lg:pb-16">{children}</main>
        <MemberBottomNav />
      </div>
    </div>
  );
}

export default function DashboardMemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <MemberAuthProvider>
      <DashboardShell>{children}</DashboardShell>
    </MemberAuthProvider>
  );
}
