# Product Requirements Document (PRD) — LevUp Projects

> [!WARNING]
> **DOCUMENT CLASSIFICATION: PROVISIONAL RECONCILIATION RECORD**  
> **Status:** Unverified Baseline / Blocking Dependency Pending Original Document  
> **Authoritative Source:** NOT FOUND IN REPOSITORY OR LOCAL ENVIRONMENT  
> **Date:** 2026-11-17

---

## 1. Authoritative Source Reconciliation & Blocking Dependency

During Phase 0 and Foundation Audit inspection, the canonical approved **ProjectForge / LevUp Website V1 Master PRD** (`MASTER_PRD.md`) was **not found** in the repository or local disk.

In accordance with Master Repository Governance instructions:

1. **This document is strictly PROVISIONAL.** It must NOT be treated as the authoritative product specification.
2. Requirements captured here are derived solely from:
   - The master governance instructions.
   - Code-level route declarations, types, and mock data in `src/`.
   - Figma Make layout structures and copywriting.
3. **Reconciliation Status: BLOCKED.** Full reconciliation of feature scope, package tiers, pricing formulas, and student revision terms cannot be certified until the original approved Master PRD is supplied to the project.
4. Developers and stakeholders must not invent requirements or treat provisional specs as approved business commitments.

---

## 2. Product Identity (Provisional Summary)

- **Public Brand Name**: **LevUp Projects**
- **Brand Subtitle**: Engineering Projects & Development
- **Historical Working Title**: "ProjectForge" (internal prototype name found in legacy references; deprecated from all user-facing material).
- **Core Offering**:
  1. Off-the-shelf and built-on-order engineering kits (Software, AI/ML, IoT, Embedded Systems, Robotics, Simulation).
  2. Custom engineering project build requests with milestone financing.
  3. Digital deliverable package (Source code, Circuit schematics/Gerbers, Technical documentation, Presentation slides).
  4. Physical fulfillment (Microcontroller prototypes, sensor arrays, custom 3D printed enclosures).

---

## 3. Provisional Role & Permission Model

| Role      | Access Scope                                                                                                                                 | Provisional Constraints                                                                                               |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `STUDENT` | Storefront, cart, checkout, dashboard (orders, custom requests, revision tickets, file downloads)                                            | Strict data isolation; access only to owned orders & signed deliverables.                                             |
| `ADMIN`   | Admin portal (`/admin/*`), catalog management, quotation builder, order tracking, QA approval, deliverable staging, financial reconciliation | Strict server-side allowlist (`admin_users`) + MFA required. Hidden route `/admin-login` is NOT a security perimeter. |

---

## 4. Provisional Feature Inventory & Alignment

| Domain   | Provisional Requirement                         | Source / Evidence                                           | Verification Status                                                    |
| -------- | ----------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------- |
| Catalog  | 6 Engineering categories                        | `src/data/categories.ts`                                    | Aligned with Figma UI                                                  |
| Catalog  | 12 Initial Demonstration Projects               | `src/data/catalog-projects.ts`                              | 12 projects present; prices in integer paise                           |
| Detail   | 3-Tier Packages (Basic, Standard, Premium)      | `src/data/project-details.ts`                               | Detailed data present for 2/12 projects; 10/12 require data completion |
| Detail   | Interactive Engineering Block Diagram           | `src/components/project-detail/EngineeringBlockDiagram.tsx` | Visual component implemented                                           |
| Checkout | Server-side validated pricing                   | Governance requirement                                      | ⚠️ Mocked in client localStorage; needs Next.js API                    |
| Payments | Cashfree Hosted Checkout + Webhook verification | Governance requirement                                      | ⚠️ Not implemented                                                     |
| Delivery | Private deliverable storage with signed URLs    | Governance requirement                                      | ⚠️ Not implemented                                                     |

---

## 5. Next Steps for PRD Reconciliation

1. Request the original `MASTER_PRD.md` file from product ownership.
2. Diff provisional requirements against the official specification.
3. Update `docs/00-product/REQUIREMENTS_TRACEABILITY.md` and `docs/00-product/FEATURE_INVENTORY.md` to reflect certified requirements.
