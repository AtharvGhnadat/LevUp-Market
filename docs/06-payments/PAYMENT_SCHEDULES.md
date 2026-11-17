# Payment Schedules & Milestone Financing — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Milestone Payment Structure (Custom Projects)

For custom engineering builds and complex hardware projects, payments are divided into structured milestones rather than a single upfront charge:

| Milestone | Stage | Percentage | Trigger Event | Deliverable Unlocked |
|---|---|---|---|---|
| **Milestone 1 (Advance)** | Project Initiation | **50%** | Quotation acceptance | Component sourcing, schematic design, architecture spec |
| **Milestone 2 (Completion)** | Final Handover | **50%** | Working prototype video approval | Source code, final reports, hardware dispatch |

---

## 2. Order Splitting & Installment Tracking

Each milestone is tracked as a distinct installment record linked to the master order:
```sql
CREATE TABLE public.order_installments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id),
    milestone_number INT NOT NULL,
    amount_paise INT NOT NULL,
    status payment_status_enum NOT NULL DEFAULT 'initiated',
    cashfree_order_id TEXT UNIQUE,
    due_date DATE,
    paid_at TIMESTAMPTZ
);
```
Milestone 2 payment must be successfully verified before physical package dispatch or full digital delivery unlocking.
