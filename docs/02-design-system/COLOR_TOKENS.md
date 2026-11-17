# Color Tokens & Brand System Comparison — LevUp Projects

**Document Status:** Comparative Audit & Controlled Migration Proposal  
**Last Reviewed:** 2026-11-17

---

## 1. Approved Brand Identity vs. Actual Figma Source Tokens

The approved brand specifications define the **Alloy & Volt** design system with a 60/30/10 composition:

| Role                          | Approved Specification | Approved Hex | Actual Figma Make Token (`src/index.css`) | Actual Hex | Delta & Visual Impact                                                                                                                                               |
| ----------------------------- | ---------------------- | ------------ | ----------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **60% Background Surface**    | **Mineral**            | `#F1F2EC`    | `--color-paper`                           | `#F7F8F5`  | Figma token is slightly brighter off-white (+4% luminance). `paper-deep` is `#F0F1EC` (nearly identical to Mineral).                                                |
| **30% Structural Dark / Ink** | **Alloy**              | `#203735`    | `--color-ink`                             | `#172D38`  | Figma token is slightly cooler slate-blue (Hue 200° vs Hue 175° for Alloy).                                                                                         |
| **10% Action / Accent**       | **Volt**               | `#E56B3F`    | `--color-copper`                          | `#D97736`  | Figma base token is deeper burnt copper (-12% saturation). Figma also added `--color-copper-action` (`#B95B21`) to pass WCAG AA contrast for white text on buttons. |

---

## 2. Approved Master SVG Logo Geometry

The master SVG logo is preserved in `src/components/brand/Logo.tsx` as an inline isometric engineering block:

```xml
<svg viewBox="0 0 40 44" aria-hidden="true" className="...">
  <!-- Facet 1: Top illuminated copper facet -->
  <path d="M20 2 38 12 20 22 2 12Z" fill="#E8955A" />
  <!-- Facet 2: Left mid-tone copper body -->
  <path d="M2 12 20 22v20L2 32Z" fill="#D97736" />
  <!-- Facet 3: Right shadowed copper facet -->
  <path d="M38 12 20 22v20l18-10Z" fill="#A9531F" />
  <!-- Base Shadow: Ink shadow with 18% opacity -->
  <path d="M2 12 20 22v20L2 32Z" fill="#172D38" fillOpacity=".18" />
  <!-- Technical Notch -->
  <path d="M26 24.5 32 21v7l-6 3.5Z" fill="#172D38" />
  <!-- Reflection highlight -->
  <path d="M8 22.5 14 26v5l-6-3.5Z" fill="#F7F8F5" fillOpacity=".55" />
</svg>
```

> [!CAUTION]
> **GOVERNANCE RULE: The master SVG logo geometry must NEVER be redrawn, regenerated, or replaced.**

---

## 3. Controlled Design Token Migration Plan

To avoid unintended visual regressions across the approved Figma Make UI, the migration to exact Mineral/Alloy/Volt values must be executed in a controlled, non-destructive sequence:

### Phase 1: Preserve Baseline (Current)

- Retain existing `--color-paper` (`#F7F8F5`), `--color-ink` (`#172D38`), and `--color-copper` (`#D97736`) tokens in `src/index.css`.
- Ensure all 3 implemented pages (`HomePage`, `ProjectsPage`, `ProjectDetailPage`) render identically to the approved Figma Make preview.

### Phase 2: Dual Token Mapping (Stage E Migration)

- Introduce alias tokens in `src/index.css`:
  ```css
  --color-mineral: #f1f2ec;
  --color-alloy: #203735;
  --color-volt: #e56b3f;
  --color-volt-action: #c44c20; /* High contrast button variant */
  ```
- Map `--color-paper` -> `--color-mineral`, `--color-ink` -> `--color-alloy`, `--color-copper` -> `--color-volt`.
- Execute automated visual regression screenshot comparisons with Playwright before cutting over.

### Phase 3: Brand Certification

- Certify WCAG AA contrast for all button states and typography with the new tokens before closing migration.
