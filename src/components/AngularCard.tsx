import { ReactNode } from "react";

// Cut-corner "angular" card — a different motif from GlassCard, used to break the
// visual monotony of having every box on the site look identical.
// Top-right and bottom-left corners are diagonally notched via clip-path,
// with a thin gradient border achieved by stacking two clipped layers.
const NOTCH = 26;
const outerClip = `polygon(0 0, calc(100% - ${NOTCH}px) 0, 100% ${NOTCH}px, 100% 100%, ${NOTCH}px 100%, 0 calc(100% - ${NOTCH}px))`;
const innerClip = `polygon(0 0, calc(100% - ${NOTCH - 1}px) 0, 100% ${NOTCH - 1}px, 100% 100%, ${
  NOTCH - 1
}px 100%, 0 calc(100% - ${NOTCH - 1}px))`;

export default function AngularCard({
  children,
  className = "",
  index,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <div
      className="group relative bg-gradient-to-br from-neon/40 via-electric/25 to-white/5 p-px transition-all duration-300 hover:-translate-y-1 hover:from-neon/70 hover:via-electric/50"
      style={{ clipPath: outerClip }}
    >
      <div
        className={`relative h-full w-full bg-[#070c17] transition-colors duration-300 group-hover:bg-[#0a1120] ${className}`}
        style={{ clipPath: innerClip }}
      >
        {/* top-right decorative status mark, echoing the reference motif */}
        <span className="pointer-events-none absolute right-4 top-4 flex items-center gap-1">
          <span className="h-[3px] w-4 rounded-full bg-neon/70" />
          <span className="h-1 w-1 rounded-full bg-neon/70" />
        </span>

        {typeof index === "number" && (
          <span className="mb-4 inline-block border border-white/15 px-2 py-0.5 font-display text-[10px] uppercase tracking-[0.2em] text-neon/80">
            SEC_ID: {String(index + 1).padStart(3, "0")}
          </span>
        )}

        {children}
      </div>
    </div>
  );
}
