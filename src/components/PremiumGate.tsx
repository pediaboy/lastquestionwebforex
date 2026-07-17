"use client";

import { ReactNode } from "react";
import { Lock } from "lucide-react";
import GlowButton from "./GlowButton";
import { waLink } from "@/lib/constants";

export default function PremiumGate({
  isVip,
  children,
  compact = false,
}: {
  isVip: boolean;
  children: ReactNode;
  /** Use a smaller/tighter overlay — for locked items inside short list rows/cards. */
  compact?: boolean;
}) {
  if (isVip) return <>{children}</>;

  return (
    <div
      className={`relative isolate overflow-hidden rounded-2xl ${
        compact ? "min-h-[168px]" : "min-h-[260px]"
      }`}
    >
      {/* Blurred preview of the gated content. Scaled up + offset beyond the
          clipped bounds so the blur filter has real pixels to sample from —
          without this, blur-md against a hard overflow-hidden edge produces
          a visible, "unfinished" looking seam right at the border. */}
      <div className="absolute -inset-3 scale-110 blur-lg pointer-events-none select-none">
        {children}
      </div>

      {/* Overlay sits on its own layer, sized to the full gate (not just the
          content height), so the icon/copy/button always have room and never
          get clipped by the parent's overflow-hidden. */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-base-black/75 text-center ${
          compact ? "gap-2 p-4" : "gap-4 p-6"
        }`}
      >
        <div
          className={`flex items-center justify-center rounded-2xl bg-electric/10 text-neon ${
            compact ? "h-9 w-9" : "h-12 w-12"
          }`}
        >
          <Lock size={compact ? 16 : 22} />
        </div>
        <div>
          <p className={`font-display font-semibold text-white ${compact ? "text-sm" : "text-lg"}`}>
            Konten Khusus VIP
          </p>
          {!compact && (
            <p className="mt-1 max-w-xs text-sm text-white/55">
              Upgrade membership untuk membuka akses penuh ke konten ini.
            </p>
          )}
        </div>
        <GlowButton
          href={waLink("Halo Admin, saya ingin upgrade ke VIP untuk akses Sinyal.")}
          target="_blank"
          className={compact ? "!px-4 !py-2 !text-xs" : ""}
        >
          Upgrade ke VIP
        </GlowButton>
      </div>
    </div>
  );
}
