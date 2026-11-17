import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef } from "react";
import type { CatalogFilters } from "@/catalog/catalog-state";
import { activeFilterCount } from "@/catalog/catalog-state";
import { Button } from "@/components/ui/Button";
import { CatalogFilterPanel } from "./CatalogFilterPanel";

export function MobileFilterDrawer({
  open,
  filters,
  resultsCount,
  onChange,
  onClear,
  onClose,
}: {
  open: boolean;
  filters: CatalogFilters;
  resultsCount: number;
  onChange: (filters: CatalogFilters) => void;
  onClear: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-label="Catalog filters"
      onClose={onClose}
      className="m-0 mt-auto h-[92dvh] max-h-none w-full max-w-none overflow-hidden rounded-t-lg bg-paper p-0 text-ink shadow-panel backdrop:bg-ink/50 lg:hidden"
    >
      <div className="flex h-16 items-center justify-between border-b border-line bg-white px-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-extrabold">
          <SlidersHorizontal aria-hidden="true" className="h-5 w-5 text-copper-ink" />
          Filters
          {activeFilterCount(filters) > 0 && (
            <span className="rounded-full bg-copper-tint px-2 py-0.5 text-xs text-copper-ink">
              {activeFilterCount(filters)}
            </span>
          )}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="rounded-sm p-2 hover:bg-paper"
          aria-label="Close filters"
        >
          <X aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
      <div className="h-[calc(92dvh-128px)] overflow-y-auto px-5">
        <CatalogFilterPanel filters={filters} onChange={onChange} />
      </div>
      <div className="grid h-16 grid-cols-[auto_1fr] items-center gap-3 border-t border-line bg-white px-5">
        <button
          type="button"
          onClick={onClear}
          className="h-10 px-2 text-sm font-semibold text-copper-ink hover:underline"
        >
          Clear all
        </button>
        <Button onClick={onClose} size="md" className="w-full">
          Show {resultsCount} {resultsCount === 1 ? "project" : "projects"}
        </Button>
      </div>
    </dialog>
  );
}
