import { X } from "lucide-react";
import type { CatalogFilters } from "@/catalog/catalog-state";
import {
  catalogDeliveryLabels,
  deliverableLabels,
  difficultyLabels,
  projectTypeLabels,
} from "@/data/catalog-projects";
import { categories } from "@/data/categories";

type Chip = { key: keyof CatalogFilters; value: string; label: string };

export function ActiveFilterChips({
  filters,
  onRemove,
  onClear,
}: {
  filters: CatalogFilters;
  onRemove: (key: keyof CatalogFilters, value: string) => void;
  onClear: () => void;
}) {
  const chips: Chip[] = [
    ...filters.categories.map((value) => ({
      key: "categories" as const,
      value,
      label: categories.find((category) => category.slug === value)?.name ?? value,
    })),
    ...filters.projectTypes.map((value) => ({
      key: "projectTypes" as const,
      value,
      label: projectTypeLabels[value],
    })),
    ...filters.deliveryTypes.map((value) => ({
      key: "deliveryTypes" as const,
      value,
      label: catalogDeliveryLabels[value],
    })),
    ...filters.technologies.map((value) => ({
      key: "technologies" as const,
      value,
      label: value,
    })),
    ...filters.difficulties.map((value) => ({
      key: "difficulties" as const,
      value,
      label: difficultyLabels[value],
    })),
    ...filters.deliverables.map((value) => ({
      key: "deliverables" as const,
      value,
      label: deliverableLabels[value],
    })),
  ];
  if (filters.customization) {
    chips.push({
      key: "customization",
      value: filters.customization,
      label: filters.customization === "offered" ? "Customization offered" : "No customization",
    });
  }
  if (filters.minPrice)
    chips.push({ key: "minPrice", value: filters.minPrice, label: `Min ₹${filters.minPrice}` });
  if (filters.maxPrice)
    chips.push({ key: "maxPrice", value: filters.maxPrice, label: `Max ₹${filters.maxPrice}` });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={`${chip.key}-${chip.value}`}
          type="button"
          onClick={() => onRemove(chip.key, chip.value)}
          className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-copper/30 bg-copper-tint px-3 text-[0.75rem] font-medium text-ink hover:border-copper"
          aria-label={`Remove ${chip.label} filter`}
        >
          {chip.label}
          <X aria-hidden="true" className="h-3.5 w-3.5 text-copper-ink" />
        </button>
      ))}
      <button
        type="button"
        onClick={onClear}
        className="min-h-8 px-2 text-[0.75rem] font-semibold text-copper-ink hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
