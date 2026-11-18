import { useEffect } from "react";
import { ProjectBreadcrumb } from "@/components/project-detail/ProjectBreadcrumb";
import { ProjectGallery } from "@/components/project-detail/ProjectGallery";
import { ProjectInformationTabs } from "@/components/project-detail/ProjectInformationTabs";
import { ProjectMetadata } from "@/components/project-detail/ProjectMetadata";
import { PurchaseConfigurator } from "@/components/project-detail/PurchaseConfigurator";
import { RelatedProjects } from "@/components/project-detail/RelatedProjects";
import { ButtonLink } from "@/components/ui/Button";
import { getProjectDetail } from "@/data/project-details";
import { to } from "@/lib/routes";

export function ProjectDetailPage({ slug }: { slug: string }) {
  const project = getProjectDetail(slug);

  useEffect(() => {
    if (!project) return;
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = `${project.displayTitle} — LevUp Projects`;
    if (description) description.content = project.description;
    return () => {
      document.title = previousTitle;
      if (description && previousDescription) description.content = previousDescription;
    };
  }, [project]);

  if (!project) {
    return (
      <div className="mx-auto max-w-[1440px] px-5 py-20 text-center sm:px-8">
        <p className="text-sm text-copper-ink">Project unavailable</p>
        <h1 className="mt-2 font-display text-3xl font-semibold text-ink">Project not found</h1>
        <p className="mt-3 text-muted">
          This project is not part of the current demonstration catalog.
        </p>
        <ButtonLink href={to("/projects")} variant="ink" className="mt-6">
          Explore Projects
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="bg-paper">
      <div className="mx-auto w-full max-w-[1348px] px-5 sm:px-8">
        <ProjectBreadcrumb project={project} />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[minmax(0,38fr)_minmax(0,34fr)_minmax(350px,28fr)] xl:gap-7">
          <div className="min-w-0">
            <ProjectGallery media={project.media} />
          </div>
          <div className="min-w-0">
            <ProjectMetadata project={project} />
          </div>
          <div className="min-w-0 md:col-span-2 xl:col-span-1 xl:row-span-2">
            <PurchaseConfigurator project={project} />
          </div>
          <div className="min-w-0 md:col-span-2 xl:col-span-2">
            <ProjectInformationTabs project={project} />
          </div>
        </div>

        <div className="mt-7">
          <RelatedProjects project={project} />
        </div>
      </div>
    </div>
  );
}
