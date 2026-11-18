import { ArrowRight, Grid2X2, List, Search, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  activeFilterCount,
  catalogUrlParams,
  emptyCatalogFilters,
  filterCatalog,
  parseCatalogUrl,
  sortCatalog,
  type CatalogFilters,
  type CatalogSortValue,
  type CatalogView,
} from "@/catalog/catalog-state";
import { ActiveFilterChips } from "@/components/catalog/ActiveFilterChips";
import { CatalogFilterPanel } from "@/components/catalog/CatalogFilterPanel";
import { CatalogPagination } from "@/components/catalog/CatalogPagination";
import { CatalogProjectCard } from "@/components/catalog/CatalogProjectCard";
import { CatalogEmptyState, CatalogLoadingState } from "@/components/catalog/CatalogStates";
import { MobileFilterDrawer } from "@/components/catalog/MobileFilterDrawer";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { catalogProjects } from "@/data/catalog-projects";
import { cn } from "@/lib/cn";
import { to } from "@/lib/routes";

const PAGE_SIZE = 6;

export function ProjectsPage() {
  const initial = useMemo(() => parseCatalogUrl(window.location.search), []);
  const [filters, setFilters] = useState<CatalogFilters>(initial.filters);
  const [searchInput, setSearchInput] = useState(initial.filters.query);
  const [sort, setSort] = useState<CatalogSortValue>(initial.sort);
  const [page, setPage] = useState(initial.page);
  const [view, setView] = useState<CatalogView>(initial.view);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const resultsTopRef = useRef<HTMLDivElement>(null);
  const loadingTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = "Explore Engineering Projects — LevUp Projects";
    if (description) {
      description.content =
        "Search and filter demonstration software, AI, IoT, electronics, robotics, embedded systems and simulation projects from LevUp Projects.";
    }
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.content = previousDescription;
    };
  }, []);

  // Search is intentionally debounced; local card filtering remains fast while
  // matching the behavior expected from the future server-backed catalog.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setFilters((current) =>
        current.query === searchInput ? current : { ...current, query: searchInput },
      );
      setPage(1);
    }, 280);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const matchingProjects = useMemo(
    () => sortCatalog(filterCatalog(catalogProjects, filters), sort),
    [filters, sort],
  );
  const pageCount = Math.max(1, Math.ceil(matchingProjects.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pageProjects = matchingProjects.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => {
    const params = catalogUrlParams(filters, sort, safePage, view);
    const query = params.toString();
    window.history.replaceState(null, "", `${to("/projects")}${query ? `?${query}` : ""}`);
  }, [filters, sort, safePage, view]);

  const updateFilters = (next: CatalogFilters) => {
    setFilters(next);
    setPage(1);
  };

  const clearAll = () => {
    setSearchInput("");
    setFilters({ ...emptyCatalogFilters });
    setPage(1);
  };

  const changePage = (nextPage: number) => {
    window.clearTimeout(loadingTimer.current);
    setLoading(true);
    setPage(Math.min(Math.max(nextPage, 1), pageCount));
    resultsTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    loadingTimer.current = window.setTimeout(() => setLoading(false), 180);
  };

  const removeFilter = (key: keyof CatalogFilters, value: string) => {
    if (key === "customization" || key === "minPrice" || key === "maxPrice") {
      updateFilters({ ...filters, [key]: key === "customization" ? null : "" });
      return;
    }
    updateFilters({
      ...filters,
      [key]: (filters[key] as string[]).filter((item) => item !== value),
    });
  };

  const filterCount = activeFilterCount(filters);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <Container className="py-10 sm:py-12 lg:py-14">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <Eyebrow>Project Library</Eyebrow>
              <h1 className="mt-3 font-display text-[2rem] leading-tight font-semibold tracking-[-0.025em] text-ink sm:text-[2.5rem]">
                Explore Engineering Projects
              </h1>
              <p className="mt-4 max-w-3xl text-[0.9375rem] leading-[1.7] text-muted">
                Find documented software, AI, IoT, electronics, robotics, embedded systems and
                simulation projects. Compare delivery modes, technologies and included packages
                before opening the complete specification.
              </p>
            </div>
            <p className="max-w-sm border-l-2 border-copper pl-4 text-sm leading-relaxed text-muted">
              Cannot find the exact scope you need?{" "}
              <a
                href={to("/custom-project")}
                className="font-semibold text-copper-ink hover:underline"
              >
                Request a Custom Project
              </a>
              .
            </p>
          </div>

          <form
            role="search"
            className="mt-8 flex max-w-4xl flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setFilters({ ...filters, query: searchInput });
              setPage(1);
            }}
          >
            <div className="relative flex-1">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted"
              />
              <label htmlFor="catalog-search" className="sr-only">
                Search by project name, keyword, technology, language, platform, tool or project ID
              </label>
              <input
                id="catalog-search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search projects, stack or ID"
                className="h-12 w-full rounded-lg border border-line bg-white pr-12 pl-12 text-sm text-ink shadow-card placeholder:text-muted focus:border-volt-action focus:outline-none"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-2 text-muted hover:bg-paper hover:text-ink"
                  aria-label="Clear search"
                >
                  <X aria-hidden="true" className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button type="submit" size="lg" className="h-12 px-7">
              Search Projects
            </Button>
          </form>
          <p className="mt-2 text-[0.6875rem] text-muted">
            Search covers project names, keywords, technologies, languages, hardware platforms,
            software tools and readable project IDs.
          </p>
        </Container>
      </section>

      <section aria-label="Project catalog" className="bg-paper py-8 sm:py-10">
        <Container>
          <div ref={resultsTopRef} className="scroll-mt-24" />
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5 lg:hidden">
            <button
              type="button"
              onClick={() => setFilterDrawerOpen(true)}
              className="inline-flex h-10 items-center gap-2 rounded-sm border border-ink bg-white px-4 text-sm font-semibold text-ink"
            >
              <SlidersHorizontal aria-hidden="true" className="h-4 w-4" />
              Filters
              {filterCount > 0 && (
                <span className="rounded-full bg-copper-tint px-2 py-0.5 text-xs text-copper-ink">
                  {filterCount}
                </span>
              )}
            </button>
            <CatalogSort
              value={sort}
              onChange={(value) => {
                setSort(value);
                setPage(1);
              }}
              compact
            />
          </div>

          <div className="grid gap-7 lg:grid-cols-[276px_minmax(0,1fr)]">
            <aside className="hidden lg:block" aria-label="Catalog filters">
              <div className="sticky top-24 rounded-xl border border-line bg-white px-5 shadow-card">
                <div className="flex h-14 items-center justify-between border-b border-line">
                  <h2 className="font-display text-[0.9375rem] font-semibold text-ink">
                    Filter Projects
                  </h2>
                  {filterCount > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-[0.75rem] font-semibold text-copper-ink hover:underline"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <CatalogFilterPanel filters={filters} onChange={updateFilters} />
                <Button
                  type="button"
                  size="md"
                  className="my-5 w-full"
                  onClick={() => resultsTopRef.current?.scrollIntoView({ behavior: "smooth" })}
                >
                  Apply filters · {matchingProjects.length}
                </Button>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="hidden min-h-14 items-center justify-between gap-5 border-b border-line pb-4 lg:flex">
                <ResultCount count={matchingProjects.length} page={safePage} />
                <div className="flex items-center gap-3">
                  <ViewToggle view={view} onChange={setView} />
                  <CatalogSort
                    value={sort}
                    onChange={(value) => {
                      setSort(value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3 lg:hidden">
                <ResultCount count={matchingProjects.length} page={safePage} />
                <ViewToggle view={view} onChange={setView} />
              </div>

              <div className="mt-4">
                <ActiveFilterChips filters={filters} onRemove={removeFilter} onClear={clearAll} />
              </div>

              <div className="mt-5" aria-live="polite">
                {loading ? (
                  <CatalogLoadingState view={view} />
                ) : pageProjects.length ? (
                  <ul
                    className={
                      view === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-5"
                    }
                  >
                    {pageProjects.map((project) => (
                      <li key={project.id}>
                        <CatalogProjectCard project={project} view={view} />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <CatalogEmptyState onClear={clearAll} />
                )}
              </div>

              <CatalogPagination
                page={safePage}
                pageCount={matchingProjects.length ? pageCount : 0}
                onPageChange={changePage}
              />
            </div>
          </div>
        </Container>
      </section>

      <CatalogCustomProjectCTA />

      <MobileFilterDrawer
        open={filterDrawerOpen}
        filters={filters}
        resultsCount={matchingProjects.length}
        onChange={updateFilters}
        onClear={clearAll}
        onClose={() => setFilterDrawerOpen(false)}
      />
    </>
  );
}

function ResultCount({ count, page }: { count: number; page: number }) {
  return (
    <p className="text-sm text-muted" aria-live="polite">
      <strong className="font-display text-base font-semibold text-ink tabular-nums">
        {count}
      </strong>{" "}
      {count === 1 ? "project" : "projects"} found
      {count > PAGE_SIZE && <span className="hidden sm:inline"> · Page {page}</span>}
    </p>
  );
}

function CatalogSort({
  value,
  onChange,
  compact = false,
}: {
  value: CatalogSortValue;
  onChange: (value: CatalogSortValue) => void;
  compact?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-muted">
      <span className={compact ? "sr-only" : "hidden xl:inline"}>Sort by</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as CatalogSortValue)}
        className="h-10 rounded-lg border border-line bg-white px-3 text-sm font-medium text-ink focus:border-volt-action focus:outline-none"
        aria-label="Sort projects"
      >
        <option value="recommended">Recommended</option>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name">Name: A to Z</option>
      </select>
    </label>
  );
}

function ViewToggle({
  view,
  onChange,
}: {
  view: CatalogView;
  onChange: (view: CatalogView) => void;
}) {
  return (
    <div
      className="hidden rounded-lg border border-line bg-white p-1 sm:flex"
      role="group"
      aria-label="Project view"
    >
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={view === "grid"}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-sm transition-colors duration-150",
          view === "grid" ? "bg-ink text-white" : "text-muted hover:text-ink",
        )}
        aria-label="Grid view"
      >
        <Grid2X2 aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-pressed={view === "list"}
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-sm transition-colors duration-150",
          view === "list" ? "bg-ink text-white" : "text-muted hover:text-ink",
        )}
        aria-label="List view"
      >
        <List aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function CatalogCustomProjectCTA() {
  return (
    <section className="bg-paper pb-10 sm:pb-14">
      <Container>
        <div className="relative overflow-hidden rounded-2xl bg-ink px-6 py-9 text-white sm:px-10 lg:flex lg:items-center lg:justify-between lg:px-14 lg:py-10">
          <div aria-hidden="true" className="absolute top-0 right-0 h-full w-1.5 bg-volt" />
          <div className="relative max-w-2xl">
            <p className="font-mono text-xs font-medium text-volt">Custom development</p>
            <h2 className="mt-2 font-display text-[1.65rem] font-semibold tracking-[-0.02em] sm:text-[2rem]">
              Didn&apos;t find the project you need?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-on-alloy">
              Submit your requirements, preferred technologies, budget range and deadline. We will
              review feasibility and prepare a versioned quotation before any work or payment
              begins.
            </p>
          </div>
          <ButtonLink
            href={to("/custom-project")}
            size="lg"
            className="relative mt-7 w-full lg:mt-0 lg:w-auto"
          >
            Request Custom Project
            <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
