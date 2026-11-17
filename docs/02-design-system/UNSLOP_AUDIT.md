# LEVUP PROJECTS — UNSLOP DESIGN AUDIT REPORT

**Document ID:** UAR-001  
**Audit Date:** 2026-11-17  
**Auditor:** Principal Product Designer, Design Systems Architect, Senior Frontend Engineer  
**Methodology:** Unslop Audit Framework by Damir Sokolovsky ([@heydamir](https://x.com/heydamir), CC BY 4.0)  
**Target Repository:** `https://github.com/AtharvGhnadat/LevUp-Market.git`  
**Working Branch:** `design/unslop-foundation`  
**Reference Viewports Audited:**

- **Desktop:** 1440 × 900px (`home-desktop-1440.png`, `catalog-desktop-1440.png`, `project-detail-desktop-1440.png`)
- **Laptop:** 1280 × 800px (`home-laptop-1280.png`, `catalog-laptop-1280.png`, `project-detail-laptop-1280.png`)
- **Tablet:** 768 × 1024px (`home-tablet-768.png`, `catalog-tablet-768.png`, `project-detail-tablet-768.png`)
- **Mobile:** 390 × 844px (`home-mobile-390.png`, `catalog-mobile-390.png`, `project-detail-mobile-390.png`)

---

## 1. Executive Summary & Slop Classification

LevUp Projects is currently implemented as a functional, Figma-generated Single Page Application. While the underlying application mechanics (filtering, cart dispatch, package configuration, and routing) are robust and bug-free, the visual layer suffers from **Medium-to-Heavy AI/Figma Template Slop**.

### Primary Slop Indicators Identified:

1. **Aggressive Geometric Slashes & Angular Masking:** The hero section (`HeroFrame`) and custom banner use diagonal clip-paths, diagonal gradients, and angled wedges that scream "Figma agency template" rather than real engineering.
2. **Hand-Drawn Vector Scribbles:** The hero headline features an SVG curved underline scribble beneath "Implementation".
3. **Triple Redundancy of Value Strips:** The homepage contains three separate 4-item benefit/service strips within a single scroll: Hero service labels, dark BenefitStrip, and TrustSection cards—all repeating identical claims.
4. **Extreme Image Cropping:** Catalog and featured project card thumbnails use an extreme 2.77:1 aspect ratio (`aspect-[297/107]`), severely slicing off circuit boards, robotics components, and documentation previews.
5. **Pill-Badge Saturation:** Nearly every label, count, technology, and delivery mode is rendered as an egg-shaped pill (`rounded-full`), violating nested-radius discipline.
6. **Arbitrary Pixel Micro-Spacing:** Extensive use of arbitrary Tailwind JIT values (`pt-[26px]`, `pb-[30px]`, `h-[31px]`, `h-[38px]`, `xl:gap-[22px]`, `lg:pl-[46px]`, `lg:pl-[65px]`, `lg:grid-cols-[1.08fr_1fr_1.05fr_1fr]`).
7. **Semantic Color Misuse:** Ordinary body paragraph copy in `TrustSection` is styled with `text-success` green (`#547a6d`).
8. **Inconsistent Icon Dimensions:** Icon sizes jump erratically from 16px to 18px, 22px, 26px, 30px, and 36px across adjacent components on the same screen.

---

## 2. Comprehensive Component-by-Component Findings

### Route 1: Public Homepage (`/`)

#### Issue 1.1: Hero Section — Diagonal Slashes and SVG Underline Scribble

- **Route:** `/`
- **Component:** `HeroSection` / `HeroFrame`
- **File Path:** [`src/sections/home/HeroSection.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/sections/home/HeroSection.tsx)
- **Current Problem:**
  1. The right-hand visual (`HeroFrame`) relies on hardcoded SVG polygon clip-paths (`M196 0H800V240L703 352Q689 368 667 367L74 341Q50 340 58 320Z`), dual-tone diagonal gradient slashes (`url(#...-slash)` from `#C2632A` to `#E59A62`), and angular decorative cutouts over an Unsplash stock photo.
  2. The headline contains a curved vector scribble underline beneath "Implementation" (`viewBox="0 0 300 12"`), an informal AI template artifact.
  3. Non-scale arbitrary spacing: `pt-[26px]`, `pb-[30px]`, `mt-[22px]`, `sm:w-[194px]`, `sm:w-[257px]`.
- **Screenshot Evidence:** `docs/02-design-system/screenshots/audit/home-desktop-1440.png`, `home-mobile-390.png`
- **Severity:** **CRITICAL**
- **Recommended Correction:**
  1. Eliminate the diagonal clip-path polygon and gradient slashes entirely. Replace with a clean, authentic engineering visual: an interactive or framed technical project showcase (schematic + hardware view) embedded in calm space.
  2. Remove the decorative vector underline scribble.
  3. Normalize all padding, margins, and button dimensions to the 4px grid (e.g. `pt-8`, `pb-12`, standard button scale `h-11 px-5`).
- **Reason:** Real engineering platforms (such as PCBWay, Digikey, Arduino, or National Instruments) present technical clarity and precision, not diagonal graphic slashes and doodle underlines.
- **Expected User Benefit:** Immediate authority and credibility; eliminates the impression of an unvetted student project template.

---

#### Issue 1.2: Triplicated Homepage Value Propositions

- **Route:** `/`
- **Components:** `HeroSection` (serviceLabels), `BenefitStrip`, `TrustSection`
- **File Paths:**
  - [`src/sections/home/HeroSection.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/sections/home/HeroSection.tsx) (lines 10-15)
  - [`src/sections/home/BenefitStrip.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/sections/home/BenefitStrip.tsx) (lines 6-23)
  - [`src/sections/home/TrustSection.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/sections/home/TrustSection.tsx) (lines 6-36)
- **Current Problem:** The user is confronted with three separate 4-item horizontal feature/value strips within 800 vertical pixels:
  - Hero bottom list: Source Files, Documentation, Support, Delivery.
  - BenefitStrip (immediately following Hero): Academic Projects, Flexible Dev, Payment Options, Revisions.
  - TrustSection (immediately following Categories): Complete Deliverables, Revision Policy, Multiple Delivery Modes, Dedicated Support.
- **Screenshot Evidence:** `docs/02-design-system/screenshots/audit/home-desktop-1440.png`
- **Severity:** **MAJOR**
- **Recommended Correction:**
  1. Consolidate into **one quiet, highly credible engineering assurance bar** or distribute the specific points into their natural context (e.g., payment options into the configurator/checkout, revision policy into package selector).
  2. Remove the redundant full-bleed dark `BenefitStrip` that directly competes with the Hero.
- **Reason:** Repeating the same 4 points in 3 different formats screams marketing insecurity and inflates page length without conveying new information.
- **Expected User Benefit:** Streamlined cognitive load, cleaner visual hierarchy, and faster discovery.

---

#### Issue 1.3: Inconsistent Icon Scale and Color Coding

- **Route:** `/`
- **Components:** `SiteHeader`, `HeroSection`, `BenefitStrip`, `HowItWorks`, `TrustSection`
- **Current Problem:** Icons on the homepage have five different arbitrary sizes and disparate stroke/color rules:
  - Header: 20px / 22px (`strokeWidth={1.9}`)
  - Hero services: 18px (`strokeWidth={1.8}`)
  - Benefit strip: 36px (`h-9 w-9 text-copper strokeWidth={1.5}`)
  - How it works: 30px (`h-[30px] w-[30px] strokeWidth={1.5}`)
  - Trust section: 26px (`h-[26px] w-[26px]`, 1 item ink, 3 items copper)
- **Screenshot Evidence:** `docs/02-design-system/screenshots/audit/home-desktop-1440.png`
- **Severity:** **MAJOR**
- **Recommended Correction:** Standardize to Lucide icons with stroke `1.5` at **16px** (dense inline controls/tags) and **20px** (section and card headers), rendered in secondary neutral color (`text-ink-soft` or `text-muted`), reserving accent color for active interactive states.
- **Reason:** Inconsistent icon scaling gives the layout a disjointed, amateur feel.
- **Expected User Benefit:** Visual harmony and predictable visual weight across the interface.

---

#### Issue 1.4: How It Works — Decoupled Chevrons and Floating Numbers

- **Route:** `/`
- **Component:** `HowItWorks`
- **File Path:** [`src/sections/home/HowItWorks.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/sections/home/HowItWorks.tsx)
- **Current Problem:**
  1. Odd dimensions: Step number circle is `h-[31px] w-[31px]`.
  2. Chevrons separating steps are rendered as absolute positioned icons (`top-[6px] right-[30px] hidden lg:block`) that misalign when titles wrap on viewport resizing.
  3. Generic copy: "A Simple & Transparent Process", "From project selection to final delivery...".
- **Screenshot Evidence:** `docs/02-design-system/screenshots/audit/home-desktop-1440.png`, `home-tablet-768.png`
- **Severity:** **MAJOR**
- **Recommended Correction:** Replace the floating circles and absolute chevrons with the **LevUp Assembly Spine**: an authentic, connected engineering milestone line with precise technical node indicators (01 Discovery → 02 Specification → 03 Milestone Escrow → 04 Development & Verification → 05 Deployment & Handover).
- **Reason:** The prompt explicitly specifies: _"Use the LevUp Assembly Spine only where progress genuinely exists: Custom requests, Quotations, Development milestones, Payment installments, Delivery workflows"_.
- **Expected User Benefit:** Clarifies the exact transactional journey with engineering precision.

---

#### Issue 1.5: Category Grid — Card Ratios and Animation Jank

- **Route:** `/`
- **Component:** `CategoryGrid`
- **File Path:** [`src/sections/home/CategoryGrid.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/sections/home/CategoryGrid.tsx)
- **Current Problem:**
  1. Aspect ratio `aspect-[201/101]` is a non-standard ratio.
  2. Card title container has a fixed height `h-[76px]`, leaving empty space on single-line categories.
  3. Bouncy hover scale: `transition-transform duration-500 group-hover:scale-[1.04]`.
  4. Non-standard gap `xl:gap-[22px]` and manual icon offset `mt-3` on the card arrow.
- **Screenshot Evidence:** `docs/02-design-system/screenshots/audit/home-desktop-1440.png`
- **Severity:** **MINOR**
- **Recommended Correction:** Standardize card ratio to 16:9 (`aspect-[16/9]`), remove fixed height in favor of clean padding (`p-4`), replace `scale-[1.04]` with subtle surface/border lightening (`hover:border-ink/20 hover:bg-paper-deep/40`), and align the arrow icon cleanly via flexbox.
- **Reason:** Adheres to Unslop Pass F (Layout) and Pass I (Motion).
- **Expected User Benefit:** Smooth, non-distracting browsing experience without layout shifts.

---

#### Issue 1.6: Custom Project Banner — Diagonal Polygon Clip-Path

- **Route:** `/`
- **Component:** `CustomProjectBanner`
- **File Path:** [`src/sections/home/CustomProjectBanner.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/sections/home/CustomProjectBanner.tsx)
- **Current Problem:**
  1. Uses `lg:[clip-path:polygon(0_0,55.5%_0,45.5%_100%,0_100%)]` to split the text and photograph with an aggressive diagonal slash.
  2. Fixed desktop container height `lg:h-[246px]` and arbitrary padding `lg:pl-[90px]`, `h-[42px] px-[22px]`.
- **Screenshot Evidence:** `docs/02-design-system/screenshots/audit/home-desktop-1440.png`, `home-tablet-768.png`
- **Severity:** **CRITICAL**
- **Recommended Correction:** Remove the diagonal polygon clip-path entirely. Structure as an asymmetric split card with a clean vertical divider or unified technical blueprint frame.
- **Reason:** Diagonal polygon masks are iconic markers of AI-generated landing templates.
- **Expected User Benefit:** Professional industrial appearance that respects responsive content boundaries.

---

### Route 2: Project Catalog & Search (`/projects`)

#### Issue 2.1: Thumbnail Ratio Slicing & Pill Badge Overload

- **Route:** `/projects`
- **Component:** `CatalogProjectCard`
- **File Path:** [`src/components/catalog/CatalogProjectCard.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/components/catalog/CatalogProjectCard.tsx)
- **Current Problem:**
  1. Cards are visually overcrowded: uppercase tracked category, monospace ID, difficulty pill, 3 technology badges, fulfillment grid, complexity progress bar, base price, and shopping cart icon.
  2. Everything uses pill shapes (`rounded-full`), violating nested-radius rules.
  3. In FeaturedProjectCard, the image aspect ratio is an extreme `aspect-[297/107]` (2.77:1), slicing off project hardware.
- **Screenshot Evidence:** `docs/02-design-system/screenshots/audit/catalog-desktop-1440.png`, `home-desktop-1440.png`
- **Severity:** **MAJOR**
- **Recommended Correction:**
  1. Use standard 16:10 or 16:9 photo containers.
  2. Replace `rounded-full` pills with crisp technical tags (`rounded-sm` 4px/6px).
  3. Establish a quiet hierarchy: Category and ID in muted secondary text, high-contrast title, clean hardware/software delivery tag, and honest tabular price.
- **Reason:** Engineering customers need to quickly evaluate technical compatibility (hardware requirements, programming languages, deliverables) without decorative badge clutter.
- **Expected User Benefit:** Scannability and faster project evaluation.

---

### Route 3: Project Detail Page (`/projects/:slug`)

#### Issue 3.1: 3-Column Asymmetric Grid Bottleneck on Laptop

- **Route:** `/projects/ai-smart-irrigation-iot`
- **Component:** `ProjectDetailPage`
- **File Path:** [`src/pages/ProjectDetailPage.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/pages/ProjectDetailPage.tsx)
- **Current Problem:** On 1280px laptops, the 3-column layout (`xl:grid-cols-[minmax(0,38fr)_minmax(0,34fr)_minmax(350px,28fr)]`) cramps the central metadata column and forces awkward vertical stacking.
- **Screenshot Evidence:** `docs/02-design-system/screenshots/audit/project-detail-laptop-1280.png`
- **Severity:** **MAJOR**
- **Recommended Correction:** Rebalance desktop layout into a structured 2-column main grid (Gallery + Specifications on the left at 65% width; sticky Purchase Configurator on the right at 35% width), with Technical Documentation tabs spanning the full content container below.
- **Reason:** Provides generous reading width for technical schematics, BOM lists, and code documentation.
- **Expected User Benefit:** Comfortable, uncrowded technical reading experience.

---

#### Issue 3.2: Configurator Package Radio Selection Background Wash

- **Route:** `/projects/ai-smart-irrigation-iot`
- **Component:** `PackageSelector`
- **File Path:** [`src/components/project-detail/PackageSelector.tsx`](file:///d:/Atharv-Ghandat/LevUp-Market/src/components/project-detail/PackageSelector.tsx)
- **Current Problem:** Active selected package fills the card with an orange tint wash (`bg-copper-tint/40 border-copper`), turning the entire configurator panel into an orange block.
- **Screenshot Evidence:** `docs/02-design-system/screenshots/audit/project-detail-desktop-1440.png`
- **Severity:** **MINOR**
- **Recommended Correction:** Replace the tinted wash with a crisp surface step (clean white or raised neutral) with a 1.5px hairline border and volt radio accent.
- **Reason:** Unslop token rule: _"The active state is a small surface step with a hairline highlight, not a gradient or large wash"_.
- **Expected User Benefit:** Restrained, elegant interface chrome that puts focus on the package specifications.

---

## 3. Brand Tokens & Discrepancies Audit

| Brand Asset / Token                 | Approved Specification        | Current Implementation          | Audit Finding & Action                                                                                                            |
| :---------------------------------- | :---------------------------- | :------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------- |
| **Master Brand SVG Logo**           | Approved isometric block mark | `src/components/brand/Logo.tsx` | **NO CHANGE (100% PRESERVED)**. Geometry, proportions, and facets are approved and will remain completely untouched.              |
| **Primary Neutral / Canvas (60%)**  | **Mineral** (`#F1F2EC`)       | `paper` (`#F7F8F5`)             | **Minor Delta.** `#F1F2EC` provides richer warmth and authenticity. Proposed controlled alignment to Mineral.                     |
| **Primary Deep Dark / Text (30%)**  | **Alloy** (`#203735`)         | `ink` (`#172D38`)               | **Minor Delta.** `#203735` is slightly greener and more industrial. Proposed alignment to Alloy.                                  |
| **Primary Accent / Action (10%)**   | **Volt** (`#E56B3F`)          | `copper` (`#D97736`)            | **Minor Delta.** Volt `#E56B3F` has superior high-energy visibility and meets WCAG AA 4.5:1 with dark text or white on `#B95B21`. |
| **Typography — Display**            | **Manrope Variable**          | `Manrope Variable`              | **MATCH.** Currently installed via `@fontsource-variable/manrope`.                                                                |
| **Typography — Body / Interface**   | **IBM Plex Sans**             | `Inter Variable`                | **DISCREPANCY.** Current project uses Inter; approved brand specification requires IBM Plex Sans for technical character.         |
| **Typography — Technical Metadata** | **IBM Plex Mono**             | System monospace                | **DISCREPANCY.** Current project uses fallback mono; approved spec requires IBM Plex Mono for figures, IDs, and specs.            |

---

## 4. Components Classified as "NO CHANGE"

In accordance with strict preservation requirements, the following components and subsystems will **remain unchanged**:

1. **Master Brand Mark (`LogoMark` in `Logo.tsx`):** Unaltered SVG paths, fills, and viewBox.
2. **Catalog Filtering & Sorting Logic (`catalog-state.ts`):** 100% preserved in-memory filter, search debouncing, and pagination math.
3. **Cart Context & Calculations (`cart.tsx`):** In-memory cart provider, pricing accumulation, and item dispatch.
4. **Package & Add-On Selection State (`PurchaseConfigurator.tsx`):** Eligibility filtering and add-on pricing engine.
5. **Logging & Telemetry Architecture (`logger.ts`):** Partitioned UTC filesystem logging, redaction, and audit trail.
6. **Application Routes (`routes.ts`, `App.tsx`):** Client routing and base path resolution.
