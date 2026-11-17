# Acceptance Criteria — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Public Marketplace & Catalog

### AC-CAT-01: Multi-Filter Functionality
- **Given** a user is on `/projects`,
- **When** the user selects category "IoT & Electronics" and delivery type "Physical hardware",
- **Then** the URL query string updates to `?category=iot-electronics&delivery=physical`,
- **And** the project grid renders only matching catalog projects,
- **And** active filter chips display both selections with individual dismissal buttons,
- **And** the results count reflects the exact count of filtered items.

### AC-CAT-02: Search Responsiveness & Reset
- **Given** a user enters a search term in the header search input or search dialog,
- **When** matching projects exist,
- **Then** matching project cards are displayed with query matches,
- **When** no projects match,
- **Then** the "No projects match your filter selection" state is rendered with a "Clear all filters" button,
- **And** clicking "Clear all filters" restores the default catalog view.

### AC-CAT-03: Project Detail Configuration
- **Given** a user is on `/projects/esp32-smart-irrigation-system`,
- **When** the user switches between Basic, Standard, and Premium packages,
- **Then** the deliverables list, revision entitlements, and total price update immediately,
- **And** checking an optional add-on increments the configuration total by the exact integer paise value.

---

## 2. Commerce & Financial Integrity

### AC-PAY-01: Price Tampering Prevention
- **Given** a malicious user modifies the client-side cart price or payload before checkout,
- **When** `POST /api/orders/create` is invoked,
- **Then** the server recalculates the total from authoritative database package and add-on records,
- **And** rejects or overrides any client-supplied pricing differences.

### AC-PAY-02: Webhook Security Verification
- **Given** a webhook payload arrives at `/api/webhooks/cashfree`,
- **When** the signature header `x-webhook-signature` is computed against the raw unparsed request body using `CASHFREE_WEBHOOK_SECRET`,
- **Then** if the signature fails, the server responds with HTTP 401 Unauthorized and logs a security event,
- **And** no order status or database record is altered.

### AC-PAY-03: Idempotent Webhook Processing
- **Given** Cashfree sends a duplicate webhook event for an already processed transaction,
- **When** the server handles the event,
- **Then** it detects the existing `event_id` in `payment_events`,
- **And** returns HTTP 200 without executing duplicate fulfillment, emails, or state mutations.

---

## 3. Security & Access Governance

### AC-SEC-01: Customer Data Isolation
- **Given** an authenticated student user `Student_A`,
- **When** `Student_A` attempts to query order or file delivery records belonging to `Student_B`,
- **Then** Supabase Row-Level Security blocks the query, returning an empty set or 403 Forbidden.

### AC-SEC-02: Admin Endpoint Enforcement
- **Given** an unauthenticated or non-admin user requests an `/admin/*` or `/api/admin/*` route,
- **When** server-side authorization verifies the session JWT against the admin allowlist,
- **Then** the request is rejected with HTTP 403 Forbidden regardless of whether the client accessed `/admin-login`.

### AC-SEC-03: Deliverable Download Links
- **Given** a student has purchased a project,
- **When** requesting file downloads from the dashboard,
- **Then** download URLs are short-lived signed URLs (maximum TTL 15 minutes),
- **And** direct public access to Supabase Storage deliverable buckets is disabled.
