# Design Changelog — LevUp Projects

**Purpose:** Track all approved changes to the visual design system.  
**Rule:** No design element (color, typography, component, layout, brand asset) may be changed without an entry here.

---

## History

### [2026-11-19] Catalog-first navigation

The approved direction gives catalog search the most space on desktop and makes Custom development a plain navigation link. The Projects disclosure uses the six catalog categories and indicates the selected category with type weight and a Volt edge line.

- **Header and drawer** — The expanded row begins at 70rem. Compact widths keep the approved logo and 44px Search, Cart and Menu controls. The bounded drawer scrolls internally, closes on navigation or resize to desktop, and restores a usable focus position.
- **Search** — One dialog replaces the two viewport-specific implementations. It uses existing catalog suggestions and query parameters, with named Clear and Close controls and a keyboard shortcut on the header trigger.
- **Working destinations** — How it works links to the homepage section. Account and resource destinations are omitted from the public header while their routes are placeholders.

The [navigation design and verification record](NAVIGATION.md) includes the before-and-after evidence and coverage. Method adapted from [Unslop](https://github.com/heydamir/unslop) by Damir Sokolovsky under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

### [2026-11-18] Stage E — Custom Project Development Requisition Interface

**Changed by:** Principal Product Designer, Design Systems Architect, Senior Frontend Engineer  
**Approved by:** Atharv Ghanadat (Stage 3 Finalization & Stage E Authorization)  
**Methodology Credit:** Unslop by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0  
**Affects:** `src/pages/CustomProjectPage.tsx`, `src/custom-project/custom-project-state.ts`, `src/App.tsx`, `e2e/custom-project.spec.ts`, `scripts/capture-stage-e.mjs`

#### What changed

1. **6-Stage Assembly Spine Workflow (`CustomProjectPage.tsx`):**
   - Implemented the full custom-development progression rail (`01 Submit Requirements` → `02 Feasibility Review` → `03 Quotation` → `04 Acceptance` → `05 Development` → `06 Delivery`) using The LevUp Assembly Spine motif.
2. **Engineering Requisition Form & Classification Awareness:**
   - Structured 4 numbered specification panels (`01 Scope & Project Classification`, `02 Requirements & Technical Specification`, `03 Deliverables, Budget Range & Target Date`, `04 Reference Files & Contact Information`) alongside a sticky Requisition Summary rail.
   - Dynamically shows hardware specification fields, circuit schematics, and Bill of Materials (BOM) options only for `hardware` and `hybrid` classifications so software-only projects never require hardware artifacts.
   - Supports catalog modification prefill via `/custom-project?project=<slug>&type=change-quote`.
   - Includes client-side validation with accessible error summaries (`role="alert"`, `aria-invalid`, `aria-describedby`), attachment validation (type, 10 MB size limit, max 5 files), and automatic localStorage draft preservation.
3. **Honest Prototype Boundary:**
   - Explicitly labels the interactive experience as a frontend prototype with no live backend connected; never fabricates quotations, prices, timelines, or server ticket IDs.
   - Includes a read-only **Review Specification** step and a confirmation screen offering local JSON specification export.

---

### [2026-11-18] Stage 3 — Full-Application Brand-Led Unslop Transformation (Stages A–D, F)

**Changed by:** Principal Product Designer, Design Systems Architect, Senior Frontend Engineer  
**Approved by:** Atharv Ghanadat (Master Design Directive — Unslop Transformation)  
**Methodology Credit:** Unslop by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), CC BY 4.0  
**Affects:** Global UI Primitives (`Button`, `Eyebrow`), Navigation & Footer (`SiteHeader`, `NavDropdown`, `HeaderSearch`, `SiteFooter`), Homepage (`HeroSection`, `BenefitStrip`, `HowItWorks`, `CategoryGrid`, `FeaturedProjects`, `FeaturedProjectCard`, `CustomProjectBanner`), Catalog (`ProjectsPage`, `CatalogProjectCard`), Project Detail (`ProjectDetailPage`, `ProjectMetadata`, `PackageSelector`, `OrderPriceSummary`, `AddOnConfigurator`, `ProjectInformationTabs`, `EngineeringBlockDiagram`, `RelatedProjects`), Cart & Checkout (`CartPage`, `CheckoutPage`, `CheckoutReturnPage`, `PlannedRoutePage`)

#### What changed

1. **Global Primitives & Type Discipline (Stage A):**
   - Enforced Unslop weight ceiling (400–600): replaced `font-extrabold` / `font-bold` across headings, buttons, and pricing with `font-semibold` and `font-medium`.
   - Removed negative letter spacing on sub-16px controls (`Button.tsx`, `NavDropdown.tsx`) and converted uppercase tracked section eyebrows (`Eyebrow.tsx`) and footer headers (`SiteFooter.tsx`) to sentence case.
   - Standardized control radius to 8px (`rounded-lg`), cards to 12px (`rounded-xl`), and nested badge radii to 6–8px.
   - Standardized Lucide icon strokes to `1.75` (and `1.5` for 28px category icons) and replaced `transition-all` + `hover:scale` card animations with targeted 150ms transitions using `cubic-bezier(0.22, 1, 0.36, 1)`.
2. **Navigation Chrome & Assembly Spine Homepage Polish (Stage B):**
   - `SiteHeader.tsx`: Quieted header chrome by styling `Sign In` as a clean text link next to the single `Get Started` button; shortened inline search placeholder to `"Search projects"`.
   - `HowItWorks.tsx`: Implemented **The LevUp Assembly Spine** — twin structured progression tracks for Ready-Made Projects and Custom Development with continuous hairline spine rails connecting numbered `Step 01`–`Step 04` caliper nodes.
   - `HeroSection.tsx`: Switched `"Supported."` accent from raw Volt (`2.87:1`) to accessible `VoltText` (`#A44E1A`, `5.06:1` WCAG AA) and aligned floating domain callouts to nested 8px radii.
   - `SiteFooter.tsx`: Removed `italic` styling and boosted muted contrast on Alloy to `#A2B5B3`.
3. **Catalog & Project Details Refinement (Stages C & D):**
   - Removed decorative `Sparkles` icon and uppercase badges on `ProjectsPage.tsx` and `CatalogProjectCard.tsx`.
   - Fixed WCAG AA price contrast on `CatalogProjectCard`, `ProjectMetadata`, and `OrderPriceSummary` by migrating from raw `text-copper` (`#E56B3F`) to accessible `text-volt-text` (`#A44E1A`) with `tabular-nums`.
   - Fixed `ProjectDetailPage` desktop container padding, repaired the `ProjectMetadata` share icon button clipping, and refactored `EngineeringBlockDiagram` so all four system blocks render without horizontal clipping on desktop.
4. **Cart & Checkout Accuracy & Polish (Stage F):**
   - Removed `Sparkles` icon, exclamation marks (`"Order Confirmed"`), mixed currency formatting (`₹0` via `formatPrice(0)`), and hardware-only assumptions in `CartPage` and `CheckoutPage` so deliverables accurately reflect package tier and project type.
5. **Verification:**
   - Verified 0px horizontal overflow across all 4 core routes (`/`, `/projects`, `/projects/:slug`, `/checkout`) × 4 viewports (1440px, 1280px, 768px, 390px) via `scripts/capture-unslop-polish.mjs`.

---

### [2026-11-18] Stage 2 — Homepage Visual Layout & Reference Refinement

**Changed by:** Principal Product Designer, Senior Frontend Engineer  
**Approved by:** Atharv Ghanadat (User Request — Stage 2 Implementation Approval & Reference Alignment)  
**Affects:** Homepage Layout, SiteHeader, SiteFooter, BenefitStrip, HowItWorks, HeroSection, e2e/catalog.spec.ts

#### What changed

1. **Header Navigation Refinement (`SiteHeader.tsx`):**
   - Updated header actions to feature subtle `Sign In` button and primary Volt `Get Started` button directly matching the approved mockup layout.
   - Guarded horizontal overflow at 1280px by switching inline search to search modal trigger below 1536px, achieving 0px horizontal scroll across all target viewports.
2. **Benefit Strip Restrained Presentation (`BenefitStrip.tsx`):**
   - Applied approved accurate labels: `Source Code & Documentation`, `Digital & Hardware Delivery`, `Technical Support & Revisions`, `Student Friendly`.
   - Updated supporting copy to accurately reflect package-dependent deliverables and revisions without overclaiming.
3. **Dual Customer Journey Process Flow (`HowItWorks.tsx`):**
   - Structured two distinct customer journeys per architectural specification:
     - Ready-Made Projects: `1. Explore Projects` → `2. Choose Package` → `3. Secure Checkout` → `4. Receive Delivery`.
     - Custom Development: `1. Submit Requirements` → `2. Review Quotation` → `3. Track Development` → `4. Receive Project`.
   - Connected steps with directional transitions and restrained Volt icon badges.
4. **Site Footer Layout (`SiteFooter.tsx`):**
   - Rebuilt footer columns matching reference structure: Explore, Services, Resources, and Company.
   - Added brand social icons (YouTube, GitHub, LinkedIn, Instagram) as accessible SVG links.
   - Added platform tagline: _"Made for Engineers, by Engineers."_
5. **E2E & Responsive Verification:**
   - Captured full-page screenshots at 1440px, 1280px, 768px, and 390px with zero horizontal overflow.
   - Verified mobile navigation drawer at 390px.
   - Programmatically verified WCAG 2.1 AA/AAA contrast across all color tokens.
   - All unit tests (35/35) and Playwright E2E tests (5/5) passing 100%.

---

### [2026-11-17] Stage 2 — Homepage Design Refactoring

**Changed by:** Principal Product Designer, Senior Frontend Engineer  
**Approved by:** Atharv Ghanadat (User Request — Stage 2 Scope & Approved Mockup Reference)  
**Affects:** Homepage Layout, HeroSection, BenefitStrip, HowItWorks, CategoryGrid, FeaturedProjects, FeaturedProjectCard, CustomProjectBanner

#### What changed

1. **Hero Redesign (`HeroSection.tsx`):**
   - Removed diagonal `clip-path` wedge polygon, copper slash gradient, and hand-drawn SVG scribble underline.
   - Refactored headline: _"Academic Projects Built, Delivered and Supported."_ with Volt accent on `Supported.`.
   - Added kicker: `— ENGINEERING PROJECTS MARKETPLACE`.
   - Streamlined 3 key value bullets: Source Code & Documentation, Working Implementation, Revisions & Support.
   - Restored authentic engineering showcase: framed workshop photograph with 3 floating pill badges (Hardware Projects, Software Projects, Hybrid Solutions).
   - Standardized CTAs: `Explore Projects` (Volt primary) and `Request Custom Project` (Alloy outline).
2. **Marketplace Assurance & Scale Strip (`BenefitStrip.tsx`):**
   - Transformed into a clean, 4-pillar assurance strip directly below Hero: `500+ Projects & Solutions`, `Engineering Focus (ECE, CSE, EEE, ME & more)`, `End-to-End Support (Build · Modify · Deliver)`, `Student Friendly (Academic & Competition Ready)`.
   - Elevated onto light mineral canvas with subtle borders and circular Volt icon badges.
3. **Transparent Delivery Flow (`HowItWorks.tsx`):**
   - Positioned cleanly under the assurance strip.
   - Implemented 4-step sequence: `1. Choose or Request`, `2. Get a Plan & Quote`, `3. Development`, `4. Deliver & Support`.
   - Added centered Volt-accented header and directional arrows connecting steps on desktop.
4. **Scannable Domain Exploration (`CategoryGrid.tsx`):**
   - Replaced oversized photo cards with a compact, 7-tile horizontal responsive grid matching approved mockup: IoT Systems, Software Projects, Embedded Systems, Robotics, AI / ML Projects, Electronics Projects, and Hybrid Solutions.
   - Added header with `View All Categories` action.
5. **Featured Projects Commercial Grid (`FeaturedProjects.tsx`, `FeaturedProjectCard.tsx`):**
   - Replaced 2-column sidebar layout with a clean 4-column commerce grid.
   - Linked to real catalog projects: Autonomous Obstacle Avoidance Robot (₹2,499), Student Project Management System (₹4,999), Smart Home Automation (₹3,999), and Quadcopter Flight Controller (₹6,999).
   - Standardized cards: category pill badge top-left on image, tabular prices, circular detail action buttons, and keyboard accessibility.
6. **Custom Project Call-to-Action (`CustomProjectBanner.tsx`):**
   - Removed diagonal polygon cutouts.
   - Refactored into a solid Alloy card with Volt highlights, 3 core capabilities (Project Design & Development, Milestone-Based Progress, Full Documentation & Support), and primary CTA.
7. **Redundancy Elimination (`HomePage.tsx`):**
   - Removed duplicate `TrustSection` invocation as its guarantees are now cleanly incorporated into `BenefitStrip` and `HowItWorks`.

#### Why

Aligns homepage composition directly with the user-approved reference mockup and Unslop principles, transforming the storefront into an authentic, accessible engineering marketplace.

#### Files changed

- `src/sections/home/HeroSection.tsx`
- `src/sections/home/BenefitStrip.tsx`
- `src/sections/home/HowItWorks.tsx`
- `src/sections/home/CategoryGrid.tsx`
- `src/sections/home/FeaturedProjects.tsx`
- `src/components/project/FeaturedProjectCard.tsx`
- `src/sections/home/CustomProjectBanner.tsx`
- `src/pages/HomePage.tsx`
- `src/data/demo-projects.ts`
- `e2e/catalog.spec.ts`
- `scripts/capture-stage2-baseline.mjs`
- `scripts/capture-stage2-after.mjs`
- `docs/02-design-system/screenshots/stage2/*`

---

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
