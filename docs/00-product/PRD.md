# Product Requirements Document (PRD) — LevUp Projects

**Document Status:** Baseline / PRD Status Record  
**Product Name:** LevUp Projects (formerly referenced historically in legacy specs as ProjectForge)  
**Authoritative Source Assessment:** Missing from Repository  
**Document Date:** 2026-11-17  

---

## 1. Authoritative Source Disclosure

> [!IMPORTANT]
> The formal standalone PRD document (`MASTER_PRD.md`) was **absent from the repository** upon cloning from GitHub (`https://github.com/AtharvGhnadat/LevUp-Market.git`).
> In accordance with Engineering Governance instructions, this document explicitly records the PRD as **missing from the repository**. It does NOT fabricate a synthetic PRD pretending to be the historical original.
> 
> The requirements captured below are derived strictly from:
> 1. The Master Repository Migration and Engineering Governance Specification
> 2. The approved visual Figma Make implementation and codebase artifacts
> 3. Route, metadata, and state contracts embedded in `src/data/`, `src/pages/`, `src/components/`, and `src/state/`

---

## 2. Product Vision and Core Value Proposition

**LevUp Projects** is an engineering marketplace and project development platform designed primarily for engineering students, researchers, and technical builders in India. 

The platform offers two primary business offerings:
1. **Ready-made & Built-on-Order Engineering Project Kits**: Complete, documented kits across Software, AI/ML, IoT, Embedded Systems, Robotics, and Simulation. Delivered as digital assets (source code, schematics, reports, presentation slides) or hybrid packages with physical hardware kits.
2. **Custom Project Build Requests**: Tailored engineering solutions with milestone-based payment schedules, verified technical specifications, fixed quotations, tracked delivery, and post-delivery revision entitlements.

---

## 3. User Roles (V1 Target)

The V1 system defines exactly two user roles:

| Role | Description | Access Boundary |
|---|---|---|
| `STUDENT` / Customer | Engineering students or individual buyers | Public catalog, cart, checkout, customer dashboard (orders, custom requests, files, revisions, support) |
| `ADMIN` | Internal LevUp operations, engineers, and administrators | Admin portal (catalog management, quotations, production tracking, QA approvals, deliverables, payments, refunds, audits) |

> [!NOTE]
> `/admin-login` is publicly discoverable but is **never** itself a security mechanism. Admin access strictly enforces server-side identity verification, an explicit email/user ID allowlist, and Multi-Factor Authentication (MFA).

---

## 4. Platform Scope

### 4.1 In Scope for V1 (Complete Web Application)
- **Public Marketplace**: Storefront, catalog with multi-dimensional filtering, project details, package selection, add-on configuration, custom project intake form, cart, checkout, auth screens, static policy and informational pages.
- **Customer Dashboard**: Student profile, active orders, custom request tracking, quotation review, milestone progress, secure authenticated file delivery, revision management, and support tickets.
- **Admin Operations Portal**: Project catalog management, quotation review & issuance, order milestone updates, deliverable upload & QA verification, payment & refund reconciliation, audit trail.
- **Backend & Infrastructure**: Supabase PostgreSQL database, Supabase Auth, Supabase Storage, Cashfree payment gateway integration (server-side only), structured application logging.

### 4.2 Out of Scope for V1
- Mobile application (Android / iOS) — designated as **V2** milestone.
- Public multi-vendor marketplace (third-party sellers uploading unvetted projects). All projects are curated or built directly by LevUp.
- Direct live payment gateway in frontend without server-side verification.
