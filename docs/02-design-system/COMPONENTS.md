# UI Component Catalog — LevUp Projects Design System

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Core Primitives (`src/components/ui/`)

### 1.1 Button (`Button.tsx`)
Polymorphic component supporting standard `<button>` or anchor `<a>` (`ButtonLink`).

| Variant | Background | Text / Border | Usage |
|---|---|---|---|
| `copper` | `bg-copper-action` (`#B95B21`) | White | Primary conversion CTA (WCAG AA compliant) |
| `ink` | `bg-ink` (`#172D38`) | White | Secondary high-contrast action |
| `outline` | Transparent | `border-line` with hover `bg-ink/5` | Tertiary actions, back buttons |
| `ghost` | Transparent | `text-ink` with hover `bg-ink/5` | Minimal inline actions |

Sizes: `sm` (h-8, text-xs), `md` (h-10, text-sm), `lg` (h-12, text-base).

### 1.2 Container (`Container.tsx`)
Enforces maximum layout width and horizontal padding across all viewport breakpoints:
- Max width: `max-w-[1348px]`
- Padding: `px-5 sm:px-8`

### 1.3 Eyebrow (`Eyebrow.tsx`)
Uppercase category or section tag:
- Text: `text-eyebrow` (11px), `font-semibold`, `tracking-[0.08em]`, uppercase.
- Tone: `copper` (`text-copper-ink`) or `ink` (`text-muted`).

---

## 2. Complex Domain Components

### 2.1 CatalogProjectCard (`src/components/catalog/CatalogProjectCard.tsx`)
- Displays responsive image crop with fallback.
- Difficulty badge (Beginner / Intermediate / Advanced).
- Delivery type chip (Digital files / Physical hardware / Digital + Hardware).
- Technology stack tags.
- Starting price formatted in INR (`₹X,XXX`).
- Link to `/projects/:slug`.

### 2.2 PackageSelector (`src/components/project-detail/PackageSelector.tsx`)
- Three-tier comparison: Basic, Standard, Premium.
- Shows price, deliverables included, free revisions, and revision window days.
- Radio-like keyboard-navigable selection interface.

### 2.3 AddOnConfigurator (`src/components/project-detail/AddOnConfigurator.tsx`)
- Checkbox list of eligible add-on deliverables.
- Handles fixed-price add-ons and "Quote required" items.
- Highlights whether an add-on introduces physical shipment requirements.

### 2.4 EngineeringBlockDiagram (`src/components/project-detail/EngineeringBlockDiagram.tsx`)
- Structured architectural flowchart representing the project's hardware/software pipeline:
  `[ Inputs ] ──> [ Controller ] ──> [ Process ] ──> [ Outputs ]`
