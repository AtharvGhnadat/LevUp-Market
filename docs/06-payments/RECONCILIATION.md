# Financial Reconciliation & Audit — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Daily Reconciliation Workflow

At 02:00 UTC daily, an automated reconciliation job compares:

1. `orders` marked as `PAID` in Supabase PostgreSQL.
2. `payment_events` records ingested via webhooks.
3. Cashfree Settlement Settlement Reports fetched via Cashfree Reconciliation API.

---

## 2. Discrepancy Classification & Resolution

| Discrepancy Type         | Root Cause                                                | Automated Action                                                            | Admin Alert               |
| ------------------------ | --------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------- |
| **Ghost Payment**        | Customer paid at bank, but webhook was dropped or delayed | Polling job queries Cashfree `GET /pg/orders/{order_id}` and recovers state | Info log; auto-resolved   |
| **Orphaned Webhook**     | Webhook received for non-existent order ID                | Stored in `payment_events` with `order_id = NULL`                           | High-priority admin alert |
| **Amount Mismatch**      | Paid amount does not equal `orders.total_paise`           | Order marked `PAYMENT_DISCREPANCY`; fulfillment blocked                     | Critical finance alert    |
| **Chargeback / Dispute** | Customer initiated chargeback through issuing bank        | Entitlement revoked; order flagged `DISPUTE`                                | Superadmin alert          |
