import type { ProjectPackage } from "@/data/project-details";
import { formatPrice } from "@/lib/format";

export function OrderPriceSummary({
  selectedPackage,
  paidAddOnsTotal,
  configurationTotal,
  hasPhysicalItems,
}: {
  selectedPackage: ProjectPackage;
  paidAddOnsTotal: number;
  configurationTotal: number;
  hasPhysicalItems: boolean;
}) {
  return (
    <div className="border-y border-line py-3">
      <dl className="space-y-1.5 text-[0.6875rem]">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">{selectedPackage.name} package</dt>
          <dd className="font-medium text-ink tabular-nums">
            {formatPrice(selectedPackage.price)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Eligible paid add-ons</dt>
          <dd className="font-medium text-ink tabular-nums">{formatPrice(paidAddOnsTotal)}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Shipping</dt>
          <dd className="text-right font-medium text-muted">
            {hasPhysicalItems ? "Calculated at checkout" : "Not applicable"}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted">Applicable taxes</dt>
          <dd className="text-right font-medium text-muted">Calculated at checkout</dd>
        </div>
      </dl>
      <div className="mt-3 flex items-end justify-between gap-4 border-t border-line pt-3">
        <div>
          <p className="font-display text-[0.875rem] font-extrabold text-ink">
            Configuration Total
          </p>
          <p className="text-[0.625rem] text-muted">Before shipping and applicable taxes</p>
        </div>
        <p
          data-testid="configuration-total"
          className="font-display text-[1.65rem] font-extrabold text-copper tabular-nums"
        >
          {formatPrice(configurationTotal)}
        </p>
      </div>
    </div>
  );
}
