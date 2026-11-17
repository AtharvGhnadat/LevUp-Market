# Operational Audit Policy — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Audited Events

The following administrative, financial, and access events must be recorded in the append-only `public.audit_logs` PostgreSQL table:

- **Admin Authentication**: Every login, failed attempt, or session revocation for staff users.
- **Catalog Price Changes**: Alteration of project base prices, package pricing, or add-on costs.
- **Quotation Issuance**: Creation, amendment, or discounting of custom project quotes.
- **Deliverable File Staging**: Upload, replacement, or deletion of project archive files.
- **Manual Order Status Mutations**: Overriding order state (e.g. marking paid manually).
- **Refund Approvals**: Processing refunds with rationale and authorized actor ID.

---

## 2. Immutability & Access

- Audit records cannot be modified or deleted via the application API (`UPDATE` and `DELETE` queries denied by RLS).
- Retained permanently for business tax and compliance verification.
