import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Section label: short caliper rule followed by a sentence-case mono caption. */
export function Eyebrow({
  children,
  tone = "light",
  align = "start",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  align?: "start" | "center";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-xs font-medium tracking-[0.01em]",
        tone === "light" ? "text-muted" : "text-muted-on-alloy",
        align === "center" && "justify-center",
        className,
      )}
    >
      <span aria-hidden="true" className="h-[2px] w-6 shrink-0 rounded-full bg-volt-action" />
      <span>{children}</span>
    </p>
  );
}
