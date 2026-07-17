"use client";

import { ReactNode } from "react";
import { Lock } from "lucide-react";
import GlowButton from "./GlowButton";
import { waLink } from "@/lib/constants";

export default function PremiumGate({
  isVip,
  children,
}: {
  isVip: boolean;
  children: ReactNode;
}) {
  if (isVip) return <>{children}</>;

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="pointer-events-none select-none blur-md">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-base-black/70 p-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-electric/10 text-neon">
          <Lock size={22} />
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-white">
            Konten Khusus VIP
          </p>
          <p className="mt-1 max-w-xs text-sm text-white/55">
            Upgrade membership untuk membuka akses penuh ke konten ini.
          </p>
        </div>
        <GlowButton
          href={waLink("Halo Admin, saya ingin upgrade ke VIP untuk akses Sinyal.")}
          target="_blank"
        >
          Upgrade ke VIP
        </GlowButton>
      </div>
    </div>
  );
}
