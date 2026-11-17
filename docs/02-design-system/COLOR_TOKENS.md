# Color Tokens — LevUp Projects Design System

**Status:** Active  
**Last reviewed:** 2026-11-17  
**Source file:** `src/index.css` (`@theme {}` block)

> [!IMPORTANT]
> These tokens are the authoritative design definition. Do not alter any token value without an approved design decision documented in [DESIGN_CHANGELOG.md](DESIGN_CHANGELOG.md).

---

## Brand Composition

The 60/30/10 composition rule:

| Role | Token | Hex | Percentage |
|---|---|---|---|
| Background / surfaces | `paper` | `#F7F8F5` | 60% |
| Text / dark elements | `ink` | `#172D38` | 30% |
| Accent / action | `copper` | `#D97736` | 10% |

---

## Full Token Reference

### Surface Tokens

| CSS variable | Tailwind class | Hex value | Usage |
|---|---|---|---|
| `--color-paper` | `bg-paper` / `text-paper` | `#F7F8F5` | Primary page background |
| `--color-paper-deep` | `bg-paper-deep` | `#F0F1EC` | Cards, secondary surfaces |
| `--color-white` | `bg-white` / `text-white` | `#FFFFFF` | Pure white overlays |

### Ink (Dark) Tokens

| CSS variable | Tailwind class | Hex value | Usage |
|---|---|---|---|
| `--color-ink` | `bg-ink` / `text-ink` | `#172D38` | Primary text, dark backgrounds |
| `--color-ink-soft` | `bg-ink-soft` / `text-ink-soft` | `#20404E` | Hover state for ink elements |
| `--color-ink-line` | `border-ink-line` | `#2F4D5B` | Dark surface borders |

### Copper (Accent) Tokens

| CSS variable | Tailwind class | Hex value | Usage |
|---|---|---|---|
| `--color-copper` | `text-copper` | `#D97736` | Brand accent, highlights |
| `--color-copper-action` | `bg-copper-action` | `#B95B21` | CTA button fill (WCAG AA white contrast) |
| `--color-copper-action-hover` | `bg-copper-action-hover` | `#A9531F` | CTA button hover |
| `--color-copper-ink` | `text-copper-ink` | `#A9531F` | Copper text on light backgrounds |
| `--color-copper-tint` | `bg-copper-tint` | `#FBEEE4` | Light copper surface / chip background |

### Utility Tokens

| CSS variable | Tailwind class | Hex value | Usage |
|---|---|---|---|
| `--color-line` | `border-line` | `#E4E9E8` | Standard dividers and borders |
| `--color-muted` | `text-muted` | `#65737B` | Secondary / subdued text on light surfaces |
| `--color-muted-on-ink` | `text-muted-on-ink` | `#A9B8BF` | Secondary text on dark surfaces |
| `--color-success` | `text-success` | `#547A6D` | Success states |

---

## Accessibility Notes

- White text on `copper-action` (`#B95B21`): **WCAG AA** compliant (contrast ratio ≈ 4.9:1).
- White text on `copper` (`#D97736`): **does NOT meet WCAG AA** — do not use white text on the base copper token.
- White text on `ink` (`#172D38`): **WCAG AAA** compliant.
- Black/ink text on `paper` (`#F7F8F5`): **WCAG AAA** compliant.

---

## Relationship to Master Brand Prompt

The master engineering prompt specifies:
- Mineral: `#F1F2EC`
- Alloy: `#203735`
- Volt: `#E56B3F`

The implemented tokens are a refinement of these values, optimised for accessibility and visual consistency in the Figma Make output. **The implemented values are the authoritative source** unless a design decision explicitly changes them.

---

## Shadows

| CSS variable | Usage |
|---|---|
| `--shadow-card` | Standard card elevation |
| `--shadow-card-hover` | Card hover state |
| `--shadow-panel` | Modal / drawer overlay |

---

## Radius Scale

| CSS variable | Value | Usage |
|---|---|---|
| `--radius-xs` | `3px` | Focus rings |
| `--radius-sm` | `6px` | Chips, badges |
| `--radius-md` | `8px` | Buttons |
| `--radius-lg` | `14px` | Cards, panels |
