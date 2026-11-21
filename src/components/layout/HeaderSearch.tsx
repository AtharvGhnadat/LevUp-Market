import { Search } from "lucide-react";
import type { Ref } from "react";

export function HeaderSearch({ ref, onOpen }: { ref: Ref<HTMLButtonElement>; onOpen: () => void }) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-label="Search projects"
      aria-haspopup="dialog"
      aria-controls="navigation-search"
      aria-keyshortcuts="Control+K Meta+K"
      className="nav-icon-control market-search"
    >
      <Search aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.75} />
      <span className="hidden truncate text-sm text-muted sm:block">
        Search projects<span className="hidden min-[95rem]:inline">, technologies…</span>
      </span>
    </button>
  );
}
