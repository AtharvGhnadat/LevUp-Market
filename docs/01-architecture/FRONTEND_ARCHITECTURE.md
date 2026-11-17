# Frontend Architecture — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Overview

The existing frontend is an approved **React 19 Single Page Application** built with **Vite 8**, **TypeScript 5.7**, and **Tailwind CSS v4**.

It incorporates:
- Fully responsive design matching 1440px desktop reference down to 375px mobile.
- Custom path-switch routing in `src/App.tsx` mapped to PRD routes.
- Tailwind CSS v4 design tokens declared in `src/index.css` `@theme {}`.
- Isolated catalog state with full 2-way URL search parameter synchronization.
- Cart context with local storage persistence.

---

## 2. Component Hierarchy

```
src/
├── App.tsx                     # Top-level path switch & CartProvider wrapper
├── components/
│   ├── brand/
│   │   └── Logo.tsx            # Inline SVG LogoMark + wordmark
│   ├── layout/
│   │   ├── SiteHeader.tsx      # Sticky header with responsive controls
│   │   ├── NavDropdown.tsx     # Primary nav dropdown menus
│   │   ├── HeaderSearch.tsx    # Desktop inline search bar
│   │   ├── SearchDialog.tsx    # Mobile & tablet search modal dialog
│   │   ├── MobileMenu.tsx      # Slide-out full-height mobile navigation drawer
│   │   └── SiteFooter.tsx      # Footer with 4 categorized link columns
│   ├── catalog/
│   │   ├── CatalogProjectCard.tsx   # Project summary card with badges & pricing
│   │   ├── CatalogFilterPanel.tsx   # Multi-category sidebar filter panel
│   │   ├── MobileFilterDrawer.tsx   # Mobile slide-over filter drawer
│   │   ├── FilterGroup.tsx          # Accordion-style checkbox filter group
│   │   ├── ActiveFilterChips.tsx    # Dismissible active filter chip list
│   │   ├── CatalogPagination.tsx    # Numeric & prev/next pagination controls
│   │   └── CatalogStates.tsx        # Empty state & results count bar
│   ├── project-detail/
│   │   ├── ProjectBreadcrumb.tsx    # Navigational breadcrumbs
│   │   ├── ProjectGallery.tsx       # Multi-image viewer with thumbnail strip
│   │   ├── ProjectMetadata.tsx      # Tech stack, difficulty, delivery type badges
│   │   ├── PackageSelector.tsx      # Basic/Standard/Premium tier selection
│   │   ├── AddOnConfigurator.tsx    # Deliverables & physical add-on checkboxes
│   │   ├── OrderPriceSummary.tsx    # Live price calculation display
│   │   ├── PurchaseConfigurator.tsx # Aggregates package, add-ons, & add-to-cart
│   │   ├── EngineeringBlockDiagram.tsx # Architectural block diagram layout
│   │   ├── ProjectInformationTabs.tsx  # Multi-tab technical breakdown
│   │   ├── RevisionEntitlement.tsx  # Free revision terms notice
│   │   └── RelatedProjects.tsx      # Related catalog recommendations
│   └── ui/
│       ├── Button.tsx               # Polymorphic Button & ButtonLink (ink, copper, outline, ghost)
│       ├── Container.tsx            # Max-width container wrapper
│       └── Eyebrow.tsx              # Uppercase tracking-widest section overline
├── pages/
│   ├── HomePage.tsx                 # Composes 7 home sections
│   ├── ProjectsPage.tsx             # Complete catalog view with reactive filters
│   ├── ProjectDetailPage.tsx        # Detailed project specification view
│   └── PlannedRoutePage.tsx         # Honest "not built yet" route placeholder
└── sections/home/
    ├── HeroSection.tsx              # Visual hero with primary and secondary CTAs
    ├── BenefitStrip.tsx             # Value proposition summary strip
    ├── CategoryGrid.tsx             # 6 engineering domain tiles
    ├── FeaturedProjects.tsx         # Handpicked project spotlight
    ├── CustomProjectBanner.tsx      # Bespoke engineering build banner
    ├── HowItWorks.tsx               # 4-step ordering & delivery explanation
    └── TrustSection.tsx             # Quality assurance and student support guarantees
```

---

## 3. State Management

1. **Routing State**: Managed through `src/lib/routes.ts` (`currentRoute()`, `to(path)`). It reads `window.location.pathname` and triggers React component re-renders.
2. **Catalog Filter State**: Encapsulated in `src/catalog/catalog-state.ts`. It provides pure reducer-like methods (`updateFilter`, `resetFilters`, `sortProjects`) and synchronizes 9 query parameters with `window.history.pushState`.
3. **Cart State**: Managed by `CartProvider` in `src/state/cart.tsx`. Provides items, count, item existence check, and add/remove functions, persisted to `localStorage` under `levup-cart-preview`.

---

## 4. Next.js Migration Strategy

As established in [ADR-0001](adr/ADR-0001-architecture-baseline.md), the frontend will transition to Next.js App Router without altering the visual presentation:
1. Re-export existing components directly into Next.js App Router client components (`"use client"`).
2. Replace `src/pages/HomePage.tsx` with `app/page.tsx`.
3. Replace `src/pages/ProjectsPage.tsx` with `app/projects/page.tsx`.
4. Replace `src/pages/ProjectDetailPage.tsx` with `app/projects/[slug]/page.tsx`.
5. Maintain the exact same Tailwind CSS v4 design tokens in the target project.
