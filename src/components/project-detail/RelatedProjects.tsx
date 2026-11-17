import { ArrowRight } from "lucide-react";
import { CatalogProjectCard } from "@/components/catalog/CatalogProjectCard";
import type { ProjectDetail } from "@/data/project-details";
import { catalogProjects } from "@/data/catalog-projects";
import { ButtonLink } from "@/components/ui/Button";
import { to } from "@/lib/routes";

export function RelatedProjects({ project }: { project: ProjectDetail }) {
  const technologySet = new Set(project.catalog.technologies);
  const related = catalogProjects
    .filter((item) => item.slug !== project.catalog.slug)
    .map((item) => ({
      item,
      score:
        (item.category === project.catalog.category ? 4 : 0) +
        item.technologies.filter((technology) => technologySet.has(technology)).length * 2,
    }))
    .sort((a, b) => b.score - a.score || a.item.recommendedRank - b.item.recommendedRank)
    .slice(0, 4)
    .map(({ item }) => item);

  return (
    <section aria-labelledby="related-title" className="border-t border-line pt-5 pb-10">
      <div className="flex items-center justify-between gap-4">
        <h2
          id="related-title"
          className="border-l-8 border-copper pl-3 font-display text-[1.25rem] font-extrabold text-ink"
        >
          Related Projects
        </h2>
        <ButtonLink href={to("/projects")} variant="outline-copper" size="md">
          View All <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </ButtonLink>
      </div>
      <ul className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {related.map((item) => (
          <li key={item.id}>
            <CatalogProjectCard project={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
