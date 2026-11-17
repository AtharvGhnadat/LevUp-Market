import { ChevronRight, Home } from "lucide-react";
import type { ProjectDetail } from "@/data/project-details";
import { to } from "@/lib/routes";

export function ProjectBreadcrumb({ project }: { project: ProjectDetail }) {
  const items = [
    { label: "Home", href: "/" },
    { label: "Explore Projects", href: "/projects" },
    {
      label: project.catalog.categoryLabel,
      href: `/projects?category=${project.catalog.category}`,
    },
    { label: project.displayTitle },
  ];

  return (
    <nav aria-label="Breadcrumb" className="overflow-hidden">
      <ol className="flex items-center gap-2 overflow-x-auto py-4 text-[0.75rem] whitespace-nowrap text-muted">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center gap-2">
            {index > 0 && (
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted/70" />
            )}
            {item.href ? (
              <a
                href={to(item.href)}
                className="inline-flex items-center gap-1.5 hover:text-copper-ink"
              >
                {index === 0 && <Home aria-hidden="true" className="h-3.5 w-3.5" />}
                <span className={index === 0 ? "sr-only sm:not-sr-only" : ""}>{item.label}</span>
              </a>
            ) : (
              <span aria-current="page" className="max-w-[280px] truncate font-semibold text-ink">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
