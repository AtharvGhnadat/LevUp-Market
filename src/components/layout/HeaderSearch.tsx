import { Search } from "lucide-react";
import type { Ref } from "react";

export function HeaderSearch({ ref, onOpen }: { ref: Ref<HTMLButtonElement>; onOpen: () => void }) {
  const shortcut = /Mac|iPhone|iPad/.test(window.navigator.platform) ? "? K" : "Ctrl K";

  return (
    <button
      ref={ref}
      type="button"
      onClick={onOpen}
      aria-label="Search projects"
      aria-haspopup="dialog"
      aria-controls="navigation-search"
      aria-keyshortcuts="Control+K Meta+K"
      className="nav-icon-control min-[75rem]:w-44 min-[75rem]:justify-start min-[75rem]:gap-2.5 min-[75rem]:border min-[75rem]:border-alloy/20 min-[75rem]:bg-white min-[75rem]:px-3 min-[87.5rem]:w-56"
    >
      <Search aria-hidden="true" className="size-[18px] shrink-0" strokeWidth={1.75} />
      <span className="hidden text-sm font-medium min-[75rem]:inline">Search projects</span>
      <kbd
        aria-hidden="true"
        className="ml-auto hidden rounded-xs border border-line bg-mineral px-1.5 py-0.5 font-mono text-xs text-muted min-[87.5rem]:inline"
      >
        {shortcut}
      </kbd>
    </button>
  );
}
