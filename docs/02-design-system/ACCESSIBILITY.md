# Accessibility (A11y) Standards — LevUp Projects

**Document Status:** Baseline  
**Standard:** WCAG 2.1 Level AA Compliance  
**Last Updated:** 2026-11-17

---

## 1. Contrast Compliance

| Foreground Token           | Background Surface          | Contrast Ratio | WCAG 2.1 AA Result | Usage                            |
| -------------------------- | --------------------------- | -------------- | ------------------ | -------------------------------- |
| `paper` (`#F7F8F5`)        | `ink` (`#172D38`)           | **13.8 : 1**   | ✅ Passes AAA      | Body text on dark headers/cards  |
| `ink` (`#172D38`)          | `paper` (`#F7F8F5`)         | **13.8 : 1**   | ✅ Passes AAA      | Primary body copy on paper       |
| White (`#FFFFFF`)          | `copper-action` (`#B95B21`) | **4.9 : 1**    | ✅ Passes AA       | Button labels on action buttons  |
| `copper-ink` (`#A9531F`)   | `paper` (`#F7F8F5`)         | **5.3 : 1**    | ✅ Passes AA       | Highlighted links & eyebrow text |
| `muted` (`#65737B`)        | `paper` (`#F7F8F5`)         | **4.6 : 1**    | ✅ Passes AA       | Secondary labels and metadata    |
| `muted-on-ink` (`#A9B8BF`) | `ink` (`#172D38`)           | **6.1 : 1**    | ✅ Passes AA       | Subtitle copy on dark sections   |

> [!CAUTION]
> White text on base copper (`#D97736`) has a contrast ratio of only **3.2 : 1**, which fails WCAG AA for body text. Always use `copper-action` (`#B95B21`) for buttons with white text labels.

---

## 2. Keyboard Navigation & Focus Rings

- **Skip to Content Link**: An accessible skip link is positioned at the top of the DOM in `src/App.tsx` (`<a href="#main" className="sr-only focus:not-sr-only ...">Skip to content</a>`).
- **Focus Rings**: Standardized in `src/index.css`:
  ```css
  :focus-visible {
    outline: 2px solid var(--color-copper);
    outline-offset: 3px;
    border-radius: var(--radius-xs);
  }
  ```
- **Modal Dialogs**: `SearchDialog` and `MobileMenu` implement:
  - `role="dialog"` and `aria-modal="true"`.
  - Escape key listener to close the modal.
  - Focus trapping and restoration upon closing.

---

## 3. Motion & Screen Readers

- **Prefers-Reduced-Motion**: Enforced in `src/index.css`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    html {
      scroll-behavior: auto;
    }
    *,
    *::before,
    *::after {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
  ```
- **ARIA Semantics**:
  - Live regions (`role="status"`, `aria-live="polite"`) used for asynchronous notifications (e.g. cart update toast in `CartProvider`).
  - Screen-reader-only labels (`className="sr-only"`) for iconography lacking adjacent visible text.
  - Active states marked with `aria-current="page"`.
