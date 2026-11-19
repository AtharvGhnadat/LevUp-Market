import { Search, X } from "lucide-react";
import { useState, type Ref } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { searchDemoProjects } from "@/data/demo-projects";
import { allProjectsLink, projectCategoryLinks } from "@/data/navigation";
import { to } from "@/lib/routes";

export function SearchDialog({ ref }: { ref: Ref<HTMLDialogElement> }) {
  const [query, setQuery] = useState("");
  const term = query.trim();
  const results = term ? searchDemoProjects(term) : [];

  return (
    <dialog
      ref={ref}
      id="navigation-search"
      aria-labelledby="navigation-search-title"
      onClose={() => setQuery("")}
      onClick={(event) => {
        if (event.target === event.currentTarget) event.currentTarget.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.currentTarget.close();
        }
      }}
      className="nav-dialog nav-search max-w-none overflow-y-auto rounded-lg border border-line bg-white p-0 text-alloy shadow-card"
    >
      <div className="border-b border-line bg-mineral px-3 py-2 sm:px-4">
        <div className="flex items-center justify-between gap-2">
          <h2 id="navigation-search-title" className="text-lg font-semibold">
            Search projects
          </h2>
          <button
            type="button"
            aria-label="Close search"
            className="nav-icon-control"
            onClick={(event) => event.currentTarget.closest("dialog")?.close()}
          >
            <X aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
          </button>
        </div>

        <form role="search" action={to("/projects")} method="get" className="my-1 flex gap-2">
          <div className="flex min-h-11 min-w-0 flex-1 items-center rounded-md border border-alloy/20 bg-white focus-within:border-volt-text focus-within:outline-2 focus-within:outline-volt-text">
            <label htmlFor="navigation-search-query" className="sr-only">
              Search projects and technologies
            </label>
            <input
              id="navigation-search-query"
              name="q"
              type="search"
              data-initial-focus
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search projects"
              className="min-w-0 flex-1 px-2.5 py-2 text-base placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                className="min-h-11 shrink-0 px-2 text-sm font-medium text-volt-text hover:underline"
                aria-label="Clear search"
                onClick={(event) => {
                  setQuery("");
                  event.currentTarget.form?.querySelector("input")?.focus();
                }}
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="submit"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-alloy px-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-alloy-soft sm:px-4"
          >
            <Search aria-hidden="true" className="size-[18px]" strokeWidth={1.75} />
            <span>Search</span>
          </button>
        </form>
      </div>

      <p role="status" className="sr-only">
        {term
          ? results.length
            ? `${results.length} project ${results.length === 1 ? "suggestion" : "suggestions"}`
            : "No matching projects"
          : ""}
      </p>
      {term ? (
        <SearchResults query={term} results={results} />
      ) : (
        <div className="p-2 sm:p-3">
          <p className="px-3 pt-1 pb-2 text-sm font-medium text-muted">Browse by category</p>
          <ul className="grid grid-cols-1 gap-1 min-[420px]:grid-cols-2">
            {projectCategoryLinks.map(({ href, label }) => (
              <li key={href}>
                <a href={to(href)} className="nav-panel-link h-full">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={to(allProjectsLink.href)}
            className="nav-panel-link mt-1 border-t border-line text-volt-text"
          >
            {allProjectsLink.label}
          </a>
        </div>
      )}
    </dialog>
  );
}
