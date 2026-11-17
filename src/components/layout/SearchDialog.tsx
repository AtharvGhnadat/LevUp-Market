import { Search, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { SEARCH_NOTE, SearchResults } from "@/components/search/SearchResults";
import { categories } from "@/data/categories";
import { searchDemoProjects } from "@/data/demo-projects";
import { to } from "@/lib/routes";

/** Full-width search used on tablet and mobile, where the inline field is hidden. */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const titleId = useId();
  const results = useMemo(() => searchDemoProjects(query), [query]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      className="m-0 mx-auto mt-[8vh] w-[min(640px,calc(100%-2rem))] max-w-none rounded-md border border-line bg-white p-0 text-ink shadow-panel backdrop:bg-ink/55"
    >
      <h2 id={titleId} className="sr-only">
        Search projects
      </h2>
      <form
        role="search"
        action={to("/projects")}
        method="get"
        className="flex items-center gap-3 border-b border-line px-4"
      >
        <Search aria-hidden="true" className="h-5 w-5 shrink-0 text-muted" />
        <label htmlFor="dialog-search" className="sr-only">
          Search projects and technologies
        </label>
        <input
          ref={inputRef}
          id="dialog-search"
          name="q"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects, technologies..."
          className="h-14 w-full bg-transparent text-base text-ink placeholder:text-muted focus:outline-none"
        />
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm p-2 text-muted hover:bg-paper hover:text-ink"
          aria-label="Close search"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </form>
      <div className="max-h-[60vh] overflow-y-auto" aria-live="polite">
        {query.trim() ? (
          <SearchResults query={query} results={results} />
        ) : (
          <div className="p-4">
            <p className="text-eyebrow font-medium text-muted uppercase">Browse categories</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <a
                    href={to(`/categories/${c.slug}`)}
                    className="inline-block rounded-sm border border-line px-3 py-1.5 text-sm text-ink hover:border-ink"
                  >
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <p className="border-t border-line bg-paper px-4 py-2.5 text-xs text-muted">{SEARCH_NOTE}</p>
    </dialog>
  );
}
