import { ArrowRight } from "lucide-react";
import { FeaturedProjectCard } from "@/components/project/FeaturedProjectCard";
import { Container } from "@/components/ui/Container";
import { demoProjects } from "@/data/demo-projects";
import { to } from "@/lib/routes";

export function FeaturedProjects() {
  return (
    <section id="featured" aria-labelledby="featured-title" className="py-8 sm:py-10">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <h2
            id="featured-title"
            className="font-display text-xl font-semibold tracking-[-0.015em] text-alloy sm:text-2xl"
          >
            Featured Projects
          </h2>
          <a
            href={to("/projects")}
            className="inline-flex items-center gap-1.5 font-sans text-xs font-medium text-volt-text transition-colors duration-150 hover:underline sm:text-sm"
          >
            <span>View All Projects</span>
            <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
          </a>
        </div>

        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {demoProjects.map((p) => (
            <li key={p.slug}>
              <FeaturedProjectCard project={p} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
