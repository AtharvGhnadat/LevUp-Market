import { ArrowRight } from "lucide-react";
import type { DemoProject } from "@/data/demo-projects";
import { formatPrice } from "@/lib/format";
import { unsplash, unsplashSrcSet } from "@/lib/image";
import { to } from "@/lib/routes";

export function FeaturedProjectCard({ project }: { project: DemoProject }) {
  const href = to(`/projects/${project.slug}`);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-[transform,border-color,box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-volt-action/60 hover:shadow-card-hover">
      {/* Card Image with category tag */}
      <div className="relative aspect-[16/10] overflow-hidden bg-mineral">
        <img
          src={unsplash(project.imageId, 600)}
          srcSet={unsplashSrcSet(project.imageId, [400, 600, 900])}
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          alt={project.imageAlt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: project.focus || "50% 50%" }}
          className="h-full w-full object-cover"
        />
        {/* Category Tag */}
        <span className="pointer-events-none absolute top-3 left-3 rounded-md border border-line/60 bg-white/95 px-2.5 py-1 font-sans text-xs font-medium text-alloy shadow-xs backdrop-blur-xs">
          {project.categoryLabel}
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-base font-semibold leading-snug text-alloy transition-colors duration-150 group-hover:text-volt-text">
          <a href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </a>
        </h3>

        <p className="mt-1.5 font-sans text-xs leading-relaxed text-muted line-clamp-2">
          {project.description ||
            "Reliable, tested engineering project ready for academic implementation."}
        </p>

        {/* Pricing & Detail Action */}
        <div className="mt-auto flex items-center justify-between border-t border-line/60 pt-4">
          <p className="font-display text-lg font-semibold text-alloy tabular-nums">
            <span className="sr-only">Base price</span>
            {formatPrice(project.basePrice)}
          </p>

          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-volt-action/40 text-volt-text transition-colors duration-150 group-hover:border-volt-action group-hover:bg-volt-action group-hover:text-white"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </span>
        </div>
      </div>
    </article>
  );
}
