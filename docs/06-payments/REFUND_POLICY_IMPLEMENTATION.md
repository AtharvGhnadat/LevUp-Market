# Refund Policy Implementation & Workflow — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Business Eligibility Rules

- **Ready-Made Digital Kits**: Due to the immediate delivery of unencrypted source code, digital kits are **non-refundable** once downloaded, except in cases of verified technical defects unresolved within the revision window.
- **Built-on-Order / Custom Projects**: If cancelled prior to component procurement (within 24 hours of Milestone 1), a refund minus a 10% administrative fee is issued. Once procurement or custom soldering begins, component costs are non-refundable.
- **Hardware Defect / Shipping Damage**: Eligible for free replacement or refund upon return verification within 7 days of delivery.

---

## 2. Technical Refund Execution

1. Admin initiates refund request in Admin Portal (`POST /api/admin/payments/refund`).
2. Server validates authorization (Superadmin role required).
3. Server invokes Cashfree Refund API (`POST /pg/orders/{order_id}/refunds`):
   - `refund_amount`: Integer paise to refund.
   - `refund_id`: Unique `ref_lp_<uuid>`.
   - `refund_note`: Reason for audit log.
4. Server updates `payment_events` with refund status.
5. Upon confirmation, `deliverable_entitlements` are revoked (`is_active = false`).
