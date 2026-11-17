# Cashfree Payment Gateway Integration — LevUp Projects

**Document Status:** Baseline  
**Gateway Partner:** Cashfree Payments India  
**Last Updated:** 2026-11-17  

---

## 1. Integration Model: Hosted Checkout + Server-Side Verification

LevUp Projects employs Cashfree's **Hosted Checkout** flow to ensure sensitive cardholder and banking data never traverses LevUp servers.

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant NextClient as Next.js Client
    participant NextServer as Next.js API
    participant Cashfree as Cashfree PG
    participant DB as PostgreSQL

    Student->>NextClient: Clicks "Proceed to Payment"
    NextClient->>NextServer: POST /api/payments/cashfree/create-order
    NextServer->>DB: Validates price in paise, writes order record
    NextServer->>Cashfree: POST /pg/orders (AppId, Secret in headers)
    Cashfree-->>NextServer: Returns { payment_session_id, order_id }
    NextServer-->>NextClient: Returns payment_session_id
    NextClient->>Cashfree: Loads Cashfree JS SDK & opens hosted checkout modal
    Student->>Cashfree: Pays via UPI / NetBanking / Card
    Cashfree-->>NextClient: Redirects to return_url?order_id=...
    Cashfree->>NextServer: POST /api/webhooks/cashfree (Signature in header)
    NextServer->>NextServer: Validates HMAC-SHA256 signature
    NextServer->>DB: Records payment_events, marks order PAID, unlocks files
    NextClient->>NextServer: GET /api/orders/:id (Polling / Refresh)
    NextServer-->>NextClient: Returns status: "paid"
```

---

## 2. API Credentials & Sandboxing

- **Development Sandbox URL**: `https://sandbox.cashfree.com/pg`
- **Production API URL**: `https://api.cashfree.com/pg`
- **Merchant Approval Requirement**: Real payment testing against production endpoints is strictly prohibited until business verification and website policy compliance audits are certified.
