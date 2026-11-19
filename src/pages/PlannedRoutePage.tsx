import { to } from "@/lib/routes";
import { ArrowLeft, Construction } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { categories } from "@/data/categories";
import { demoProjects } from "@/data/demo-projects";
import { catalogProjects } from "@/data/catalog-projects";

const staticTitles: Record<string, { title: string; section?: string }> = {
  "/projects": { title: "Project catalog", section: "#featured" },
  "/custom-project": { title: "Custom project request", section: "#custom" },
  "/how-it-works": { title: "How it works", section: "#how-it-works" },
  "/cart": { title: "Cart" },
  "/faq": { title: "Frequently asked questions" },
  "/contact": { title: "Contact & support" },
  "/terms": { title: "Terms of service" },
  "/privacy": { title: "Privacy policy" },
  "/refund-policy": { title: "Refund & cancellation" },
  "/shipping-policy": { title: "Shipping & returns" },
  "/license": { title: "Project licensing" },
  "/academic-use": { title: "Academic use policy" },
  "/pricing": { title: "Pricing & packages", section: "#featured" },
  "/resources": { title: "Resources" },
  "/resources/project-guidelines": { title: "Project guidelines" },
  "/resources/articles": { title: "Technical articles" },
  "/about": { title: "About LevUp Projects" },
  "/careers": { title: "Careers" },
  "/checkout": { title: "Checkout" },
};

function describe(path: string) {
  if (staticTitles[path]) return staticTitles[path];
  const [, group, slug] = path.split("/");
  if (group === "projects" && slug) {
    const project =
      catalogProjects.find((p) => p.slug === slug) ?? demoProjects.find((p) => p.slug === slug);
    return { title: project ? project.title : "Project detail", section: "#featured" };
  }
  if (group === "categories" && slug) {
    const category = categories.find((c) => c.slug === slug);
    return { title: category ? category.name : "Category", section: "#categories" };
  }
  return null;
}

/** Honest "not built yet" state for routes in the PRD inventory beyond this release. */
export function PlannedRoutePage({ path }: { path: string }) {
  const info = describe(path);
  const query = new URLSearchParams(window.location.search).get("q");

  return (
    <section className="border-b border-line bg-paper">
      <Container className="py-24 sm:py-32">
        <div className="max-w-2xl">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-ink text-volt">
            <Construction aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <p className="mt-8 font-mono text-sm text-muted">{path}</p>
          <h1 className="mt-2 text-section font-semibold text-ink">
            {info ? info.title : "Page not found"}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">
            {info
              ? "This page is part of the LevUp Projects V1 roadmap and is not published yet."
              : "This address doesn’t match any LevUp Projects page."}
          </p>
          {query && (
            <p className="mt-4 text-sm text-muted">
              Catalog search for <strong className="text-ink">“{query}”</strong> will run here once
              the catalog is connected.
            </p>
          )}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={to(`/${info?.section ?? ""}`)} variant="ink" size="lg">
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
              Back to homepage
            </ButtonLink>
            <ButtonLink href={to("/#custom")} variant="outline" size="lg">
              About custom projects
            </ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
