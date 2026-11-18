-- =============================================================================
-- LevUp Projects — Security Hardening Migration
-- Migration: 20261118000002_security_hardening.sql
-- Description: Hardens RLS policies, constrains administrative checks, and prevents
--              client-side financial state manipulation (Codex S6 & S7 remediation).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. HARDEN ADMIN LOOKUP SECURITY DEFINER FUNCTION (S7)
-- -----------------------------------------------------------------------------
-- Prevent arbitrary user ID probing by defining a parameterless is_admin() function
-- that binds strictly to the authenticated principal.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = (SELECT auth.uid()) AND is_active = true
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Overload with parameter restricted to authenticated caller's own uid
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT CASE
        WHEN p_user_id IS NULL THEN false
        WHEN p_user_id != (SELECT auth.uid()) THEN false
        ELSE EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = p_user_id AND is_active = true
        )
    END;
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- Explicitly revoke public execution grants and re-grant to authenticated/service_role
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_admin(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated, service_role;

-- -----------------------------------------------------------------------------
-- 2. HARDEN ORDER FINANCIAL STATE & ITEM INSERTION POLICIES (S6)
-- -----------------------------------------------------------------------------
-- Prevent customers from inserting orders marked as 'paid', 'processing', or 'delivered'.
-- Customers may only initiate orders in 'draft' or 'pending_payment' status.
DROP POLICY IF EXISTS "Users can create own orders" ON public.orders;
CREATE POLICY "Users can create own orders"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = user_id
        AND status IN ('draft', 'pending_payment')
    );

-- Prevent injecting items into paid or completed orders.
DROP POLICY IF EXISTS "Users can insert order items for their own orders" ON public.order_items;
CREATE POLICY "Users can insert order items for their own orders"
    ON public.order_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = (SELECT auth.uid())
            AND orders.status IN ('draft', 'pending_payment')
        )
    );

-- -----------------------------------------------------------------------------
-- 3. HARDEN AUDIT LOG INGESTION (S7)
-- -----------------------------------------------------------------------------
-- Constrain authenticated client audit logging to permitted user-space actions,
-- reserving financial, permission, and administrative actions for trusted server code.
DROP POLICY IF EXISTS "Authenticated users can append audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can append audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK (
        (SELECT auth.uid()) = actor_id
        AND action IN ('client_event', 'cart_action', 'requisition_draft', 'checkout_attempt', 'feedback_submit')
    );
