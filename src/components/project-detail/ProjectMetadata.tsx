import { Box, Code2, Gauge, Headphones, Share2 } from "lucide-react";
import type { ProjectDetail } from "@/data/project-details";
import { catalogDeliveryLabels, difficultyLabels } from "@/data/catalog-projects";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";

export function ProjectMetadata({ project }: { project: ProjectDetail }) {
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Clipboard access may be unavailable in a sandbox; native share remains optional.
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <ul className="flex flex-wrap gap-2" aria-label="Project classifications">
          {project.tags.map((tag, index) => (
            <li
              key={tag}
              className={
                index === 0
                  ? "rounded-full border border-ink/35 bg-white px-3 py-1 text-[0.6875rem] font-semibold text-ink"
                  : "rounded-full bg-copper-tint px-3 py-1 text-[0.6875rem] font-semibold text-ink"
              }
            >
              {tag}
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          size="md"
          onClick={copyLink}
          className="h-9 w-9 shrink-0 px-0"
          aria-label="Copy project link"
        >
          <Share2 aria-hidden="true" className="h-4 w-4" />
        </Button>
      </div>

      <h1 className="mt-4 max-w-xl font-display text-[2rem] leading-[1.12] font-extrabold tracking-[-0.025em] text-ink lg:text-[2.25rem]">
        {project.displayTitle}
      </h1>
      <p className="mt-3 max-w-xl text-[0.9375rem] leading-[1.55] text-ink/85">
        {project.description}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-sm bg-line sm:grid-cols-4">
        <MetadataItem
          icon={Gauge}
          label={difficultyLabels[project.catalog.difficulty]}
          detail="Difficulty"
        />
        <MetadataItem
          icon={Box}
          label={catalogDeliveryLabels[project.catalog.deliveryType]}
          detail="Availability"
        />
        <MetadataItem
          icon={Code2}
          label={project.sourceCodeIncluded ? "Source Code" : "Project Files"}
          detail={project.sourceCodeIncluded ? "Included" : "Package based"}
        />
        <MetadataItem
          icon={Headphones}
          label={project.supportAvailable ? "Development" : "Package"}
          detail={project.supportAvailable ? "Support" : "Support terms"}
        />
      </dl>

      <div className="mt-4 flex items-end gap-3 border-t border-line pt-3">
        <div>
          <p className="text-[0.625rem] font-medium tracking-[0.07em] text-muted uppercase">
            Packages from
          </p>
          <p className="font-display text-[1.75rem] font-extrabold text-copper tabular-nums">
            {formatPrice(project.packages[0].price)}
          </p>
        </div>
        <p className="pb-1 text-[0.6875rem] text-muted">
          Package-specific deliverables and revision rights shown in the configurator.
        </p>
      </div>
    </div>
  );
}

function MetadataItem({
  icon: Icon,
  label,
  detail,
}: {
  icon: typeof Gauge;
  label: string;
  detail: string;
}) {
  return (
    <div className="bg-white px-2 py-3 text-center">
      <Icon aria-hidden="true" className="mx-auto h-5 w-5 text-ink" strokeWidth={1.65} />
      <dt className="mt-1.5 font-display text-[0.72rem] font-bold text-ink">{label}</dt>
      <dd className="text-[0.6875rem] text-muted">{detail}</dd>
    </div>
  );
}
