# Typography — LevUp Projects Design System

**Status:** Active  
**Last reviewed:** 2026-11-17  
**Source file:** `src/index.css`

---

## Typefaces

| Role               | Family           | Source                         | Weight range |
| ------------------ | ---------------- | ------------------------------ | ------------ |
| Display (headings) | Manrope Variable | `@fontsource-variable/manrope` | 200–800      |
| Body (UI text)     | Inter Variable   | `@fontsource-variable/inter`   | 100–900      |

Both typefaces are **self-hosted via `@fontsource-variable`**. No Google Fonts CDN dependency.

---

## CSS Custom Properties

```css
--font-display: "Manrope Variable", "Manrope", ui-sans-serif, system-ui, sans-serif;
--font-sans: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
```

Tailwind utility classes: `font-display` (Manrope) and `font-sans` (Inter).

---

## Type Scale

| Token                   | Size                                        | Line height       | Letter spacing | Usage                     |
| ----------------------- | ------------------------------------------- | ----------------- | -------------- | ------------------------- |
| `text-eyebrow`          | `0.6875rem` (11px)                          | `1rem`            | `0.08em`       | Section labels, overlines |
| `text-hero`             | `clamp(2.125rem, 1.25rem + 2.1vw, 2.75rem)` | `1.04`            | `−0.025em`     | Hero headings             |
| `text-section`          | `clamp(1.625rem, 1.2rem + 1vw, 1.9375rem)`  | `1.12`            | `−0.02em`      | Section headings          |
| Standard Tailwind scale | `text-sm`, `text-base`, `text-lg`, etc.     | Tailwind defaults | —              | Body text, UI elements    |

The `clamp()` values provide fluid scaling between mobile and 1440px desktop reference.

---

## Base Rules (from `src/index.css @layer base`)

```css
body {
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

h1,
h2,
h3,
h4 {
  font-family: var(--font-display);
}
```

---

## Usage Guidelines

| Element               | Font        | Weight                 | Notes                                   |
| --------------------- | ----------- | ---------------------- | --------------------------------------- |
| H1 — page titles      | Manrope     | `font-extrabold` (800) | Use `text-hero` or `text-section` scale |
| H2 — section headings | Manrope     | `font-bold` (700)      | Use `text-section` scale                |
| H3 — card titles      | Manrope     | `font-bold` (700)      | Standard Tailwind scale                 |
| Eyebrow labels        | Inter       | `font-semibold` (600)  | `text-eyebrow` with `tracking-widest`   |
| Body text             | Inter       | `font-normal` (400)    | `text-base` or `text-lg`                |
| Captions / meta       | Inter       | `font-medium` (500)    | `text-sm`                               |
| Buttons               | Manrope     | `font-bold` (700)      | Use `font-display` class                |
| Monospace / paths     | System mono | —                      | `font-mono` Tailwind class              |

---

## Responsive Behaviour

Typography scales between 375px (mobile) and 1440px (desktop reference) using `clamp()` for headings. Body text uses fixed rem values.

Do not use `px` units for font sizes in new code. Use `rem` or Tailwind's built-in scale.
