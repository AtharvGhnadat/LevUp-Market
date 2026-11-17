import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "outline-copper" | "ink";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-display font-bold tracking-[-0.01em] transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "rounded-sm bg-copper-action text-white hover:bg-copper-action-hover",
  outline: "rounded-sm border-[1.5px] border-ink bg-transparent text-ink hover:bg-white",
  "outline-copper":
    "rounded-sm border-[1.5px] border-copper bg-transparent text-copper-ink hover:bg-copper-tint",
  ink: "rounded-md bg-ink text-white hover:bg-ink-soft",
};

const sizes: Record<Size, string> = {
  md: "h-10 px-5 text-[0.875rem]",
  lg: "h-[46px] px-6 text-[0.9375rem]",
};

type Common = { variant?: Variant; size?: Size; className?: string; children: ReactNode };

export function ButtonLink({
  variant = "primary",
  size = "lg",
  className,
  children,
  ...props
}: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </a>
  );
}

export function Button({
  variant = "primary",
  size = "lg",
  className,
  children,
  type = "button",
  ...props
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
