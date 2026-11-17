# User Journeys — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Journey 1: Student Browses & Purchases Ready-Made Project Kit

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Storefront as LevUp Storefront
    participant Cart as Shopping Cart
    participant Server as LevUp Server API
    participant DB as Supabase DB
    participant Cashfree as Cashfree Gateway
    actor Admin as LevUp Admin

    Student->>Storefront: Filters catalog (e.g. IoT, Intermediate, ESP32)
    Storefront-->>Student: Displays filtered projects
    Student->>Storefront: Selects project, chooses "Standard" package & adds "Circuit Gerber" add-on
    Student->>Cart: Clicks "Add to Cart"
    Student->>Cart: Reviews items & proceeds to Checkout
    Student->>Server: Submits order (student details, package snapshot)
    Server->>DB: Validates prices server-side, writes order (status: pending_payment)
    Server->>Cashfree: Calls create_order (amount in paise, return_url)
    Cashfree-->>Server: Returns payment_session_id
    Server-->>Storefront: Initiates Cashfree Hosted Checkout
    Student->>Cashfree: Completes UPI/Card payment
    Cashfree->>Server: Dispatches raw webhook payload (payment_success)
    Server->>Server: Verifies webhook signature with CASHFREE_WEBHOOK_SECRET
    Server->>DB: Records payment_event, marks order as "paid", creates delivery entitlements
    Server-->>Student: Redirects to confirmation page
    Student->>Storefront: Navigates to Dashboard -> Deliverables
    Student->>Server: Requests signed download link for source code ZIP
    Server->>DB: Verifies user entitlement & order status
    Server-->>Student: Returns time-limited signed Supabase Storage URL
```

---

## 2. Journey 2: Student Requests Custom Project with Milestone Payments

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Storefront as LevUp Custom Form
    participant Server as LevUp Server API
    participant DB as Supabase DB
    actor Admin as LevUp Engineer
    participant Cashfree as Cashfree Gateway

    Student->>Storefront: Fills custom project intake (domain, scope, deadline, hardware requirements)
    Student->>Server: Submits request with attached reference documents
    Server->>DB: Stores custom_project_request (status: submitted)
    Admin->>DB: Reviews request, estimates effort, prepares quotation with 2 milestones (50% / 50%)
    Admin->>DB: Issues quotation to student
    Student->>Storefront: Receives notification, reviews quote & milestone schedule
    Student->>Server: Accepts quotation
    Server->>Cashfree: Generates payment order for Milestone 1 (Advance)
    Student->>Cashfree: Pays Milestone 1
    Cashfree->>Server: Webhook verifies payment
    Server->>DB: Marks Milestone 1 as "paid", sets project to "in_progress"
    Admin->>Admin: Develops project, completes prototype
    Admin->>DB: Uploads demo video & status update for review
    Student->>Storefront: Reviews progress demonstration
    Admin->>DB: Marks Milestone 2 ready for payment
    Student->>Cashfree: Pays Milestone 2 (Final Balance)
    Cashfree->>Server: Webhook verifies payment
    Server->>DB: Marks order "completed", generates final deliverable entitlements
    Admin->>DB: Dispatches physical hardware kit via courier, logs AWB tracking number
    Student->>Storefront: Tracks shipment in dashboard and downloads project code & documentation
```

---

## 3. Journey 3: Student Requests Post-Delivery Revision

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant Dashboard as Student Dashboard
    participant Server as LevUp Server API
    participant DB as Supabase DB
    actor Admin as LevUp QA

    Student->>Dashboard: Navigates to Project -> Revisions
    Dashboard->>DB: Reads remaining free revisions entitlement & window days
    Student->>Dashboard: Submits revision ticket (issue description, screenshots, requested adjustment)
    Dashboard->>Server: POST /api/revisions/create
    Server->>DB: Checks if within revision_window_days and remaining_free_revisions > 0
    alt Free Revision Approved
        Server->>DB: Deducts 1 free revision, marks revision "in_review"
        Admin->>Admin: Fixes reported issue, updates deliverable ZIP
        Admin->>DB: Uploads revised files, closes revision ticket
        Student->>Dashboard: Downloads revised package
    else Paid Change Request Required (Out of scope / Revisions exhausted)
        Admin->>DB: Marks as "paid_change_request", generates price quote
        Student->>Server: Accepts quote and pays change fee
        Admin->>Admin: Executes requested modification
    end
```
