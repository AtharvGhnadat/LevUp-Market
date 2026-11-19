import { Logo } from "@/components/brand/Logo";
import { to } from "@/lib/routes";

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  return (
    <footer
      className={
        compact
          ? "border-t border-line bg-mineral"
          : "border-t border-alloy-line bg-alloy text-mineral"
      }
    >
      <div className="mx-auto flex max-w-[1348px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-5 py-5 sm:px-8">
        {compact ? (
          <small className="text-sm text-muted">© {new Date().getFullYear()} LevUp Projects</small>
        ) : (
          <Logo tone="dark" />
        )}
        <nav aria-label="Footer" className="flex flex-wrap gap-x-5">
          {(compact
            ? [
                ["Project catalog", "/projects"],
                ["How it works", "/#how-it-works"],
              ]
            : [
                ["All projects", "/projects"],
                ["Custom development", "/custom-project"],
                ["How it works", "/#how-it-works"],
                ["Resources", "/resources"],
                ["About", "/about"],
                ["Account settings", "/account"],
              ]
          ).map(([label, path]) => (
            <a
              key={path}
              href={to(path)}
              className="inline-flex min-h-11 items-center text-sm underline-offset-4 hover:underline"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
