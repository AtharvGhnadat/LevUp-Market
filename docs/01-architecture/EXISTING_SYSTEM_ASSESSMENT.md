# Existing System Assessment — LevUp Projects

**Document status:** Initial baseline  
**Assessed by:** Engineering governance foundation pass  
**Assessment date:** 2026-11-17  
**Commit assessed:** `78b2142dcf02b3c905f6c93efb9fe5183762ae5c`  
**Review date:** To be updated after each significant change

---

## 1. Repository Origin

| Item | Value |
|---|---|
| Repository URL | https://github.com/AtharvGhnadat/LevUp-Market.git |
| Primary author | figma[bot] + Atharv Ghanadat |
| Origin platform | Figma Make (Figma's AI-driven code generation tool) |
| Commit count at assessment | 2 commits |
| Tags | None |
| Protected branches | None configured |
| Existing CI/CD | None |

The project was generated from Figma Make on 2026-11-17 and pushed directly to `main`. There is no prior development history.

---

## 2. Technology Stack (Actual)

| Layer | Technology | Version |
|---|---|---|
| Runtime | Node.js | 22 (`.mise.toml`) |
| Package manager | pnpm | 10.34.3 (`.mise.toml`) |
| Framework | React | 19.0.0 |
| Build tool | Vite | 8.0.5 |
| Language | TypeScript | 5.7.x |
| Styling | Tailwind CSS v4 | 4.0.x (via `@tailwindcss/vite`) |
| Icons | lucide-react | 1.71.0 |
| Fonts | Manrope Variable + Inter Variable | 5.3.x (`@fontsource-variable`) |
| Formatter | oxfmt | 0.76.0 |
| Router | None — custom `window.location.pathname` switch in `App.tsx` | — |
| State management | React Context (`CartProvider` in `src/state/cart.tsx`) | — |
| Backend | **None** | — |
| Database | **None** | — |
| Auth | **None** | — |
| Payments | **None** | — |

> [!IMPORTANT]
> This is a **Vite + React SPA**, not a Next.js application. There is no server-side rendering, no App Router, no API routes, and no backend of any kind.

---

## 3. Project Structure

```
LevUp-Market/
├── .figma/make/          # Figma Make toolchain scripts and config
├── .git/                 # Git repository
├── public/
│   └── favicon.png       # Favicon (generic blue Figma Make icon)
├── src/
│   ├── App.tsx            # Root component; custom path-switch router
│   ├── main.tsx           # React entrypoint
│   ├── index.css          # Global CSS + Tailwind v4 import + design tokens
│   ├── vite-env.d.ts      # Vite type shims
│   ├── catalog/
│   │   ├── catalog-state.ts    # Filter/sort state logic + URL param sync
│   │   └── filter-options.ts   # Derived filter option sets from catalog data
│   ├── components/
│   │   ├── brand/Logo.tsx       # LogoMark (SVG) + Logo (wordmark) components
│   │   ├── catalog/             # 7 catalog UI components (filter, card, pagination)
│   │   ├── layout/              # SiteHeader, SiteFooter, mobile menu, search
│   │   ├── project/             # FeaturedProjectCard
│   │   ├── project-detail/      # 9 project detail components
│   │   ├── search/SearchResults.tsx
│   │   └── ui/                  # Button, Container, Eyebrow primitives
│   ├── data/
│   │   ├── catalog-projects.ts  # 12 static demonstration projects (integer paise prices)
│   │   ├── categories.ts        # 6 categories with Unsplash image IDs
│   │   ├── demo-projects.ts     # Additional demo project stubs
│   │   ├── navigation.ts        # Primary nav + footer link groups
│   │   └── project-details.ts   # Full project detail data (packages, add-ons, FAQs)
│   ├── lib/
│   │   ├── cn.ts         # Tailwind class merge utility
│   │   ├── format.ts     # Currency formatter (paise → ₹)
│   │   ├── image.ts      # Unsplash image URL builder
│   │   └── routes.ts     # Base-URL-aware `to()` and `currentRoute()` helpers
│   ├── pages/
│   │   ├── HomePage.tsx           # Assembles 7 home sections
│   │   ├── PlannedRoutePage.tsx   # Honest "not built yet" placeholder for all other routes
│   │   ├── ProjectDetailPage.tsx  # Individual project page
│   │   └── ProjectsPage.tsx       # Full catalog with filters, sorting, pagination
│   ├── sections/home/            # 7 homepage sections (Hero, Benefits, Categories, etc.)
│   └── state/cart.tsx            # Client-side cart (localStorage, no backend)
├── index.html            # Vite HTML shell
├── package.json          # Dependencies and scripts
├── pnpm-lock.yaml        # Lock file (pnpm 10.34.3)
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite + Figma Make plugins configuration
```

---

## 4. Implemented Frontend Functionality

### 4.1 Fully Implemented (visual + interactive)

| Feature | Location | Notes |
|---|---|---|
| Home page | `src/pages/HomePage.tsx` + `src/sections/home/` | All 7 sections rendered |
| Hero section | `src/sections/home/HeroSection.tsx` | CTA buttons link to PlannedRoutePage |
| Benefit strip | `src/sections/home/BenefitStrip.tsx` | Static content |
| Category grid | `src/sections/home/CategoryGrid.tsx` | Links to `/projects?category=...` |
| Featured projects | `src/sections/home/FeaturedProjects.tsx` | Renders top 4 from static data |
| Custom project banner | `src/sections/home/CustomProjectBanner.tsx` | CTA to PlannedRoutePage |
| How it works | `src/sections/home/HowItWorks.tsx` | Static 4-step process |
| Trust section | `src/sections/home/TrustSection.tsx` | Static trust indicators |
| Sticky header | `src/components/layout/SiteHeader.tsx` | Logo, nav, search, cart badge, login |
| Navigation dropdowns | `src/components/layout/NavDropdown.tsx` | Hover menus for Explore + Resources |
| Mobile menu | `src/components/layout/MobileMenu.tsx` | Full-screen drawer |
| Inline search bar | `src/components/layout/HeaderSearch.tsx` | XL-only; navigates to PlannedRoutePage |
| Search dialog | `src/components/layout/SearchDialog.tsx` | Mobile/tablet; navigates to PlannedRoutePage |
| Site footer | `src/components/layout/SiteFooter.tsx` | 4 link groups |
| Project catalog page | `src/pages/ProjectsPage.tsx` + `src/components/catalog/` | Full client-side filtering, sorting, pagination |
| Catalog filters | `src/catalog/catalog-state.ts` | URL param sync, 9 filter dimensions |
| Project detail page | `src/pages/ProjectDetailPage.tsx` + `src/components/project-detail/` | Gallery, tabs, package selector, add-on configurator |
| Client-side cart | `src/state/cart.tsx` | localStorage persistence; **no order creation or payment** |
| Cart badge | `SiteHeader.tsx` | Live count from CartContext |
| Package selection | `src/components/project-detail/PackageSelector.tsx` | UI only; no server validation |
| Add-on configurator | `src/components/project-detail/AddOnConfigurator.tsx` | UI only; no pricing API |
| Engineering block diagram | `src/components/project-detail/EngineeringBlockDiagram.tsx` | Static SVG-like layout |
| Skip-to-content link | `App.tsx` | Accessible bypass link |
| Reduced-motion support | `src/index.css` | Media query applied globally |
| Design tokens | `src/index.css` `@theme {}` block | Tailwind CSS v4 custom properties |
| Planned route page | `src/pages/PlannedRoutePage.tsx` | Honest placeholder for 20+ unbuilt routes |
| Logo mark (SVG inline) | `src/components/brand/Logo.tsx` | Isometric block geometry inline SVG |

### 4.2 UI Present but Not Functionally Connected

> [!WARNING]
> The following UI elements exist visually but do NOT have backend implementations. Buttons render; they do not create real transactions.

| Element | Visible location | Actual state |
|---|---|---|
| "Add to Cart" button | Project detail | Writes to localStorage only; never reaches a server |
| "Proceed to Checkout" / cart link | Header | Navigates to PlannedRoutePage |
| "Login / Sign Up" button | Header | Navigates to PlannedRoutePage |
| Search results | Search dialog/bar | Client-side text match against static data only |
| Price display | Project cards + detail | Static paise values in `catalog-projects.ts`; no live pricing API |
| Package prices | Package selector | Static values in `project-details.ts` |
| Add-on prices | Add-on configurator | Static values; "Quote required" for some |
| "Get Custom Quote" CTA | Custom project banner | Navigates to PlannedRoutePage |

---

## 5. Routes and Pages

### 5.1 Implemented Routes

| Route | Component | Status |
|---|---|---|
| `/` | `HomePage` | ✅ Implemented |
| `/projects` | `ProjectsPage` | ✅ Implemented (static data) |
| `/projects/:slug` | `ProjectDetailPage` | ✅ Implemented (static data, 12 slugs) |

### 5.2 Planned Routes (PlannedRoutePage placeholder)

All routes below render `PlannedRoutePage` with an honest "not built yet" message:

`/custom-project`, `/how-it-works`, `/cart`, `/login`, `/register`, `/faq`, `/contact`, `/terms`, `/privacy`, `/refund-policy`, `/shipping-policy`, `/license`, `/academic-use`, `/pricing`, `/resources`, `/resources/project-guidelines`, `/resources/articles`, `/about`, `/careers`, `/checkout`, `/categories/:slug`

### 5.3 Not Yet Planned in Code

- `/dashboard/*` (customer dashboard — all sub-routes)
- `/admin/*` (admin portal — all sub-routes)
- `/account/*` (profile, settings)
- `/orders/*`, `/invoices/*`, `/tickets/*`

---

## 6. Data Model (Static, Frontend-Only)

| Entity | Location | Notes |
|---|---|---|
| `CatalogProject` | `src/data/catalog-projects.ts` | 12 entries; prices in integer paise |
| `Category` | `src/data/categories.ts` | 6 categories with Unsplash image IDs |
| `ProjectDetail` | `src/data/project-details.ts` | Full detail for `esp32-smart-irrigation-system` and `ai-object-detection-yolo` only |
| `CartItem` | `src/state/cart.tsx` | In-memory + localStorage; no server |
| Navigation | `src/data/navigation.ts` | Static link arrays |
| Demo projects | `src/data/demo-projects.ts` | Additional placeholder stubs |

> [!NOTE]
> `project-details.ts` contains full detail data for **2 of 12** catalog projects. The remaining 10 show a "Project not found" error on their detail pages unless `getProjectDetail()` creates a fallback.

---

## 7. Brand and Design Tokens

### 7.1 Color Tokens (defined in `src/index.css` `@theme {}`)

| Token | Hex value | Role |
|---|---|---|
| `--color-paper` | `#F7F8F5` | Primary background (60%) |
| `--color-paper-deep` | `#F0F1EC` | Secondary surface |
| `--color-ink` | `#172D38` | Primary text / dark tone (30%) |
| `--color-ink-soft` | `#20404E` | Hover state |
| `--color-ink-line` | `#2F4D5B` | Border variant |
| `--color-copper` | `#D97736` | Brand accent (10%) |
| `--color-copper-action` | `#B95B21` | CTA button fill (WCAG AA white contrast) |
| `--color-copper-action-hover` | `#A9531F` | CTA hover |
| `--color-copper-ink` | `#A9531F` | Copper text on light backgrounds |
| `--color-copper-tint` | `#FBEEE4` | Light copper surface |
| `--color-line` | `#E4E9E8` | Dividers and borders |
| `--color-muted` | `#65737B` | Secondary text |
| `--color-muted-on-ink` | `#A9B8BF` | Secondary text on dark surfaces |
| `--color-success` | `#547A6D` | Success states |

> [!NOTE]
> The tokens in use diverge slightly from the stated brand palette in the master prompt (Mineral `#F1F2EC`, Alloy `#203735`, Volt `#E56B3F`). The implemented palette is a refined variant: `paper (#F7F8F5)`, `ink (#172D38)`, `copper (#D97736)`. **Do not alter these tokens without an explicit design decision documented in DESIGN_CHANGELOG.md.**

### 7.2 Typography

| Token | Value |
|---|---|
| `--font-display` | Manrope Variable |
| `--font-sans` | Inter Variable |

Both are loaded from `@fontsource-variable` (self-hosted, no Google Fonts CDN dependency).

### 7.3 Logo

The logo is an **inline SVG `LogoMark`** component in `src/components/brand/Logo.tsx`. It is an isometric engineering block constructed from 6 SVG `<path>` elements using copper/ink colours. There is **no external SVG file** in `public/`. The `public/` directory contains only `favicon.png` (a generic Figma Make blue icon, not the LevUp brand).

**Logo status:**
- ✅ Inline SVG `LogoMark` present in `Logo.tsx`
- ⚠️ No standalone `.svg` file exported to `public/`
- ⚠️ `favicon.png` is a generic Figma Make icon, not the LevUp brand favicon

---

## 8. Architecture Risks

| Risk | Severity | Description |
|---|---|---|
| No backend | Critical | Zero server-side logic. Cart, auth, payments, orders are all absent. |
| Client-only routing | High | `window.location.pathname` switch; no React Router or Next.js. Deep links require server-side fallback configuration. |
| Static data | High | All project data, prices and categories are hardcoded TypeScript. No CMS, database or API. |
| Partial detail data | High | Only 2 of 12 catalog projects have full detail pages. |
| No authentication | Critical | No auth system whatsoever. |
| No payment integration | Critical | Cashfree not integrated at all. |
| No `.env` management | Medium | No `.env.example`, no environment variable usage, no secret handling. |
| No testing | High | Zero test files. No Vitest, no Playwright, no RTL setup. |
| No CI/CD | High | No GitHub Actions workflows. |
| Figma-locked vite config | Medium | `vite.config.ts` contains Figma Make-specific plugins that are unnecessary outside Figma Make. |
| No logging | Medium | No structured logging system. |
| No error boundaries | Medium | No React error boundaries beyond Vite's built-in overlay. |
| pnpm required | Low | Project uses pnpm lockfile; npm install will fail. |
| Generic favicon | Low | Favicon is a Figma Make default, not LevUp brand. |
| robots.txt: noindex | Low | `site.json` has `"index": false`. Site will not be indexed by search engines. |

---

## 9. Files Requiring Preservation

The following files represent approved design and functionality and must not be deleted, overwritten or structurally changed without an explicit design decision:

- `src/index.css` — All design tokens and global base styles
- `src/components/brand/Logo.tsx` — Brand logo geometry
- All `src/sections/home/*.tsx` — Approved homepage design
- `src/components/layout/SiteHeader.tsx` and `SiteFooter.tsx`
- `src/components/catalog/*.tsx` — Catalog UI
- `src/components/project-detail/*.tsx` — Project detail UI
- `src/data/catalog-projects.ts` — Existing product catalog data
- `src/data/categories.ts` — Category definitions
- `src/data/project-details.ts` — Detailed project data

---

## 10. Existing Git State

| Field | Value |
|---|---|
| Active branch | `chore/production-engineering-foundation` (new, branched from `main`) |
| `main` HEAD | `78b2142dcf02b3c905f6c93efb9fe5183762ae5c` |
| Uncommitted changes at assessment | None (clean) |
| Stashed changes | None |
| Remote | `origin` → `https://github.com/AtharvGhnadat/LevUp-Market.git` |
| Pull request template | None |
| Branch protection | Not configured |

---

## 11. Missing Documentation and Governance

- ❌ No `README.md` with meaningful content (file contains only "1 line" from initial commit)
- ❌ No `CHANGELOG.md`
- ❌ No `CONTRIBUTING.md`
- ❌ No `SECURITY.md`
- ❌ No `.env.example`
- ❌ No PRD in repository
- ❌ No ADRs
- ❌ No `docs/` directory
- ❌ No GitHub Actions workflows
- ❌ No PR templates
- ❌ No branch protection rules

---

## 12. Recommended Implementation Sequence

### Stage A (this pass) — Inspection ✅
Forensic assessment complete. Baseline documented.

### Stage B (current pass) — Git + Documentation foundation
- Create `chore/production-engineering-foundation` branch ✅
- Create `docs/` hierarchy
- Write core governance documents
- Configure `.gitignore` patterns for `logs/`
- Create `.env.example`
- Create `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`

### Stage C — Developer tooling
- Install and configure ESLint + TypeScript ESLint
- Configure Prettier (or assess oxfmt)
- Add Vitest + React Testing Library
- Add Playwright
- Add Husky + lint-staged + commitlint
- Configure GitHub Actions CI

### Stage D — Logging, security, observability foundations
- Implement structured logging interface
- Add `.env` driven configuration
- Document security boundaries

### Stage E — Frontend migration and expansion
- Assess Next.js migration vs. Vite retain (ADR required)
- Complete project detail data for all 12 catalog projects
- Implement remaining planned routes
- Fix favicon

### Stage F — Backend modules
- Supabase project setup
- Schema design and migrations
- API routes

### Stage G — Supabase + Cashfree integration
- Auth implementation
- Payments implementation
- Storage and file delivery

### Stage H — Customer dashboard + Admin portal

### Stage I — Production readiness review
