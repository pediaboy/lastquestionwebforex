import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
  className?: string;
  target?: string;
  icon?: ReactNode;
};

export default function GlowButton({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  target,
  icon,
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 whitespace-nowrap";

  const variants: Record<string, string> = {
    primary:
      "bg-gradient-to-r from-electric to-neon text-white shadow-glow hover:shadow-glow-strong hover:-translate-y-0.5",
    secondary:
      "glass text-white hover:border-electric/50 hover:-translate-y-0.5",
    ghost: "text-white/80 hover:text-white underline underline-offset-4",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} target={target} className={classes}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {icon}
      {children}
    </button>
  );
}
