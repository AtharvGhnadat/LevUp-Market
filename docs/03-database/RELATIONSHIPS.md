# Database Relationships & Referential Integrity — LevUp Projects

**Document Status:** Baseline  
**Last Updated:** 2026-11-17

---

## 1. Entity Relationship Specifications

### 1.1 Identity & Authorization

- `auth.users (1)` ─── `(1) public.profiles`: One-to-one link extending Supabase Auth.
- `auth.users (1)` ─── `(0..1) public.admin_users`: Explicit whitelist for staff/admin authorization.

### 1.2 Catalog Hierarchy

- `public.categories (1)` ─── `(0..*) public.projects`: A project belongs to exactly one primary category.
- `public.projects (1)` ─── `(1..3) public.project_packages`: Each project defines up to three standard tiers (Basic, Standard, Premium).
- `public.projects (1)` ─── `(0..*) public.project_files`: Raw asset catalog associated with the project.

### 1.3 Orders & Commerce

- `public.profiles (1)` ─── `(0..*) public.orders`: A customer may place multiple orders.
- `public.orders (1)` ─── `(1..*) public.order_items`: An order contains one or more snapshot items.
- `public.orders (1)` ─── `(0..*) public.payment_events`: An order tracks all payment webhook events.
- `public.orders (1)` ─── `(0..*) public.deliverable_entitlements`: Upon successful payment, an order unlocks secure file access.
- `public.orders (1)` ─── `(0..*) public.revisions`: Customers submit revisions tied to specific fulfilled orders.

---

## 2. Referential Integrity & Cascade Rules

| Relationship                          | Foreign Key                         | On Delete Behavior | Business Rule                                             |
| ------------------------------------- | ----------------------------------- | ------------------ | --------------------------------------------------------- |
| `profiles` → `auth.users`             | `profiles.id`                       | `CASCADE`          | Deleting an auth user cleans up profile data              |
| `orders` → `profiles`                 | `orders.user_id`                    | `RESTRICT`         | Cannot delete customer profile if historical orders exist |
| `order_items` → `orders`              | `order_items.order_id`              | `CASCADE`          | Items are part of the order document                      |
| `payment_events` → `orders`           | `payment_events.order_id`           | `RESTRICT`         | Financial audit trail cannot be orphaned                  |
| `deliverable_entitlements` → `orders` | `deliverable_entitlements.order_id` | `RESTRICT`         | Entitlements cannot be deleted while order exists         |
