# Third-Party Integrations — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. External Integrations Matrix

| Service | Category | Environment Config | Communication Flow | Security Controls |
|---|---|---|---|---|
| **Cashfree Payments** | Payment Gateway | `CASHFREE_APP_ID`<br>`CASHFREE_CLIENT_SECRET`<br>`CASHFREE_WEBHOOK_SECRET`<br>`CASHFREE_ENV` (sandbox/prod) | Server-to-Server REST API + Inbound Webhooks | Secret stored in server env only; Raw body HMAC-SHA256 signature verification |
| **Supabase PostgreSQL** | Authoritative Database | `NEXT_PUBLIC_SUPABASE_URL`<br>`SUPABASE_SERVICE_ROLE_KEY` | Direct Postgres connection pool + REST / RPC | Row-Level Security (RLS) enabled on all tables; Service role key server-side only |
| **Supabase Auth** | User Authentication | `NEXT_PUBLIC_SUPABASE_URL`<br>`NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser SDK for login, Server-side JWT validation | Secure HTTP-only cookies, MFA for Admin users |
| **Supabase Storage** | File Storage | `NEXT_PUBLIC_SUPABASE_URL`<br>`SUPABASE_SERVICE_ROLE_KEY` | Server-generated signed URLs | Private bucket policy; 15-minute expiration on download URLs |
| **Logistics / Courier** | Physical Kit Shipping | TBD (Shiprocket / Delhivery API in V1.1) | Outbound shipment creation + Inbound AWB tracking webhook | Webhook secret verification, AWB validation |
| **Vercel** | Hosting & Serverless | Platform Environment | GitHub deployment webhook | Preview isolation, branch protection |

---

## 2. Cashfree Integration Details

### 2.1 Order Creation (`orders.create`)
- Initiated exclusively from server-side route `/api/payments/cashfree/create-order`.
- Payload parameters:
  - `order_id`: Unique prefixed ID (`ord_lp_<uuid>`)
  - `order_amount`: Exact total in paise divided by 100 (Cashfree API expects INR float format `1234.50`)
  - `order_currency`: `"INR"`
  - `customer_details`: Customer ID, email, phone number
  - `order_meta`: `return_url`, `notify_url` (webhook endpoint)
- Cashfree responds with `payment_session_id`.

### 2.2 Webhook Processing (`/api/webhooks/cashfree`)
- **Requirement:** Cashfree signs the raw body of the request with the merchant webhook secret.
- **Verification:** Compute HMAC-SHA256 over `rawBody` using `CASHFREE_WEBHOOK_SECRET` and compare against `x-webhook-signature` using constant-time comparison.
- **Handling:**
  1. If signature mismatch: return 401 Unauthorized immediately.
  2. If signature matches: parse JSON body.
  3. Check if `data.order.order_id` and `event_time` have already been processed in `payment_events`.
  4. If duplicate: return 200 OK immediately (idempotency).
  5. If new: persist event, update order status to `PAID`, trigger entitlement generation, return 200 OK.
