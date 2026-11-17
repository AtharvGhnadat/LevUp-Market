import { ArrowRight } from "lucide-react";
import { FeaturedProjectCard } from "@/components/project/FeaturedProjectCard";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { demoProjects } from "@/data/demo-projects";
import { to } from "@/lib/routes";

export function FeaturedProjects() {
  return (
    <section id="featured" aria-labelledby="featured-title" className="pt-6 pb-8">
      <Container className="grid gap-8 lg:grid-cols-[328px_1fr] lg:gap-5">
        <div className="lg:pt-1">
          <Eyebrow>Featured Projects</Eyebrow>
          <h2 id="featured-title" className="mt-3 text-section font-extrabold text-ink">
            Handpicked <br className="hidden lg:block" />
            <span className="lg:whitespace-nowrap">Engineering Projects</span>
          </h2>
          <p className="mt-4 max-w-[290px] text-[0.9375rem] leading-[1.55] text-ink/85">
            Popular, tested and well-documented projects, ready to use and customize as per your
            requirements.
          </p>
          <ButtonLink href={to("/projects")} variant="outline-copper" className="mt-6 w-[192px]">
            View All Projects
            <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />
          </ButtonLink>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
