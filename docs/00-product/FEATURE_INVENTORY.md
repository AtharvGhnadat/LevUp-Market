# Feature Inventory — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Public Marketplace Storefront

| Feature ID | Feature Name | Status | Component / Location | Evidence / Verification |
|---|---|---|---|---|
| `FEAT-MKT-01` | Brand Header & Global Navigation | ✅ Implemented (Visual) | `src/components/layout/SiteHeader.tsx` | Sticky nav, dropdowns, cart badge, search toggle |
| `FEAT-MKT-02` | Desktop & Mobile Navigation Drawers | ✅ Implemented (Visual) | `src/components/layout/MobileMenu.tsx`, `NavDropdown.tsx` | Slide-out mobile drawer, accessible click-outside |
| `FEAT-MKT-03` | Storefront Hero & Value Proposition | ✅ Implemented (Visual) | `src/sections/home/HeroSection.tsx` | 2 CTA buttons, metric highlights, badge |
| `FEAT-MKT-04` | Engineering Domains Category Grid | ✅ Implemented (Visual) | `src/sections/home/CategoryGrid.tsx` | 6 category tiles with Unsplash imagery |
| `FEAT-MKT-05` | Featured Projects Showcase | ✅ Implemented (Visual) | `src/sections/home/FeaturedProjects.tsx` | Top 4 catalog items with pricing and tags |
| `FEAT-MKT-06` | Custom Build Banner & Process Strip | ✅ Implemented (Visual) | `src/sections/home/CustomProjectBanner.tsx`, `HowItWorks.tsx` | 4-step workflow, direct links to forms |
| `FEAT-MKT-07` | Catalog Multi-Dimensional Filtering | ✅ Implemented (Client) | `src/catalog/catalog-state.ts`, `CatalogFilterPanel.tsx` | 9 filter dimensions, URL param sync |
| `FEAT-MKT-08` | Catalog Sorting & View Toggle | ✅ Implemented (Client) | `src/pages/ProjectsPage.tsx` | Sort by price/rank/date, grid vs. list view |
| `FEAT-MKT-09` | Catalog Search & Modal Dialogue | ✅ Implemented (Client) | `src/components/layout/HeaderSearch.tsx`, `SearchDialog.tsx` | Live filter matching against static items |
| `FEAT-MKT-10` | Project Detail Gallery & Media View | ✅ Implemented (Visual) | `src/components/project-detail/ProjectGallery.tsx` | Main image + thumbnails, focus handling |
| `FEAT-MKT-11` | Tier Package Selector (Basic/Std/Prem)| ✅ Implemented (Visual) | `src/components/project-detail/PackageSelector.tsx` | Deliverable comparison, free revision badges |
| `FEAT-MKT-12` | Add-On Configurator & Hardware Check | ✅ Implemented (Visual) | `src/components/project-detail/AddOnConfigurator.tsx` | Toggle add-ons, recalculate price snapshot |
| `FEAT-MKT-13` | Engineering Block Diagram | ✅ Implemented (Visual) | `src/components/project-detail/EngineeringBlockDiagram.tsx` | Inputs → Controller → Process → Outputs layout |
| `FEAT-MKT-14` | Client-Side Shopping Cart Preview | ⚠️ Implemented (Mocked) | `src/state/cart.tsx` | In-memory & localStorage only. No server checkout. |
| `FEAT-MKT-15` | Planned Route Placeholder Pages | ✅ Implemented (Visual) | `src/pages/PlannedRoutePage.tsx` | Honest "not built yet" status for unbuilt routes |
| `FEAT-MKT-16` | Server-Side Cart & Pricing Validation| ❌ Unimplemented | Target: Next.js API / Supabase | Required for financial safety |
| `FEAT-MKT-17` | Cashfree Hosted Checkout Flow | ❌ Unimplemented | Target: Next.js API + Cashfree SDK | Orders pending payment creation |
| `FEAT-MKT-18` | Custom Project Request Intake Form | ❌ Unimplemented (Placeholder) | Target: `/custom-project` | Needs validation, file attachment, Supabase insert |

---

## 2. Customer Dashboard

| Feature ID | Feature Name | Status | Location / Target | Description |
|---|---|---|---|---|
| `FEAT-DSH-01` | Customer Authentication (OTP / Email)| ❌ Unimplemented | Target: `/login`, Supabase Auth | Sign in / register for students |
| `FEAT-DSH-02` | Order History & Milestone Tracking | ❌ Unimplemented | Target: `/dashboard/orders` | View purchased kits and milestone status |
| `FEAT-DSH-03` | Authenticated File Delivery & Downloads| ❌ Unimplemented | Target: `/dashboard/deliverables` | Signed URLs from private Supabase Storage |
| `FEAT-DSH-04` | Revision Request Submission | ❌ Unimplemented | Target: `/dashboard/revisions` | Submit revision requests against entitlement |
| `FEAT-DSH-05` | Custom Project Quotations & Approvals | ❌ Unimplemented | Target: `/dashboard/quotes` | Review quote, accept terms, pay advance |
| `FEAT-DSH-06` | Physical Shipment Tracking (AWB) | ❌ Unimplemented | Target: `/dashboard/shipping` | Tracking number, courier partner details |

---

## 3. Admin Portal

| Feature ID | Feature Name | Status | Location / Target | Description |
|---|---|---|---|---|
| `FEAT-ADM-01` | Staff Allowlist & MFA Login | ❌ Unimplemented | Target: `/admin-login` | Server-enforced role authorization |
| `FEAT-ADM-02` | Catalog & Package Pricing Management | ❌ Unimplemented | Target: `/admin/catalog` | CRUD operations on projects, packages, add-ons |
| `FEAT-ADM-03` | Custom Request & Quote Builder | ❌ Unimplemented | Target: `/admin/quotes` | Build milestone pricing and deliverable scope |
| `FEAT-ADM-04` | Order Production & QA Sign-off | ❌ Unimplemented | Target: `/admin/orders` | Advance pipeline states, verify QA checks |
| `FEAT-ADM-05` | Secure Deliverable File Upload | ❌ Unimplemented | Target: `/admin/storage` | Upload tested ZIP/PDF packages to private buckets |
| `FEAT-ADM-06` | Cashfree Payment & Refund Reconciler | ❌ Unimplemented | Target: `/admin/payments` | Process refunds, inspect webhook events |
| `FEAT-ADM-07` | Immutable Audit Event Log | ❌ Unimplemented | Target: `/admin/audit` | View all privileged system activities |
