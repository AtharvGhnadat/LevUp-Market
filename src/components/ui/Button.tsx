import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "outline-copper" | "ink" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display font-semibold transition-[color,background-color,border-color,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-volt-action disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "rounded-lg bg-volt-action text-white hover:bg-volt-action-hover shadow-xs",
  outline: "rounded-lg border border-alloy/30 bg-transparent text-alloy hover:bg-white shadow-xs",
  "outline-copper":
    "rounded-lg border border-volt-action/50 bg-transparent text-volt-text hover:bg-volt-tint/60",
  ink: "rounded-lg bg-alloy text-white hover:bg-alloy-soft shadow-xs",
  ghost: "rounded-lg bg-transparent text-alloy hover:bg-mineral-deep",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3.5 text-[0.8125rem]",
  md: "h-10 px-5 text-[0.875rem]",
  lg: "h-11 px-6 text-[0.9375rem]",
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
