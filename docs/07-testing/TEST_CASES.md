# Unit & Integration Test Cases — LevUp Projects

**Document Status:** Baseline  
**Framework:** Vitest + React Testing Library  
**Last Updated:** 2026-11-17

---

## 1. Utility Functions (`src/lib/`)

### TC-LIB-01: Currency Formatting (`src/lib/format.ts`)

- **Inputs**: `499900` (paise), `0`, `1250000`.
- **Expected Outputs**: `"₹4,999"`, `"₹0"`, `"₹12,500"`.
- **Edge Cases**: Negative values, NaN, non-integer numbers (must handle or throw appropriately).

### TC-LIB-02: Tailwind Class Merge (`src/lib/cn.ts`)

- **Inputs**: Conditional strings, conflicting Tailwind classes (`bg-red-500 bg-blue-500`).
- **Expected Output**: Resolution to winning class without duplicates.

### TC-LIB-03: Route Prefixing (`src/lib/routes.ts`)

- **Test Cases**: `to("/projects")` with and without `BASE_URL`.
- **Test Cases**: `currentRoute()` handling trailing slashes cleanly.

---

## 2. State & Business Logic

### TC-CAT-01: Catalog Filter Logic (`src/catalog/catalog-state.ts`)

- **Test**: Multi-filter combination (e.g. category + difficulty).
- **Test**: Price range filtering (inclusive min/max in paise).
- **Test**: Reset filters restores default array state.
- **Test**: Sorting by price ascending vs descending.

### TC-CRT-01: Cart Provider Context (`src/state/cart.tsx`)

- **Test**: Adding an item updates count and items list.
- **Test**: Re-adding the same project slug updates package configuration rather than appending a duplicate entry.
- **Test**: Remove item decrements count.
- **Test**: Persistence to localStorage survives simulated refresh.
