# Design Changelog — LevUp Projects

**Purpose:** Track all approved changes to the visual design system.  
**Rule:** No design element (color, typography, component, layout, brand asset) may be changed without an entry here.

---

## History

### [2026-11-17] Stage 1 — Global Design Tokens, Typography, Navigation & Accessibility Refinement

**Changed by:** Principal Product Designer, Design Systems Architect  
**Approved by:** Atharv Ghanadat (User Request — Stage 1 Scope Approval)  
**Affects:** Tokens, Typography, Navigation, Footer, Buttons, Accessibility

#### What changed

1. **Design Tokens & Color Mapping (`src/index.css`):**
   - Implemented the approved **Alloy & Volt** palette:
     - `--color-mineral`: `#F1F2EC` (60% calm engineering canvas)
     - `--color-alloy`: `#203735` (30% structural chrome and deep slate text)
     - `--color-volt`: `#E56B3F` (10% catalytic action accent)
   - Created WCAG 2.1 AA compliant text and action variants:
     - `--color-volt-action`: `#B95B21` (4.58:1 contrast with white text for solid buttons)
     - `--color-volt-text`: `#A44E1A` (5.06:1 contrast against Mineral canvas for body-sized text)
     - `--color-muted`: `#556765` (5.31:1 contrast against Mineral canvas for secondary text)
   - Maintained backward-compatible CSS aliases (`--color-paper`, `--color-ink`, `--color-copper`) to prevent breaking existing components.
2. **Typography Configuration:**
   - Installed `@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono`.
   - Configured `--font-sans` with IBM Plex Sans for interface and body.
   - Configured `--font-mono` with IBM Plex Mono for technical metadata.
   - Preserved `Manrope Variable` for display headings.
3. **Navigation & Footer Refinement:**
   - Refined `SiteHeader.tsx`: Normalized button heights (`h-9` for Login), cart badge (`h-4 min-w-4 text-[0.625rem] font-mono`), and preserved responsive height (`h-16 sm:h-[72px] lg:h-[72px]`).
   - Refined `NavDropdown.tsx`: Updated active link indicators with `--color-volt-action` hairline and accessible focus rings.
   - Refined `HeaderSearch.tsx`: Styled search input with accessible focus ring and keycap shortcut token.
   - Refined `SiteFooter.tsx`: Applied solid Alloy background, standardized 5-column grid layout, removed arbitrary decorative orange corner SVG blob, and updated typography hierarchy.
4. **Button & Input Foundations (`src/components/ui/Button.tsx`):**
   - Standardized button corner radius to 8px (`rounded-md`).
   - Standardized sizing: `sm` (32px), `md` (40px), `lg` (44px standard touch target).
   - Added `active:scale-[0.98]` micro-interaction and high-contrast `:focus-visible` outlines.
5. **Accessibility Enhancements:**
   - Upgraded `#main` skip link in `src/App.tsx` with high-contrast visible focus ring.
   - Verified 0 horizontal overflow across all breakpoints (1440px, 1280px, 768px, 390px).

#### Why

Fulfills Stage 1 of the LevUp Projects professional unslop transformation, establishing an authentic, accessible engineering design system without breaking existing functionality.

#### Files changed

- `src/index.css`
- `src/components/ui/Button.tsx`
- `src/components/layout/SiteHeader.tsx`
- `src/components/layout/SiteFooter.tsx`
- `src/components/layout/NavDropdown.tsx`
- `src/components/layout/HeaderSearch.tsx`
- `src/App.tsx`
- `scripts/verify-contrast.mjs`
- `scripts/capture-stage1-screenshots.mjs`
- `docs/02-design-system/screenshots/stage1/*`

---

### [2026-11-17] Initial design system documentation

**Changed by:** Engineering governance pass  
**Approved by:** Atharv Ghanadat (implicit — existing Figma Make output)  
**Affects:** Tokens, Typography, Brand

#### What changed

Documented the existing design token system, typography, and logo as implemented by Figma Make. No visual changes were made.

#### Why

Establishing the authoritative design baseline for future change tracking.

#### Files documented

- `src/index.css` — `@theme {}` token block
- `src/components/brand/Logo.tsx` — Logo geometry
- `docs/02-design-system/COLOR_TOKENS.md` — Token reference
- `docs/02-design-system/TYPOGRAPHY.md` — Type scale reference
