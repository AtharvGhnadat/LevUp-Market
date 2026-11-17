import { Check, ShoppingCart } from "lucide-react";
import type { DemoProject } from "@/data/demo-projects";
import { deliveryModeLabel } from "@/data/demo-projects";
import { formatPrice } from "@/lib/format";
import { unsplash, unsplashSrcSet } from "@/lib/image";
import { to } from "@/lib/routes";
import { useCart } from "@/state/cart";

/** Catalog card. Presentation only — data arrives as a DemoProject today, catalog records later. */
export function FeaturedProjectCard({ project }: { project: DemoProject }) {
  const { add, has } = useCart();
  const inCart = has(project.slug);
  const href = to(`/projects/${project.slug}`);

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-md border border-line bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-[297/107] overflow-hidden bg-paper-deep">
        <img
          src={unsplash(project.imageId, 600)}
          srcSet={unsplashSrcSet(project.imageId, [400, 600, 900])}
          sizes="(min-width:1024px) 300px, (min-width:640px) 50vw, 100vw"
          alt={project.imageAlt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: project.focus }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Sample content is labelled until the catalog backend supplies real listings. */}
        <span className="pointer-events-none absolute top-2 right-2 rounded-full bg-ink/80 px-2 py-0.5 text-[0.625rem] font-medium text-white">
          Demo listing
        </span>
      </div>

      <div className="flex flex-1 flex-col px-5 pt-3.5 pb-4">
        <ul className="flex flex-wrap gap-1.5" aria-label="Tags">
          <li className="rounded-full bg-paper-deep px-2.5 py-[3px] text-[0.6875rem] font-medium text-ink">
            {project.categoryLabel}
          </li>
          <li className="rounded-full bg-copper-tint px-2.5 py-[3px] text-[0.6875rem] font-medium text-ink">
            {project.typeLabel}
          </li>
        </ul>

        <h3 className="mt-2.5 font-display text-[1rem] leading-[1.3] font-bold text-ink">
          <a href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
            {project.title}
          </a>
        </h3>

        <div className="mt-auto flex items-center gap-3 pt-4">
          <p className="flex items-baseline gap-2">
            <span className="sr-only">Base price</span>
            <span className="font-display text-[1.25rem] font-extrabold tracking-[-0.01em] text-copper">
              {formatPrice(project.basePrice)}
            </span>
            {project.originalPrice && project.originalPrice > project.basePrice && (
              <s className="text-[0.75rem] text-muted">
                <span className="sr-only">Original price</span>
                {formatPrice(project.originalPrice)}
              </s>
            )}
          </p>
          <span className="ml-auto text-[0.6875rem] text-muted">
            {deliveryModeLabel[project.deliveryMode]}
          </span>
          <button
            type="button"
            onClick={() => add(project.slug, project.title)}
            aria-label={
              inCart ? `${project.title} is in your cart` : `Add ${project.title} to cart`
            }
            aria-pressed={inCart}
            className="relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-copper-tint text-copper-ink transition-colors hover:bg-copper hover:text-white aria-pressed:bg-success aria-pressed:text-white"
          >
            {inCart ? (
              <Check aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2.25} />
            ) : (
              <ShoppingCart aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
