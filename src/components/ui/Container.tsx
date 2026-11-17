import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Page container. `content` = 1284px reference column; `wide` = 1316px used by
 * the custom banner and reliability panel, which sit slightly outside the column.
 */
export function Container({
  className,
  size = "content",
  children,
}: {
  className?: string;
  size?: "content" | "wide";
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        size === "content" ? "max-w-[1348px] px-5 sm:px-8" : "max-w-[1348px] px-4 sm:px-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
