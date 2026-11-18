import type { ProjectAddOn, ProjectPackage } from "@/data/project-details";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/cn";

export function AddOnConfigurator({
  addOns,
  selectedPackage,
  selectedIds,
  onToggle,
}: {
  addOns: ProjectAddOn[];
  selectedPackage: ProjectPackage;
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const eligible = addOns.filter((item) => item.eligiblePackageIds.includes(selectedPackage.id));

  return (
    <fieldset className="rounded-lg border border-volt-action/15 bg-volt-tint/55 p-3">
      <legend className="px-1 font-display text-[0.9375rem] font-semibold text-ink">
        Add Additional Deliverables
      </legend>
      <div className="mt-1 space-y-1">
        {eligible.map((item) => {
          const included = selectedPackage.includedAddOnIds.includes(item.id);
          const selected = included || selectedIds.includes(item.id);
          return (
            <label
              key={item.id}
              className={cn(
                "grid min-h-8 grid-cols-[auto_1fr_auto] items-start gap-2 rounded-sm px-1 py-1.5 text-[0.75rem]",
                included
                  ? "cursor-default text-muted"
                  : "cursor-pointer text-ink hover:bg-white/60",
              )}
              title={item.description}
            >
              <input
                data-addon-id={item.id}
                type="checkbox"
                checked={selected}
                disabled={included}
                onChange={() => onToggle(item.id)}
                className="mt-0.5 h-4 w-4 rounded-xs accent-copper-action disabled:opacity-60"
              />
              <span>
                <span className="font-medium">{item.name}</span>
                <span className="sr-only"> — {item.description}</span>
              </span>
              <span
                className={cn(
                  "whitespace-nowrap font-semibold tabular-nums",
                  item.price === null && "text-copper-ink",
                )}
              >
                {included
                  ? "Included"
                  : item.price === null
                    ? "Requires quotation"
                    : `+ ${formatPrice(item.price)}`}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
