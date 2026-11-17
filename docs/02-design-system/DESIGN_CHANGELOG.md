# Design Changelog — LevUp Projects

**Purpose:** Track all approved changes to the visual design system.  
**Rule:** No design element (color, typography, component, layout, brand asset) may be changed without an entry here.

---

## Format

```
## [YYYY-MM-DD] Brief description

**Changed by:** Name
**Approved by:** Name
**Affects:** Tokens | Typography | Component | Layout | Brand

### What changed
Description of the change.

### Why
Rationale.

### Files changed
- `src/index.css`
- `src/components/...`
```

---

## History

### [2026-11-17] Initial design system documentation

**Changed by:** Engineering governance pass  
**Approved by:** Atharv Ghanadat (implicit — existing Figma Make output)  
**Affects:** Tokens, Typography, Brand

### What changed

Documented the existing design token system, typography, and logo as implemented by Figma Make. No visual changes were made.

### Why

Establishing the authoritative design baseline for future change tracking.

### Files documented

- `src/index.css` — `@theme {}` token block
- `src/components/brand/Logo.tsx` — Logo geometry
- `docs/02-design-system/COLOR_TOKENS.md` — Token reference
- `docs/02-design-system/TYPOGRAPHY.md` — Type scale reference
