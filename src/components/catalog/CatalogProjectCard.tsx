import { ArrowUpRight, Check, Layers3, ShoppingCart, Wrench } from "lucide-react";
import type { CatalogProject } from "@/data/catalog-projects";
import {
  catalogDeliveryLabels,
  difficultyLabels,
  projectTypeLabels,
} from "@/data/catalog-projects";
import { formatPrice } from "@/lib/format";
import { unsplash, unsplashSrcSet } from "@/lib/image";
import { to } from "@/lib/routes";
import { useCart } from "@/state/cart";
import { cn } from "@/lib/cn";

export function CatalogProjectCard({
  project,
  view = "grid",
}: {
  project: CatalogProject;
  view?: "grid" | "list";
}) {
  const { add, has } = useCart();
  const inCart = has(project.slug);
  const detailHref = to(`/projects/${project.slug}`);

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-md border border-line bg-white shadow-card transition-shadow hover:shadow-card-hover",
        view === "list" && "md:grid md:grid-cols-[260px_1fr]",
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden bg-paper-deep",
          view === "list" && "md:aspect-auto md:min-h-[260px]",
        )}
      >
        <img
          src={unsplash(project.imageId, 620)}
          srcSet={unsplashSrcSet(project.imageId, [420, 620, 900])}
          sizes={
            view === "list"
              ? "(min-width:768px) 260px, 100vw"
              : "(min-width:1280px) 290px, (min-width:768px) 45vw, 100vw"
          }
          alt={project.imageAlt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: project.imageFocus }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
        <span className="pointer-events-none absolute top-3 left-3 rounded-full bg-ink/90 px-2.5 py-1 text-[0.625rem] font-semibold tracking-[0.03em] text-white uppercase">
          Demonstration listing
        </span>
      </div>

      <div className="flex min-h-[290px] flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.6875rem] font-semibold tracking-[0.045em] text-copper-ink uppercase">
              {project.categoryLabel}
            </p>
            <p className="mt-1 font-mono text-[0.6875rem] text-muted">{project.id}</p>
          </div>
          <span className="rounded-full bg-paper-deep px-2.5 py-1 text-[0.6875rem] font-medium text-ink">
            {difficultyLabels[project.difficulty]}
          </span>
        </div>

        <h2 className="mt-3 font-display text-[1.0625rem] leading-[1.3] font-extrabold text-ink">
          <a href={detailHref} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </a>
        </h2>
        <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-[1.55] text-muted">
          {project.summary}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.slice(0, 3).map((technology) => (
            <li
              key={technology}
              className="rounded-xs border border-line bg-paper px-2 py-1 text-[0.6875rem] font-medium text-ink"
            >
              {technology}
            </li>
          ))}
        </ul>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-line pt-4 text-[0.75rem]">
          <div>
            <dt className="text-muted">Fulfillment</dt>
            <dd className="mt-1 font-medium text-ink">
              {catalogDeliveryLabels[project.deliveryType]}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Project type</dt>
            <dd className="mt-1 font-medium text-ink">{projectTypeLabels[project.projectType]}</dd>
          </div>
          <div className="flex items-center gap-1.5 text-muted">
            <Layers3 aria-hidden="true" className="h-3.5 w-3.5 text-copper-ink" />
            <span>{project.packages.join(" / ")}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted">
            <Wrench aria-hidden="true" className="h-3.5 w-3.5 text-copper-ink" />
            <span>{project.customizable ? "Customization offered" : "Fixed scope"}</span>
          </div>
        </dl>

        <div className="mt-auto flex items-end justify-between gap-4 pt-5">
          <p>
            <span className="block text-[0.625rem] tracking-[0.06em] text-muted uppercase">
              Starting from
            </span>
            <span className="font-display text-[1.25rem] font-extrabold text-copper">
              {formatPrice(project.startingPrice)}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <span className="pointer-events-none hidden items-center gap-1 text-[0.75rem] font-semibold text-ink sm:inline-flex">
              View Details <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
            </span>
            <button
              type="button"
              aria-label={
                inCart ? `${project.title} is in your cart` : `Add ${project.title} to cart`
              }
              aria-pressed={inCart}
              onClick={() => add(project.slug, project.title)}
              className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-sm bg-copper-tint text-copper-ink transition-colors hover:bg-copper hover:text-white aria-pressed:bg-success aria-pressed:text-white"
            >
              {inCart ? (
                <Check aria-hidden="true" className="h-[18px] w-[18px]" />
              ) : (
                <ShoppingCart aria-hidden="true" className="h-[18px] w-[18px]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
