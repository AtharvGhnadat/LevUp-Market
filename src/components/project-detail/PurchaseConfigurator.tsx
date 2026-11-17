import { CreditCard, Headphones, RefreshCw, ShoppingCart, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { ProjectDetail } from "@/data/project-details";
import { Button } from "@/components/ui/Button";
import { to } from "@/lib/routes";
import { useCart } from "@/state/cart";
import { AddOnConfigurator } from "./AddOnConfigurator";
import { OrderPriceSummary } from "./OrderPriceSummary";
import { PackageSelector } from "./PackageSelector";
import { RevisionEntitlement } from "./RevisionEntitlement";

export function PurchaseConfigurator({ project }: { project: ProjectDetail }) {
  const [selectedPackageId, setSelectedPackageId] = useState(project.packages[0].id);
  // Matches the reference's Basic configuration total: report + PPT.
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([
    "technical-report",
    "presentation",
  ]);
  const { add } = useCart();

  const selectedPackage =
    project.packages.find((item) => item.id === selectedPackageId) ?? project.packages[0];

  useEffect(() => {
    const eligibleIds = new Set(
      project.addOns
        .filter((addOn) => addOn.eligiblePackageIds.includes(selectedPackage.id))
        .map((addOn) => addOn.id),
    );
    setSelectedAddOnIds((items) => items.filter((id) => eligibleIds.has(id)));
  }, [project.addOns, selectedPackage.id]);

  const pricing = useMemo(() => {
    const selected = project.addOns.filter((addOn) => selectedAddOnIds.includes(addOn.id));
    const paid = selected.filter(
      (addOn) => !selectedPackage.includedAddOnIds.includes(addOn.id) && addOn.price !== null,
    );
    const quoted = selected.filter(
      (addOn) => !selectedPackage.includedAddOnIds.includes(addOn.id) && addOn.price === null,
    );
    const paidAddOnsTotal = paid.reduce((sum, addOn) => sum + (addOn.price ?? 0), 0);
    const hasPhysicalItems =
      project.catalog.deliveryType !== "digital" || selected.some((addOn) => addOn.makesPhysical);
    return {
      paidAddOnsTotal,
      configurationTotal: selectedPackage.price + paidAddOnsTotal,
      quotedAddOnIds: quoted.map((addOn) => addOn.id),
      hasPhysicalItems,
    };
  }, [project.addOns, project.catalog.deliveryType, selectedAddOnIds, selectedPackage]);

  const toggleAddOn = (id: string) => {
    if (selectedPackage.includedAddOnIds.includes(id)) return;
    setSelectedAddOnIds((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  };

  const snapshot = {
    packageId: selectedPackage.id,
    packageName: selectedPackage.name,
    selectedAddOnIds: selectedAddOnIds.filter(
      (id) => !selectedPackage.includedAddOnIds.includes(id),
    ),
    quotedAddOnIds: pricing.quotedAddOnIds,
    packagePrice: selectedPackage.price,
    paidAddOnsTotal: pricing.paidAddOnsTotal,
    configurationTotal: pricing.configurationTotal,
  };
  const hasQuote = pricing.quotedAddOnIds.length > 0;
  const buyHref = hasQuote
    ? to(`/custom-project?project=${project.catalog.slug}&type=change-quote`)
    : to(`/checkout?project=${project.catalog.slug}&package=${selectedPackage.id}`);

  return (
    <aside className="rounded-lg border border-line bg-white p-4 shadow-card lg:sticky lg:top-24">
      <PackageSelector
        packages={project.packages}
        selectedId={selectedPackage.id}
        onSelect={setSelectedPackageId}
      />

      <div className="mt-4">
        <AddOnConfigurator
          addOns={project.addOns}
          selectedPackage={selectedPackage}
          selectedIds={selectedAddOnIds}
          onToggle={toggleAddOn}
        />
      </div>

      <div className="mt-3">
        <RevisionEntitlement selectedPackage={selectedPackage} />
      </div>

      <div className="mt-3">
        <OrderPriceSummary
          selectedPackage={selectedPackage}
          paidAddOnsTotal={pricing.paidAddOnsTotal}
          configurationTotal={pricing.configurationTotal}
          hasPhysicalItems={pricing.hasPhysicalItems}
        />
      </div>

      {hasQuote && (
        <p className="mt-3 rounded-sm border border-copper/25 bg-copper-tint px-3 py-2 text-[0.6875rem] leading-relaxed text-ink">
          This configuration includes a quote-required modification. Immediate payment is disabled;
          submit it for review instead.
        </p>
      )}

      <div className="mt-3 grid gap-2">
        <Button
          data-testid="detail-add-to-cart"
          type="button"
          size="md"
          className="w-full"
          onClick={() => add(project.catalog.slug, project.displayTitle, snapshot)}
        >
          <ShoppingCart aria-hidden="true" className="h-4 w-4" />
          Add to Cart
        </Button>
        <Button
          type="button"
          variant="outline"
          size="md"
          className="w-full"
          onClick={() => {
            add(project.catalog.slug, project.displayTitle, snapshot);
            window.setTimeout(() => window.location.assign(buyHref), 0);
          }}
        >
          <CreditCard aria-hidden="true" className="h-4 w-4" />
          {hasQuote ? "Request Quotation" : "Buy Now"}
        </Button>
      </div>

      {pricing.hasPhysicalItems && (
        <p className="mt-2 text-center text-[0.625rem] leading-relaxed text-muted">
          Shipping details and serviceability are collected at checkout, not on this page.
        </p>
      )}

      <ul className="mt-4 grid grid-cols-4 gap-2 border-t border-line pt-4">
        <Reassurance icon={CreditCard} label="Secure Payment" />
        <Reassurance icon={Truck} label="Track Order" />
        <Reassurance icon={RefreshCw} label="Package Revisions" />
        <Reassurance icon={Headphones} label="Technical Support" />
      </ul>
    </aside>
  );
}

function Reassurance({ icon: Icon, label }: { icon: typeof CreditCard; label: string }) {
  return (
    <li className="text-center">
      <Icon aria-hidden="true" className="mx-auto h-5 w-5 text-ink" strokeWidth={1.6} />
      <span className="mt-1 block text-[0.625rem] leading-tight font-medium text-ink">{label}</span>
    </li>
  );
}
