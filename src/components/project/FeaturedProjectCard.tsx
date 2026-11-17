import { ArrowRight } from "lucide-react";
import type { DemoProject } from "@/data/demo-projects";
import { formatPrice } from "@/lib/format";
import { unsplash, unsplashSrcSet } from "@/lib/image";
import { to } from "@/lib/routes";

export function FeaturedProjectCard({ project }: { project: DemoProject }) {
  const href = to(`/projects/${project.slug}`);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-white shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-volt hover:shadow-card-hover">
      {/* Card Image with category pill */}
      <div className="relative aspect-[16/10] overflow-hidden bg-mineral">
        <img
          src={unsplash(project.imageId, 600)}
          srcSet={unsplashSrcSet(project.imageId, [400, 600, 900])}
          sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
          alt={project.imageAlt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: project.focus || "50% 50%" }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Category Pill Badge */}
        <span className="pointer-events-none absolute top-3 left-3 rounded-full border border-line/60 bg-white/95 px-2.5 py-0.5 font-sans text-xs font-semibold text-alloy shadow-xs backdrop-blur-xs">
          {project.categoryLabel}
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-display text-base font-bold leading-snug text-alloy transition-colors group-hover:text-volt-action">
          <a href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </a>
        </h3>

        <p className="mt-1.5 font-sans text-xs leading-relaxed text-muted line-clamp-2">
          {project.description ||
            "Reliable, tested engineering project ready for academic implementation."}
        </p>

        {/* Pricing & Detail Action */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-line/60">
          <p className="font-display text-lg font-extrabold text-alloy tabular-nums">
            <span className="sr-only">Base price</span>
            {formatPrice(project.basePrice)}
          </p>

          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-volt-action/40 text-volt-action transition-all duration-200 group-hover:border-volt-action group-hover:bg-volt-action group-hover:text-white shadow-xs"
          >
            <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
          </span>
        </div>
      </div>
    </article>
  );
}
