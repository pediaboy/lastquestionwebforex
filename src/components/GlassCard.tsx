import { ReactNode } from "react";

export default function GlassCard({
  children,
  className = "",
  glow = false,
}: {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <div
      className={`glass rounded-2xl shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-electric/40 ${
        glow ? "shadow-glow hover:shadow-glow-strong" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
