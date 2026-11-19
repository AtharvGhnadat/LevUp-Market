# Public navigation

The catalog-first direction was approved on 19 November 2026 (IST). The feature branch starts from remediation commit `25d8e8c`.

## Baseline audit

Chromium captured the homepage, catalog, project detail and custom project page at 1440, 1280, 1024, 768, 390 and 320 CSS pixels before changes. Additional captures covered 360, 430 and 1600 pixels. The viewport, focus and route checks found these issues:

- The header reached 1055px at a 1024px viewport and 324px at a 320px viewport. The excess clipped the registration action and compact menu control.
- The compact menu covered the full viewport. Resizing an open drawer from 768px to 1440px hid the dialog while leaving it modal, so other header controls stayed inert.
- Search required two Escape presses after typing. At widths below 1536px its trigger had only an icon. The category list linked to roadmap category pages even though the catalog accepted category filters.
- Account and resource destinations rendered roadmap placeholders. How It Works also opened a placeholder despite the existing homepage section.
- The desktop Projects disclosure already supported Space, Tab and Escape successfully. The cart already used the cart context. Both behaviors were retained.

## Approved direction

- **Product** — Students find ready-made engineering projects by topic or technology and request custom builds when needed.
- **Character** — Ordered, direct, approachable.
- **World** — An engineering library's catalog desk, with Mineral surfaces, Alloy labels and Volt for selection.
- **Moments** — The labeled search control and a compact index with six actual categories and a dedicated All projects row.
- **Signature** — A Volt edge line and heavier type mark the selected category.

## Implementation

| Surface        | Behavior                                                                                                                                                                                                                                                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Header         | The full row appears from 70rem. Projects, Custom development and How it works sit beside the existing wordmark. Search gets the widest control. The cart count comes from cart context. The compact row retains 44px Search, Cart and Menu controls.                  |
| Projects       | A button exposes the catalog index using native links and an expanded state. Focus can move through links in source order. Escape, outside clicks and leaving the disclosure dismiss it. The selected category is announced as current and marked visually.            |
| Search         | The same labeled dialog handles pointer and keyboard entry at every width. It uses existing catalog suggestions, submits `/projects?q=`, and links to real category filters and project details. Clear resets the field. Escape and Close dismiss it and return focus. |
| Compact drawer | A native modal is sized to its contents and capped to the viewport with safe-area margins. Overflow scrolls inside it. It closes with Escape, a backdrop click, navigation or a switch to desktop.                                                                     |
| Destinations   | The How it works link goes to the published homepage section. Account and resource entries are deferred until their public routes work.                                                                                                                                |

The production changes are in `src/components/layout`, `src/components/search/SearchResults.tsx`, `src/data/navigation.ts` and the navigation styles in `src/index.css`.

## Before and after

These captures show the same running application routes under Chromium. External image requests were blocked in both passes to keep navigation captures independent of third-party image availability.

| View                         | Before                                                          | After                                                                         |
| ---------------------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Desktop · 1440px             | [Header](screenshots/navigation/before-desktop-1440.png)        | [Header](screenshots/navigation/after-desktop-1440.png)                       |
| Laptop · 1280px              | [Header](screenshots/navigation/before-laptop-1280.png)         | [Header](screenshots/navigation/after-laptop-1280.png)                        |
| Small laptop · 1024px        | [Clipped header](screenshots/navigation/before-laptop-1024.png) | [Compact header](screenshots/navigation/after-laptop-1024.png)                |
| Tablet · 768px               | [Expanded drawer](screenshots/navigation/before-tablet-768.png) | [Expanded drawer](screenshots/navigation/after-tablet-768.png)                |
| Mobile · 390px               | [Header](screenshots/navigation/before-mobile-390.png)          | [Header](screenshots/navigation/after-mobile-390.png)                         |
| Narrow mobile · 320px        | [Header](screenshots/navigation/before-mobile-320.png)          | [Header](screenshots/navigation/after-mobile-320.png)                         |
| Projects disclosure · 1440px | [Open](screenshots/navigation/before-projects-1440.png)         | [Open with selected category](screenshots/navigation/after-projects-1440.png) |
| Search · 320px               | [Matches](screenshots/navigation/before-search-320.png)         | [Matches](screenshots/navigation/after-search-320.png)                        |
| Compact drawer · 390px       | [Open](screenshots/navigation/before-drawer-390.png)            | [Open](screenshots/navigation/after-drawer-390.png)                           |

## Verification

The navigation Playwright suite covers Tab order, focus outline, Enter and Space activation, category navigation, current state, outside click, Escape, reduced motion, viewport fit, search reset and submission, drawer resizing, and actual cart updates. The existing catalog, checkout and requisition suites cover routing regressions. Account UI stays outside this change until the application has a working customer session and destination.

- Chromium reported no document or header overflow at 320, 360, 390, 430, 720, 768, 1024, 1280, 1440 or 1600 CSS pixels on the captured routes. At 320 × 420px the expanded drawer used 394px of internal viewport for 554px of scrollable content and locked the page behind it.
- Native 200% Chromium zoom changed the CSS viewport from 1414px to 707px. The compact header fit, and Escape restored focus to Menu. The Chromium accessibility tree exposed the named dialog, close button, disclosure and native destination links. [Browser zoom capture](screenshots/navigation/after-browser-zoom-200.png)

| Gate                | Local result                                                                                                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `pnpm format:check` | Passed                                                                                                             |
| `pnpm lint`         | Passed with four existing warnings outside the changed navigation files                                            |
| `pnpm typecheck`    | Passed                                                                                                             |
| `pnpm test`         | 54 tests passed                                                                                                    |
| `pnpm test:e2e`     | 15 Chromium tests passed against an isolated local Vite instance after the shared preview stopped serving requests |
| `pnpm build`        | Passed                                                                                                             |

Method adapted from [Unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
