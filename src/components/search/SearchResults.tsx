import { ArrowRight } from "lucide-react";
import type { DemoProject } from "@/data/demo-projects";
import { formatPrice } from "@/lib/format";
import { to } from "@/lib/routes";

export function SearchResults({ query, results }: { query: string; results: DemoProject[] }) {
  if (results.length === 0) {
    return (
      <div className="px-4 py-3">
        <p className="text-sm font-medium text-alloy wrap-anywhere">No listings match ?{query}?.</p>
        <a
          href={to("/custom-project")}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-volt-text hover:underline"
        >
          Request a custom project
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.75} />
        </a>
      </div>
    );
  }

  return (
    <ul aria-label="Matching projects" className="space-y-1 p-2">
      {results.map((project) => (
        <li key={project.slug}>
          <a
            href={to(`/projects/${project.slug}`)}
            className="nav-panel-link justify-between gap-3"
          >
            <span className="min-w-0">
              <span className="block text-sm font-medium">{project.title}</span>
              <span className="mt-0.5 block text-xs text-muted">{project.categoryLabel}</span>
            </span>
            <span className="shrink-0 text-sm font-medium tabular-nums">
              {formatPrice(project.basePrice)}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
