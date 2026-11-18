# Design Changelog — LevUp Projects

**Purpose:** Track all approved changes to the visual design system.  
**Rule:** No design element (color, typography, component, layout, brand asset) may be changed without an entry here.

---

## History

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
