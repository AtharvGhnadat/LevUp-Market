import type { ProjectPackage } from "@/data/project-details";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export function PackageSelector({
  packages,
  selectedId,
  onSelect,
}: {
  packages: ProjectPackage[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="font-display text-[1rem] font-extrabold text-ink">Choose a Package</legend>
      <div className="mt-3 space-y-2">
        {packages.map((item) => {
          const selected = selectedId === item.id;
          return (
            <label
              key={item.id}
              className={cn(
                "grid cursor-pointer grid-cols-[auto_1fr_auto] items-start gap-3 rounded-md border bg-white px-3 py-3 transition-colors",
                selected ? "border-copper bg-copper-tint/40" : "border-line hover:border-ink/30",
              )}
            >
              <input
                data-package-id={item.id}
                type="radio"
                name="project-package"
                value={item.id}
                checked={selected}
                onChange={() => onSelect(item.id)}
                className="mt-1 h-4 w-4 accent-copper-action"
              />
              <span>
                <span className="block font-display text-[0.875rem] font-extrabold text-ink">
                  {item.name}
                </span>
                <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted">
                  {item.shortDescription}
                </span>
              </span>
              <span className="font-display text-[0.875rem] font-extrabold text-ink tabular-nums">
                {formatPrice(item.price)}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
