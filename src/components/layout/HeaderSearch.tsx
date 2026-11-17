import { Search } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SEARCH_NOTE, SearchResults } from "@/components/search/SearchResults";
import { searchDemoProjects } from "@/data/demo-projects";
import { to } from "@/lib/routes";

/** Inline desktop search field. Ctrl/⌘+K focuses it; Enter submits to /projects?q=. */
export function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLFormElement>(null);
  const listId = useId();
  const results = useMemo(() => searchDemoProjects(query), [query]);
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    function onPointer(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, []);

  const showPanel = open && query.trim().length > 0;

  return (
    <form
      ref={wrapRef}
      role="search"
      action={to("/projects")}
      method="get"
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <label htmlFor="header-search" className="sr-only">
        Search projects and technologies
      </label>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3.5 h-[18px] w-[18px] -translate-y-1/2 text-ink"
        strokeWidth={2}
      />
      <input
        ref={inputRef}
        id="header-search"
        name="q"
        type="search"
        autoComplete="off"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setOpen(false);
            e.currentTarget.blur();
          }
        }}
        aria-controls={showPanel ? listId : undefined}
        aria-expanded={showPanel}
        placeholder="Search projects, technologies..."
        className="h-10 w-[264px] rounded-md border border-line bg-white/70 pr-12 pl-10 text-[0.75rem] text-ink placeholder:text-muted transition-colors hover:border-ink/25 focus:border-ink/40 focus:bg-white focus:outline-none 2xl:w-[300px] [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 font-sans text-[0.6875rem] text-muted">
        {isMac ? "⌘ K" : "Ctrl K"}
      </kbd>

      {showPanel && (
        <div
          id={listId}
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-[380px] overflow-hidden rounded-md border border-line bg-white shadow-panel"
        >
          <SearchResults query={query} results={results} />
          <p className="border-t border-line bg-paper px-4 py-2 text-[0.6875rem] text-muted">
            {SEARCH_NOTE}
          </p>
        </div>
      )}
    </form>
  );
}
