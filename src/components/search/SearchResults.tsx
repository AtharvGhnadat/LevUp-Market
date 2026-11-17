import { ArrowRight } from "lucide-react";
import type { DemoProject } from "@/data/demo-projects";
import { formatPrice } from "@/lib/format";
import { unsplash } from "@/lib/image";
import { to } from "@/lib/routes";

/** Shared result list for the header search popover and the mobile search dialog. */
export function SearchResults({ query, results }: { query: string; results: DemoProject[] }) {
  if (results.length === 0) {
    return (
      <div className="px-4 py-5 text-center">
        <p className="text-sm font-medium text-ink">No listings match “{query.trim()}”.</p>
        <a
          href={to("/custom-project")}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-copper-ink hover:underline"
        >
          Request a custom project <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    );
  }
  return (
    <ul className="p-1.5">
      {results.map((p) => (
        <li key={p.slug}>
          <a
            href={to(`/projects/${p.slug}`)}
            className="flex items-center gap-3 rounded-sm p-2.5 hover:bg-paper focus-visible:bg-paper"
          >
            <img
              src={unsplash(p.imageId, 120)}
              alt=""
              className="h-10 w-14 shrink-0 rounded-xs object-cover"
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">{p.title}</span>
              <span className="block truncate text-xs text-muted">
                {p.categoryLabel} · {p.stack.join(", ")}
              </span>
            </span>
            <span className="text-sm font-semibold text-ink">{formatPrice(p.basePrice)}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export const SEARCH_NOTE = "Showing demonstration listings until the catalog is connected.";
