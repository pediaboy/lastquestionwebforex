import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  shape?: "pill" | "cut";
  children: ReactNode;
  className?: string;
  target?: string;
  icon?: ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
};

export default function GlowButton({
  href,
  onClick,
  variant = "primary",
  shape = "pill",
  children,
  className = "",
  target,
  icon,
  type = "button",
  disabled = false,
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap disabled:opacity-50 disabled:pointer-events-none";

  const shapeClass = shape === "cut" ? "" : "rounded-full";
  const cutStyle =
    shape === "cut"
      ? { clipPath: "polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)" }
      : undefined;

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-electric to-neon text-white shadow-glow hover:shadow-glow-strong hover:-translate-y-0.5",
    secondary:
      shape === "cut"
        ? "border border-neon/50 text-neon hover:bg-neon/10 hover:-translate-y-0.5"
        : "glass text-white hover:border-electric/50 hover:-translate-y-0.5",
    ghost: "text-white/80 hover:text-white underline underline-offset-4",
  };

  const classes = `${base} ${shapeClass} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} target={target} className={classes} style={cutStyle}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes} style={cutStyle}>
      {icon}
      {children}
    </button>
  );
}
