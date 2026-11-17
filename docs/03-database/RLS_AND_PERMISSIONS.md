# Row-Level Security (RLS) & Permissions Policy — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Core Security Mandate

> [!IMPORTANT]
> **Row-Level Security (RLS) must be enabled on every table in the `public` schema.**  
> By default, PostgreSQL denies all operations on an RLS-enabled table unless an explicit permissive policy exists.

---

## 2. Table-by-Table RLS Policy Matrix

| Table                      | Operations        | Permitted Actors        | Policy Logic (`USING` / `WITH CHECK`)                                                   |
| -------------------------- | ----------------- | ----------------------- | --------------------------------------------------------------------------------------- |
| `profiles`                 | `SELECT`          | Profile owner or Admin  | `auth.uid() = id OR EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())`      |
| `profiles`                 | `UPDATE`          | Profile owner           | `auth.uid() = id`                                                                       |
| `projects`                 | `SELECT`          | Public / Anonymous      | `is_published = true`                                                                   |
| `projects`                 | `ALL`             | Admin only              | `EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())`                         |
| `orders`                   | `SELECT`          | Order owner or Admin    | `user_id = auth.uid() OR EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())` |
| `orders`                   | `INSERT`          | Authenticated users     | `user_id = auth.uid()`                                                                  |
| `orders`                   | `UPDATE`          | Admin / Service Role    | Admin check or Supabase service_role key                                                |
| `deliverable_entitlements` | `SELECT`          | Entitled owner or Admin | `user_id = auth.uid() AND is_active = true`                                             |
| `deliverable_entitlements` | `INSERT / UPDATE` | Service Role only       | Direct client modifications prohibited                                                  |
| `payment_events`           | `SELECT`          | Admin only              | `EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())`                         |
| `payment_events`           | `INSERT`          | Service Role only       | Ingested exclusively by Cashfree webhook handler                                        |
| `audit_logs`               | `SELECT`          | Admin only              | `EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())`                         |
| `audit_logs`               | `INSERT`          | All authenticated       | Append-only logging; no UPDATE or DELETE permitted                                      |

---

## 3. Sample PostgreSQL RLS Implementation

```sql
-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverable_entitlements ENABLE ROW LEVEL SECURITY;

-- Orders: Customer can read own orders
CREATE POLICY "Students view own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

-- Orders: Admins view all orders
CREATE POLICY "Admins view all orders"
ON public.orders FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid() AND is_active = true
  )
);

-- Deliverable Entitlements: Active customer access
CREATE POLICY "Students view own active deliverables"
ON public.deliverable_entitlements FOR SELECT
USING (
  auth.uid() = user_id AND is_active = true
);
```
