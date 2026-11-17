# Data Dictionary — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17  

---

## 1. Profiles Table (`public.profiles`)

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PK, FK `auth.users(id)` | Unique user identifier synced with Supabase Auth |
| `full_name` | `TEXT` | NOT NULL | Student's full legal name |
| `email` | `TEXT` | NOT NULL, UNIQUE | Primary communication email |
| `phone_number` | `TEXT` | NULL | Contact mobile number for delivery notifications |
| `college_name` | `TEXT` | NULL | Academic institution name |
| `degree_branch` | `TEXT` | NULL | Degree branch (e.g., B.Tech ECE, CS) |
| `shipping_address`| `JSONB`| NULL | Structured address: `{line1, line2, city, state, postal_code, country}` |
| `created_at` | `TIMESTAMPTZ`| NOT NULL, default UTC now | Timestamp profile created |
| `updated_at` | `TIMESTAMPTZ`| NOT NULL, default UTC now | Timestamp profile updated |

---

## 2. Orders Table (`public.orders`)

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `TEXT` | PK | Prefixed order ID (e.g. `ord_lp_123e4567`) |
| `user_id` | `UUID` | FK `profiles(id)` | Owning student user ID |
| `status` | `order_status_enum` | NOT NULL | Order lifecycle state |
| `subtotal_paise` | `INT` | NOT NULL, >= 0 | Net subtotal before taxes in integer paise |
| `tax_paise` | `INT` | NOT NULL, >= 0 | Applicable GST/tax in integer paise |
| `total_paise` | `INT` | NOT NULL, >= 0 | Final payable amount in integer paise |
| `currency` | `TEXT` | NOT NULL, default 'INR'| Standard currency code |
| `cashfree_order_id`| `TEXT` | UNIQUE | Cashfree gateway reference order ID |
| `created_at` | `TIMESTAMPTZ`| NOT NULL | UTC creation time |

---

## 3. Payment Events Table (`public.payment_events`)

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PK | Internal unique event record ID |
| `order_id` | `TEXT` | FK `orders(id)` | Affected LevUp order ID |
| `event_id` | `TEXT` | NOT NULL, UNIQUE | Gateway event ID from Cashfree webhook (used for idempotency) |
| `event_type` | `TEXT` | NOT NULL | Webhook event type (e.g. `PAYMENT_SUCCESS_WEBHOOK`) |
| `status` | `payment_status_enum`| NOT NULL | Resolved payment status |
| `amount_paise` | `INT` | NOT NULL | Transaction amount in integer paise |
| `raw_payload` | `JSONB`| NOT NULL | Unaltered raw JSON payload from Cashfree |
| `created_at` | `TIMESTAMPTZ`| NOT NULL | Event receipt timestamp |

---

## 4. Deliverable Entitlements Table (`public.deliverable_entitlements`)

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | PK | Entitlement record ID |
| `order_id` | `TEXT` | FK `orders(id)` | Associated verified order |
| `user_id` | `UUID` | FK `profiles(id)` | Entitled student user ID |
| `storage_path` | `TEXT` | NOT NULL | Object path in private Supabase Storage bucket |
| `file_name` | `TEXT` | NOT NULL | Display filename (e.g. `ESP32-Firmware-v1.0.zip`) |
| `file_size_bytes`| `BIGINT`| NOT NULL | Archive byte size |
| `is_active` | `BOOLEAN` | default TRUE | Set false if revoked due to refund or chargeback |
