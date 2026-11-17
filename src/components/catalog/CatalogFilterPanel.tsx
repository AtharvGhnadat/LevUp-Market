import type { CatalogFilters } from "@/catalog/catalog-state";
import { toggleArrayValue } from "@/catalog/catalog-state";
import {
  categoryOptions,
  deliverableOptions,
  deliveryOptions,
  difficultyOptions,
  projectTypeOptions,
  technologyOptions,
} from "@/catalog/filter-options";
import { CheckboxOptions, FilterGroup } from "./FilterGroup";

export function CatalogFilterPanel({
  filters,
  onChange,
}: {
  filters: CatalogFilters;
  onChange: (filters: CatalogFilters) => void;
}) {
  const toggle = (key: keyof CatalogFilters, value: string) => {
    const values = filters[key] as string[];
    onChange({ ...filters, [key]: toggleArrayValue(values, value) });
  };

  return (
    <div>
      <FilterGroup title="Project Category" count={filters.categories.length}>
        <CheckboxOptions
          name="category"
          options={categoryOptions}
          selected={filters.categories}
          onToggle={(value) => toggle("categories", value)}
        />
      </FilterGroup>
      <FilterGroup title="Project Type" count={filters.projectTypes.length}>
        <CheckboxOptions
          name="project-type"
          options={projectTypeOptions}
          selected={filters.projectTypes}
          onToggle={(value) => toggle("projectTypes", value)}
        />
      </FilterGroup>
      <FilterGroup title="Delivery Type" count={filters.deliveryTypes.length}>
        <CheckboxOptions
          name="delivery"
          options={deliveryOptions}
          selected={filters.deliveryTypes}
          onToggle={(value) => toggle("deliveryTypes", value)}
        />
      </FilterGroup>
      <FilterGroup
        title="Price Range"
        count={(filters.minPrice ? 1 : 0) + (filters.maxPrice ? 1 : 0)}
      >
        <div className="grid grid-cols-2 gap-2">
          <PriceField
            id="min-price"
            label="Minimum"
            value={filters.minPrice}
            onChange={(value) => onChange({ ...filters, minPrice: value })}
          />
          <PriceField
            id="max-price"
            label="Maximum"
            value={filters.maxPrice}
            onChange={(value) => onChange({ ...filters, maxPrice: value })}
          />
        </div>
        <p className="mt-2 text-[0.6875rem] text-muted">Enter values in INR.</p>
      </FilterGroup>
      <FilterGroup title="Technology" count={filters.technologies.length}>
        <CheckboxOptions
          name="technology"
          options={technologyOptions}
          selected={filters.technologies}
          onToggle={(value) => toggle("technologies", value)}
        />
      </FilterGroup>
      <FilterGroup title="Difficulty" count={filters.difficulties.length}>
        <CheckboxOptions
          name="difficulty"
          options={difficultyOptions}
          selected={filters.difficulties}
          onToggle={(value) => toggle("difficulties", value)}
        />
      </FilterGroup>
      <FilterGroup
        title="Available Deliverables"
        count={filters.deliverables.length}
        defaultOpen={false}
      >
        <CheckboxOptions
          name="deliverable"
          options={deliverableOptions}
          selected={filters.deliverables}
          onToggle={(value) => toggle("deliverables", value)}
        />
      </FilterGroup>
      <FilterGroup title="Customization Availability" count={filters.customization ? 1 : 0}>
        <div className="space-y-2.5">
          {[
            { value: "offered", label: "Customization offered" },
            { value: "not-offered", label: "No customization" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex min-h-6 cursor-pointer items-center gap-2.5 text-[0.8125rem] text-muted hover:text-ink"
            >
              <input
                type="radio"
                name="customization"
                checked={filters.customization === option.value}
                onChange={() =>
                  onChange({
                    ...filters,
                    customization:
                      filters.customization === option.value
                        ? null
                        : (option.value as CatalogFilters["customization"]),
                  })
                }
                className="h-4 w-4 accent-copper-action"
              />
              {option.label}
            </label>
          ))}
        </div>
      </FilterGroup>
    </div>
  );
}

function PriceField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1 block text-[0.6875rem] text-muted">{label}</span>
      <span className="flex h-9 items-center rounded-sm border border-line bg-white px-2 focus-within:border-ink/40">
        <span className="text-xs text-muted">₹</span>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min="0"
          step="100"
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/^-/, ""))}
          className="min-w-0 flex-1 bg-transparent pl-1 text-[0.75rem] text-ink focus:outline-none"
        />
      </span>
    </label>
  );
}
