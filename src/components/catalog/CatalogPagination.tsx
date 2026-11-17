import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export function CatalogPagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;
  return (
    <nav aria-label="Catalog pagination" className="mt-10 flex justify-center">
      <ul className="flex items-center gap-1.5">
        <li>
          <PageButton
            label="Previous page"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
          </PageButton>
        </li>
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
          <li key={number}>
            <PageButton
              label={`Page ${number}`}
              current={number === page}
              onClick={() => onPageChange(number)}
            >
              {number}
            </PageButton>
          </li>
        ))}
        <li>
          <PageButton
            label="Next page"
            disabled={page === pageCount}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </PageButton>
        </li>
      </ul>
    </nav>
  );
}

function PageButton({
  label,
  current = false,
  disabled = false,
  onClick,
  children,
}: {
  label: string;
  current?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={current ? "page" : undefined}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 min-w-10 items-center justify-center rounded-sm border px-3 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-35",
        current
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink hover:border-ink/40",
      )}
    >
      {children}
    </button>
  );
}
