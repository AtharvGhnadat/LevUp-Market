# Changelog

All notable changes to LevUp Projects are documented here.

Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)  
Versioning: [Semantic Versioning](https://semver.org/spec/v2.0.0.html)

> [!NOTE]
> This project is in pre-release. No version has been tagged. Entries in **[Unreleased]** accumulate until a tagged release is verified.

---

## [Unreleased]

- Sign In and Create Account share a compact form and an illustrated engineering workspace. The drawing and sample file list are explicitly labelled as a preview. [Browser evidence](docs/07-testing/CUSTOMER_WORKSPACE_REBUILD.md#sign-in-and-create-account)

### Added

- A customer workspace for orders, project packages, engineering briefs, support tickets and staff replies. Students can save optional academic details, private hardware delivery addresses and preferred project categories. The workspace migration enforces ownership and limits customer writes to the fields each workflow needs.
- Public project guidance, customer FAQs and an About page, reachable from the header and drawer.
- Customer account access through Supabase Auth with email and password, email confirmation, password recovery, and protected account settings. The header and mobile drawer show actions for the verified session, and password sign-in preserves the browser cart.

### Changed

- The header now shares the same search and cart layout before and after sign-in. The verified account adds a reply indicator and grouped account links. Sign-in and signup pair task-specific introductions with responsive form cards and an optional remembered email on sign-in, and protected links return customers to the requested page. [Implementation and browser evidence](docs/07-testing/CUSTOMER_WORKSPACE_REBUILD.md)
- Reworked public navigation around project search and category discovery. The header now links to the working custom development form and homepage process section, and the compact layout keeps the live cart visible without clipping at narrow widths.

### Security & Remediation (`2026-11-18` — Codex Review Findings Remediation)

- **Cashfree Server Enablement Gate (S1):** Introduced explicit `CASHFREE_PAYMENTS_ENABLED` server-side control (defaulting to `false`); payment creation and verification fail closed with HTTP 503 and zero upstream network requests when disabled.
- **Authoritative Catalog Pricing & Input Validation (S2):** Implemented server-side catalog price resolution and client price validation in `src/server/cashfree.ts`; rejects price tampering attempts, invalid items, and empty carts. Added bounded validation for customer name, RFC email, and phone.
- **Safe Response Allowlisting (S3):** Sanitized verification response to return strictly allowlisted fields (`order_id`, `order_status`, `order_amount`, `order_currency`, `payment_time`), stripping provider diagnostics, PII, and bank account metadata. Enforced strict alphanumeric regex validation on order IDs.
- **Idempotency Readiness (S4):** Added `idempotencyKey` caching in order creation service to eliminate duplicate payment sessions on retry.
- **Diagnostic Error Redaction (S5):** Replaced raw provider error text and dynamic log interpolation with sanitized, correlation-indexed generic error messages.
- **Database RLS & Privileges Hardening (S6, S7):** Added `supabase/migrations/20261118000002_security_hardening.sql`: parameterless `public.is_admin()` bound strictly to caller `auth.uid()`, constrained order and order item creation to `draft` and `pending_payment` states, and restricted client audit logging to permitted action enumerations.
- **Supabase Clean-Environment Initialization (A1):** Eliminated eager module-level client instantiation in `src/lib/supabase.ts` and `src/server/supabase-admin.ts`; implemented lazy getters and transparent fail-closed proxies with zero unhandled exceptions on import in clean CI environments. Added synthetic test fixtures and unconfigured failure assertions.
- **Line Ending & Formatting Stabilization (Q1):** Configured `.gitattributes` (`* text=auto eol=lf`) and `.prettierrc` (`endOfLine: "auto"`), eliminating 87 spurious Windows CRLF format failures while maintaining 100% first-party code formatting coverage.
- **CI Workflow Stabilization (Q2):** Updated `.github/workflows/ci.yml` to trigger on `design/**` branch pushes, stacked base PR targets, and added a dedicated Playwright Chromium E2E job.
- **Requisition Experience & Focus Accessibility (A2, A4, A6):** Added programmatic focus shifting in `CustomProjectPage.tsx` across edit, review, and confirmation phases; implemented 7-day TTL and shape validation on local drafts; prevented silent prefill draft overwrites; added strict category, budget, date, and 10-digit phone validation.
- **Safe Route Decoding (A3):** Guarded `decodeURIComponent` in `src/App.tsx` detail route matching against malformed URI strings; restricted return route matching to exact `/checkout/return`; updated client return URL to respect base path deployment.
- **Prototype Reality Labeling (A5):** Replaced browser alerts with accessible status notices and explicit prototype labels on `CheckoutReturnPage.tsx`.
- **Status Hold:** Cashfree merchant sandbox credential rotation remains **PENDING / NOT YET CONFIRMED**.

### Security

- **Cashfree Credential Remediation (`2026-11-18`):** Removed hardcoded sandbox App ID and Client Secret fallbacks from `src/server/cashfree.ts`, enforced fail-closed server environment variable validation (`CASHFREE_APP_ID`, `CASHFREE_CLIENT_SECRET`), rejected placeholder values, and added synthetic-credential & missing-credential unit tests in `src/server/cashfree.test.ts`
- **Local Git History Cleanup:** Rewrote unpublished local commits `2895c12`..`ad7a4ad` into cleaned replacements `d48a990`..`7ddb92a` with zero changes to Stage 2, Supabase, Stage 3, or Stage E application code; preserved `main`, `origin/design/unslop-foundation` (`cc020b2`), and PR #1 untouched
- **Blocker Retained:** Exposed Cashfree sandbox credential rotation is marked **PENDING / NOT YET CONFIRMED**; live or sandbox payment activation remains blocked until merchant-dashboard rotation is independently confirmed

### Added

- Stage E Custom Project Requisition Experience (`src/pages/CustomProjectPage.tsx`, `src/custom-project/custom-project-state.ts`): Interactive engineering requisition workflow covering scope & classification (software, hardware, hybrid), detailed functional & conditional hardware specifications, budget range, target delivery date, staged reference file attachments, classification-aware deliverables, local draft preservation, review step, and honest frontend prototype confirmation with JSON specification export
- Stage E Test Coverage: Added unit tests (`src/custom-project/custom-project-state.test.ts`), Playwright E2E tests (`e2e/custom-project.spec.ts`), and responsive capture script (`scripts/capture-stage-e.mjs`)
- Cashfree Payment Gateway Integration: Installed `@cashfreepayments/cashfree-js` v1.0.7 for modal checkout
- Server-side Cashfree API Service (`src/server/cashfree.ts`): Order creation and verification handlers with merchant credentials
- Client Cashfree SDK Service (`src/lib/cashfree.ts`): SDK loader, order launcher, and verification utilities
- Dedicated Checkout Experience (`src/pages/CheckoutPage.tsx`): Student billing form, order breakdown, and Cashfree payment trigger
- Return URL Handler (`src/pages/CheckoutReturnPage.tsx`): Automated payment status verification, receipt display, and simulated prototype deliverable download actions (live file delivery reserved for student dashboard in future stage)
- Cart Page (`src/pages/CartPage.tsx`): Interactive shopping cart management with direct checkout transition
- Design branch `design/unslop-foundation` for professional Unslop design transformation
- Unslop Visual Audit Report `docs/02-design-system/UNSLOP_AUDIT.md` and Design Direction `docs/02-design-system/DESIGN_DIRECTION.md`
- Typography packages `@fontsource/ibm-plex-sans` and `@fontsource/ibm-plex-mono` for interface text and technical metadata
- Programmatic WCAG 2.1 contrast verification script `scripts/verify-contrast.mjs`
- Automated multi-viewport screenshot and overflow verification script `scripts/capture-stage1-screenshots.mjs`
- Engineering governance foundation branch `chore/production-engineering-foundation`
- Foundation Audit Report `FOUNDATION_AUDIT_REPORT.md` verifying system status, tools, tests, and readiness
- Complete `docs/` system covering all 11 governance dimensions:
  - `docs/00-product/`: PRD record (marking original as missing from repo), SCOPE, FEATURE_INVENTORY, REQUIREMENTS_TRACEABILITY, USER_JOURNEYS, ACCEPTANCE_CRITERIA
  - `docs/01-architecture/`: EXISTING_SYSTEM_ASSESSMENT, ARCHITECTURE, TECH_STACK, SYSTEM_CONTEXT, FRONTEND_ARCHITECTURE, BACKEND_ARCHITECTURE, INTEGRATIONS, SCALABILITY, DEPLOYMENT_ARCHITECTURE, ADR-0001
  - `docs/02-design-system/`: BRAND_GUIDELINES, COLOR_TOKENS, TYPOGRAPHY, COMPONENTS, RESPONSIVE_LAYOUTS, ACCESSIBILITY, DESIGN_CHANGELOG
  - `docs/03-database/`: SCHEMA (PostgreSQL DDL), DATA_DICTIONARY, RELATIONSHIPS, MIGRATION_POLICY, RLS_AND_PERMISSIONS
  - `docs/04-api/`: openapi.yaml, API_CONVENTIONS, ERROR_HANDLING, WEBHOOK_CONTRACTS
  - `docs/05-security/`: THREAT_MODEL (STRIDE), AUTHENTICATION, AUTHORIZATION, SECRET_MANAGEMENT, SECURITY_TESTING
  - `docs/06-payments/`: CASHFREE_INTEGRATION, PAYMENT_LIFECYCLE, PAYMENT_SCHEDULES, REFUND_POLICY_IMPLEMENTATION, RECONCILIATION
  - `docs/07-testing/`: TEST_STRATEGY, TEST_CASES, E2E_TEST_CASES, COVERAGE_POLICY
  - `docs/08-operations/`: LOGGING_STANDARD, AUDIT_POLICY, OBSERVABILITY, BACKUP_RECOVERY, INCIDENT_RESPONSE, DEPLOYMENT_RUNBOOK, LOG_RETENTION
  - `docs/09-development/`: DEVELOPER_SETUP, CODING_STANDARDS, BRANCHING, CHANGE_CONTROL, LOCAL_ENVIRONMENT
  - `docs/10-releases/`: RELEASE_CHECKLIST, RELEASE_NOTES_TEMPLATE, ROLLBACK_PROCESS, DEPLOYMENT_HISTORY
- Structured application logger `src/lib/logger.ts` implementing UTC hourly partitioning (`logs/{env}/{category}/{YYYY}/{MM}/{DD}/{HH}/events.jsonl`), Node.js local file transport, and recursive credential redaction
- Testing framework: Vitest 5, React Testing Library 16, jsdom, and `@testing-library/jest-dom`
- 26 unit tests across 5 test suites (`format`, `cn`, `logger`, `catalog-state`, `cart`) passing 100%
- Playwright E2E framework and end-to-end test suite (`e2e/catalog.spec.ts`) passing 100%
- Developer quality tooling: ESLint 10, Prettier 3, Husky 9, lint-staged 17, and Commitlint 21
- CI configuration in `.github/workflows/ci.yml` running lint, format check, typecheck, unit tests, and production build
- Pull request review template `.github/pull_request_template.md`
- Root governance: `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `VERSIONING.md`, `ARCHITECTURE_VERSION.md`, `.env.example`, `.gitignore`

### Changed

- Stage 3 Full-Application Unslop Transformation (Passes A–I): Applied Damir Sokolovsky's Unslop methodology (CC BY 4.0) across shared primitives, navigation, homepage, catalog, project details, cart, and checkout flows
- Assembly Spine Process Visualization (`HowItWorks.tsx`): Upgraded ready-made and custom development journeys with continuous hairline Assembly Spine progression rails and numbered caliper steps
- Quiet Navigation Chrome (`SiteHeader.tsx`, `NavDropdown.tsx`, `HeaderSearch.tsx`, `SiteFooter.tsx`): Simplified `Sign In` to a quiet text link alongside `Get Started`, standardized icons to 1.75 stroke, converted uppercase tracked headers to sentence case, and removed italic low-contrast footer text
- WCAG Contrast & Type Discipline: Reduced ultra-heavy `font-extrabold` headings to `font-semibold` (400–600 weight ceiling), replaced inaccessible raw Volt text/prices on light surfaces with accessible `VoltText` (`#A44E1A`, 5.06:1 AA), removed `Sparkles` decorative icons, and fixed `ProjectDetailPage` diagram clipping and share button sizing
- Stage 2 Homepage Refinement: Aligned homepage structure, header, footer, process flows, and benefit assurances directly with the approved reference image and Unslop design direction
- Dual-Journey How It Works: Implemented distinct customer flows for ready-made projects (`Explore Projects` → `Choose Package` → `Secure Checkout` → `Receive Delivery`) and custom development (`Submit Requirements` → `Review Quotation` → `Track Development` → `Receive Project`)
- Restrained Benefit Assurances: Updated benefit strip to approved labels (`Source Code & Documentation`, `Digital & Hardware Delivery`, `Technical Support & Revisions`, `Student Friendly`) with package-dependent deliverable descriptions
- Header & Footer Parity: Added `Sign In` and `Get Started` actions to header, and added social icons and 4-column structure to footer with _"Made for Engineers, by Engineers"_ signature
- Overflow Prevention: Eliminated 1280px viewport overflow, guaranteeing 0px horizontal scroll at 1440px, 1280px, 768px, and 390px viewports
- Stage 2 Homepage Refactoring: Transformed homepage layout, hero composition, category grid, featured projects, how-it-works process, and custom banner to match the approved Unslop reference mockup
- Hero Section: Replaced diagonal clip-path wedge, copper slash gradient, and hand-drawn underline with authentic workshop showcase, floating project badges, and clean display typography
- Value Assurance Strip: Consolidated duplicate marketing strips into one clear 4-pillar marketplace metric strip (`500+ Projects`, `Engineering Focus`, `End-to-End Support`, `Student Friendly`)
- How It Works: Implemented 4-step transparent delivery sequence (`Choose or Request`, `Plan & Quote`, `Development`, `Deliver & Support`)
- Category Grid: Converted into a compact 7-tile scannable layout directly linking to active catalog domains
- Featured Projects: Normalized into 4-column commerce cards with real catalog items, prices in paise/INR, category pill badges, and detail actions
- Custom Project Banner: Refactored into a high-contrast Alloy callout with milestone progress pillars and direct custom project CTA
- Stage 1 Design Tokens: Implemented Mineral (`#F1F2EC`), Alloy (`#203735`), Volt (`#E56B3F`), and accessible variants VoltAction (`#B95B21`) and VoltText (`#A44E1A`) in `src/index.css`
- Navigation & Chrome: Refined `SiteHeader.tsx`, `SiteFooter.tsx`, `NavDropdown.tsx`, and `HeaderSearch.tsx` to align with 4px spacing, nested radii, and accessible contrast
- Button Primitive: Standardized `src/components/ui/Button.tsx` with 8px radius, touch-target sizing (`sm`, `md`, `lg`), and active press micro-interaction
- `package.json`: Configured `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `test`, `test:watch`, `test:coverage`, `test:e2e`, and `prepare` scripts
- Standardized formatting across all source files and markdown documents using Prettier

---

## Pre-history

| Date       | Commit    | Description                                               |
| ---------- | --------- | --------------------------------------------------------- |
| 2026-11-17 | `78b2142` | Add files from Figma Make — full Figma-generated frontend |
| 2026-11-17 | `90020e2` | Initial commit — empty repository scaffold                |
