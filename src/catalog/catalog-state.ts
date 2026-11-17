import type {
  CatalogDeliverable,
  CatalogDeliveryType,
  CatalogDifficulty,
  CatalogProject,
  CatalogProjectType,
} from "@/data/catalog-projects";

export type CatalogSortValue = "recommended" | "newest" | "price-asc" | "price-desc" | "name";
export type CatalogView = "grid" | "list";
export type CustomizationFilter = "offered" | "not-offered";

export type CatalogFilters = {
  query: string;
  categories: string[];
  projectTypes: CatalogProjectType[];
  deliveryTypes: CatalogDeliveryType[];
  technologies: string[];
  difficulties: CatalogDifficulty[];
  deliverables: CatalogDeliverable[];
  customization: CustomizationFilter | null;
  minPrice: string;
  maxPrice: string;
};

export const emptyCatalogFilters: CatalogFilters = {
  query: "",
  categories: [],
  projectTypes: [],
  deliveryTypes: [],
  technologies: [],
  difficulties: [],
  deliverables: [],
  customization: null,
  minPrice: "",
  maxPrice: "",
};

const arrayKeys = {
  category: "categories",
  type: "projectTypes",
  delivery: "deliveryTypes",
  technology: "technologies",
  difficulty: "difficulties",
  deliverable: "deliverables",
} as const;

export function parseCatalogUrl(search: string): {
  filters: CatalogFilters;
  sort: CatalogSortValue;
  page: number;
  view: CatalogView;
} {
  const params = new URLSearchParams(search);
  const filters = { ...emptyCatalogFilters };
  filters.query = params.get("q") ?? "";
  for (const [param, key] of Object.entries(arrayKeys)) {
    const value = params.get(param);
    if (value) (filters[key] as string[]) = value.split(",").filter(Boolean);
  }
  const customization = params.get("customization");
  if (customization === "offered" || customization === "not-offered") {
    filters.customization = customization;
  }
  filters.minPrice = params.get("min") ?? "";
  filters.maxPrice = params.get("max") ?? "";

  const sortParam = params.get("sort");
  const validSorts: CatalogSortValue[] = [
    "recommended",
    "newest",
    "price-asc",
    "price-desc",
    "name",
  ];
  const sort = validSorts.includes(sortParam as CatalogSortValue)
    ? (sortParam as CatalogSortValue)
    : "recommended";
  const page = Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1);
  const view = params.get("view") === "list" ? "list" : "grid";
  return { filters, sort, page, view };
}

export function catalogUrlParams(
  filters: CatalogFilters,
  sort: CatalogSortValue,
  page: number,
  view: CatalogView,
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.query.trim()) params.set("q", filters.query.trim());
  for (const [param, key] of Object.entries(arrayKeys)) {
    const values = filters[key] as string[];
    if (values.length) params.set(param, values.join(","));
  }
  if (filters.customization) params.set("customization", filters.customization);
  if (filters.minPrice) params.set("min", filters.minPrice);
  if (filters.maxPrice) params.set("max", filters.maxPrice);
  if (sort !== "recommended") params.set("sort", sort);
  if (page > 1) params.set("page", String(page));
  if (view === "list") params.set("view", view);
  return params;
}

export function filterCatalog(
  projects: CatalogProject[],
  filters: CatalogFilters,
): CatalogProject[] {
  const q = filters.query.trim().toLowerCase();
  const min = filters.minPrice ? Number(filters.minPrice) : null;
  const max = filters.maxPrice ? Number(filters.maxPrice) : null;

  return projects.filter((project) => {
    const searchable = [
      project.id,
      project.title,
      project.summary,
      project.categoryLabel,
      ...project.technologies,
      ...project.searchTerms,
    ]
      .join(" ")
      .toLowerCase();

    if (q && !searchable.includes(q)) return false;
    if (filters.categories.length && !filters.categories.includes(project.category)) return false;
    if (filters.projectTypes.length && !filters.projectTypes.includes(project.projectType))
      return false;
    if (filters.deliveryTypes.length && !filters.deliveryTypes.includes(project.deliveryType))
      return false;
    if (
      filters.technologies.length &&
      !filters.technologies.some((technology) => project.technologies.includes(technology))
    ) {
      return false;
    }
    if (filters.difficulties.length && !filters.difficulties.includes(project.difficulty))
      return false;
    if (
      filters.deliverables.length &&
      !filters.deliverables.every((deliverable) => project.deliverables.includes(deliverable))
    ) {
      return false;
    }
    if (filters.customization === "offered" && !project.customizable) return false;
    if (filters.customization === "not-offered" && project.customizable) return false;
    const rupees = project.startingPrice / 100;
    if (min !== null && Number.isFinite(min) && rupees < min) return false;
    if (max !== null && Number.isFinite(max) && rupees > max) return false;
    return true;
  });
}

export function sortCatalog(projects: CatalogProject[], sort: CatalogSortValue): CatalogProject[] {
  const sorted = [...projects];
  switch (sort) {
    case "newest":
      return sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return sorted.sort((a, b) => a.startingPrice - b.startingPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.startingPrice - a.startingPrice);
    case "name":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted.sort((a, b) => a.recommendedRank - b.recommendedRank);
  }
}

export function activeFilterCount(filters: CatalogFilters): number {
  return (
    filters.categories.length +
    filters.projectTypes.length +
    filters.deliveryTypes.length +
    filters.technologies.length +
    filters.difficulties.length +
    filters.deliverables.length +
    (filters.customization ? 1 : 0) +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0)
  );
}

export function hasCatalogFilters(filters: CatalogFilters): boolean {
  return activeFilterCount(filters) > 0 || Boolean(filters.query.trim());
}

export function toggleArrayValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}
