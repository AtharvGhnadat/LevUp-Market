# Test Strategy — LevUp Projects

**Status:** Foundation documented (no tests implemented yet)  
**Last updated:** 2026-11-17

---

## Overview

> [!WARNING]
> No tests exist in the current codebase. This document defines the target testing strategy. Tests will be added during Stage C of the engineering foundation work.

---

## Testing Layers

| Layer | Framework | Scope | Status |
|---|---|---|---|
| Unit | Vitest + React Testing Library | Individual components, utilities, state logic | ⚠️ Not yet set up |
| Integration | Vitest | Multi-component flows, data transformations | ⚠️ Not yet set up |
| End-to-end | Playwright | Full user journeys in a real browser | ⚠️ Not yet set up |
| Visual regression | Playwright screenshots | Catch unintended design changes | ⚠️ Planned |

---

## Coverage Policy

| Category | Minimum target | Priority |
|---|---|---|
| Utility functions (`src/lib/`) | 90% | High |
| State logic (`src/catalog/`, `src/state/`) | 80% | High |
| UI components (critical paths) | 60% | Medium |
| Pages (integration) | Key user flows | Medium |
| E2E (critical journeys) | Defined below | High |

---

## Priority Test Cases

### Unit
- `src/lib/format.ts` — currency formatter (paise → INR)
- `src/lib/cn.ts` — class merge utility
- `src/lib/routes.ts` — base URL handling
- `src/catalog/catalog-state.ts` — filter, sort, pagination logic
- `src/state/cart.tsx` — add, remove, duplicate handling, localStorage

### E2E (Playwright)
- Home page renders all 7 sections
- Project catalog loads and filters by category
- Project detail page renders for a known slug
- Cart add/remove persists across page navigation
- Planned route pages show honest "not yet" message (not 404)

---

## CI Integration

Tests will run automatically in GitHub Actions on every pull request to `main`.

See the CI workflow when configured: `.github/workflows/ci.yml`

---

## Exclusions

- Do not test against production database or real payment APIs.
- Use Supabase local development (via `supabase start`) or test-specific projects.
- Use Cashfree sandbox credentials only in automated tests.
- Never commit real credentials to test fixtures.
