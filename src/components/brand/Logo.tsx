import { to } from "@/lib/routes";
import { cn } from "@/lib/cn";

/** Isometric engineering block: copper faces with a slate-shadowed side. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 44"
      aria-hidden="true"
      className={cn("h-[34px] w-[31px] shrink-0 sm:h-[40px] sm:w-[36px]", className)}
    >
      <path d="M20 2 38 12 20 22 2 12Z" fill="#E8955A" />
      <path d="M2 12 20 22v20L2 32Z" fill="#D97736" />
      <path d="M38 12 20 22v20l18-10Z" fill="#A9531F" />
      <path d="M2 12 20 22v20L2 32Z" fill="#172D38" fillOpacity=".18" />
      <path d="M26 24.5 32 21v7l-6 3.5Z" fill="#172D38" />
      <path d="M8 22.5 14 26v5l-6-3.5Z" fill="#F7F8F5" fillOpacity=".55" />
    </svg>
  );
}

export function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <a
      href={to("/")}
      className="inline-flex shrink-0 items-center gap-2"
      aria-label="LevUp Projects home"
    >
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-[1.125rem] font-extrabold tracking-[-0.035em] sm:text-[1.3125rem]",
            tone === "light" ? "text-ink" : "text-white",
          )}
        >
          LevUp <span className="text-copper">Projects</span>
        </span>
        <span
          className={cn(
            "mt-1 hidden text-[0.625rem] font-medium tracking-[0.005em] min-[400px]:block",
            tone === "light" ? "text-ink/80" : "text-white/75",
          )}
        >
          Engineering Projects &amp; Development
        </span>
      </span>
    </a>
  );
}
