import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Section label: short copper rule followed by an uppercase caption. */
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
        "flex items-center gap-3 font-sans text-eyebrow font-medium uppercase",
        tone === "light" ? "text-ink" : "text-white/90",
        align === "center" && "justify-center",
        className,
      )}
    >
      <span aria-hidden="true" className="h-[2px] w-7 shrink-0 rounded-full bg-copper" />
      <span>{children}</span>
    </p>
  );
}
