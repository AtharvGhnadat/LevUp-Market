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
        className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted"
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
        className="h-10 w-[264px] rounded-md border border-line bg-white/80 pr-14 pl-9 text-xs text-alloy placeholder:text-muted/80 transition-colors hover:border-alloy/25 focus:border-volt-action focus:bg-white focus:ring-1 focus:ring-volt-action focus:outline-none 2xl:w-[300px] [&::-webkit-search-cancel-button]:hidden"
      />
      <kbd className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 rounded border border-line bg-mineral-deep px-1.5 py-0.5 font-mono text-[0.625rem] text-muted shadow-xs">
        {isMac ? "⌘ K" : "Ctrl K"}
      </kbd>

      {showPanel && (
        <div
          id={listId}
          className="absolute top-[calc(100%+8px)] right-0 z-50 w-[380px] overflow-hidden rounded-md border border-line bg-white shadow-panel"
        >
          <SearchResults query={query} results={results} />
          <p className="border-t border-line bg-mineral px-4 py-2 font-mono text-[0.6875rem] text-muted">
            {SEARCH_NOTE}
          </p>
        </div>
      )}
    </form>
  );
}
