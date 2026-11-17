import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CatalogEmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-md border border-dashed border-ink/25 bg-white px-6 py-16 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-paper-deep text-copper-ink">
        <SearchX aria-hidden="true" className="h-6 w-6" />
      </span>
      <h2 className="mt-5 font-display text-xl font-extrabold text-ink">
        No projects match these filters
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
        Remove a filter, broaden the price range, or submit your requirements for a custom
        quotation.
      </p>
      <Button onClick={onClear} variant="outline" size="md" className="mt-6">
        Clear search and filters
      </Button>
    </div>
  );
}

export function CatalogLoadingState({ view }: { view: "grid" | "list" }) {
  return (
    <div
      className={view === "grid" ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-5"}
      aria-label="Loading projects"
      aria-busy="true"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="overflow-hidden rounded-md border border-line bg-white">
          <div className="aspect-[16/10] animate-pulse bg-paper-deep" />
          <div className="space-y-3 p-5">
            <div className="h-3 w-1/3 animate-pulse rounded bg-paper-deep" />
            <div className="h-5 w-4/5 animate-pulse rounded bg-paper-deep" />
            <div className="h-14 animate-pulse rounded bg-paper-deep" />
          </div>
        </div>
      ))}
    </div>
  );
}
