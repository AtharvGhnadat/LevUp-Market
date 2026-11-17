# Payment Lifecycle Specification — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. State Machine: Order & Payment Status

```mermaid
stateDiagram-v2
    [*] --> DRAFT : User adds items to cart
    DRAFT --> PENDING_PAYMENT : Checkout initiated, order created
    PENDING_PAYMENT --> PAID : Webhook verifies PAYMENT_SUCCESS
    PENDING_PAYMENT --> FAILED : Payment fails / window expires
    FAILED --> PENDING_PAYMENT : User retries payment
    PAID --> IN_PROGRESS : Engineering work starts (Custom / Built-on-order)
    PAID --> DELIVERED : Digital assets entitled immediately (Ready-made)
    IN_PROGRESS --> QA_REVIEW : Prototype complete
    QA_REVIEW --> SHIPPED : Physical kit in transit
    SHIPPED --> DELIVERED : Hardware kit received
    PAID --> REFUNDED : Authorized refund approved
```

---

## 2. Terminal vs. Non-Terminal States

- `DRAFT`: Ephemeral, client-side only.
- `PENDING_PAYMENT`: Valid for 30 minutes from creation.
- `PAID`: Irreversible state transition upon verified cryptographic webhook. Unlocks deliverable entitlements.
- `REFUNDED`: Terminal financial state. Revokes deliverable access.
