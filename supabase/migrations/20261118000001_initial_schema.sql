-- =============================================================================
-- Migration: 20261118000001_initial_schema.sql
-- Description: Baseline schema for LevUp Projects engineering marketplace
-- Engine: PostgreSQL 15+ (Supabase)
-- Applies best practices: Indexes on foreign keys, RLS on public tables,
-- optimized (select auth.uid()) initPlans, strict role scoping (TO authenticated/anon).
-- =============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUMS
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'project_type_enum') THEN
        CREATE TYPE project_type_enum AS ENUM ('ready-made', 'built-on-order', 'customizable');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_type_enum') THEN
        CREATE TYPE delivery_type_enum AS ENUM ('digital', 'physical', 'hybrid');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'difficulty_enum') THEN
        CREATE TYPE difficulty_enum AS ENUM ('beginner', 'intermediate', 'advanced');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
        CREATE TYPE order_status_enum AS ENUM ('draft', 'pending_payment', 'paid', 'in_progress', 'qa_review', 'shipped', 'delivered', 'cancelled', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
        CREATE TYPE payment_status_enum AS ENUM ('initiated', 'pending', 'successful', 'failed', 'refunded');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'revision_status_enum') THEN
        CREATE TYPE revision_status_enum AS ENUM ('submitted', 'in_review', 'in_progress', 'completed', 'rejected', 'converted_to_paid');
    END IF;
END $$;

-- -----------------------------------------------------------------------------
-- 2. HELPER FUNCTIONS & TRIGGERS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 3. PROFILES (Extends auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone_number TEXT,
    college_name TEXT,
    degree_branch TEXT,
    shipping_address JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone_number)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        NEW.raw_user_meta_data->>'phone_number'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 4. ADMIN USERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin', 'qa_engineer', 'support')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    added_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    added_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_users_lookup ON public.admin_users(user_id, is_active);

-- Security Helper for RLS
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = p_user_id AND is_active = true
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

-- -----------------------------------------------------------------------------
-- 5. CATEGORIES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    image_id TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0
);

-- -----------------------------------------------------------------------------
-- 6. PROJECTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES public.categories(id),
    project_type project_type_enum NOT NULL,
    delivery_type delivery_type_enum NOT NULL,
    difficulty difficulty_enum NOT NULL,
    technologies TEXT[] NOT NULL DEFAULT '{}',
    deliverables TEXT[] NOT NULL DEFAULT '{}',
    customizable BOOLEAN NOT NULL DEFAULT false,
    starting_price_paise INT NOT NULL CHECK (starting_price_paise >= 0),
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);

CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 7. PROJECT PACKAGES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id TEXT NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (name IN ('Basic', 'Standard', 'Premium')),
    price_paise INT NOT NULL CHECK (price_paise >= 0),
    short_description TEXT NOT NULL,
    deliverables TEXT[] NOT NULL,
    free_revisions INT NOT NULL DEFAULT 1,
    revision_window_days INT NOT NULL DEFAULT 14,
    support_days INT NOT NULL DEFAULT 14,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(project_id, name)
);

CREATE INDEX IF NOT EXISTS idx_project_packages_project_id ON public.project_packages(project_id);

-- -----------------------------------------------------------------------------
-- 8. PROJECT ADD-ONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.project_add_ons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price_paise INT CHECK (price_paise >= 0),
    makes_physical BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- -----------------------------------------------------------------------------
-- 9. ORDERS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    status order_status_enum NOT NULL DEFAULT 'draft',
    subtotal_paise INT NOT NULL CHECK (subtotal_paise >= 0),
    tax_paise INT NOT NULL DEFAULT 0 CHECK (tax_paise >= 0),
    total_paise INT NOT NULL CHECK (total_paise >= 0),
    currency TEXT NOT NULL DEFAULT 'INR',
    shipping_address JSONB,
    cashfree_order_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_cashfree_order_id ON public.orders(cashfree_order_id);

CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 10. ORDER ITEMS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    project_id TEXT NOT NULL REFERENCES public.projects(id),
    package_name TEXT NOT NULL,
    package_price_paise INT NOT NULL,
    selected_add_ons JSONB NOT NULL DEFAULT '[]',
    item_total_paise INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_project_id ON public.order_items(project_id);

-- -----------------------------------------------------------------------------
-- 11. PAYMENT EVENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id),
    event_id TEXT NOT NULL UNIQUE,
    event_type TEXT NOT NULL,
    status payment_status_enum NOT NULL,
    amount_paise INT NOT NULL,
    raw_payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_payment_events_order_id ON public.payment_events(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_id ON public.payment_events(event_id);

-- -----------------------------------------------------------------------------
-- 12. DELIVERABLE ENTITLEMENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.deliverable_entitlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    storage_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_deliverables_user_id ON public.deliverable_entitlements(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_deliverables_order_id ON public.deliverable_entitlements(order_id);

-- -----------------------------------------------------------------------------
-- 13. AUDIT LOGS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

-- -----------------------------------------------------------------------------
-- 14. ROW-LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Enable RLS on ALL public tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_add_ons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deliverable_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Users can read own profile or admins read all"
    ON public.profiles FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = id OR public.is_admin((SELECT auth.uid())));

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING ((SELECT auth.uid()) = id)
    WITH CHECK ((SELECT auth.uid()) = id);

-- ADMIN USERS
CREATE POLICY "Admins can view admin allowlist"
    ON public.admin_users FOR SELECT
    TO authenticated
    USING (public.is_admin((SELECT auth.uid())));

-- CATEGORIES (Public Read)
CREATE POLICY "Anyone can view categories"
    ON public.categories FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    TO authenticated
    USING (public.is_admin((SELECT auth.uid())));

-- PROJECTS (Public Read for Published)
CREATE POLICY "Anyone can view published projects"
    ON public.projects FOR SELECT
    TO anon, authenticated
    USING (is_published = true OR public.is_admin((SELECT auth.uid())));

CREATE POLICY "Admins can manage all projects"
    ON public.projects FOR ALL
    TO authenticated
    USING (public.is_admin((SELECT auth.uid())));

-- PROJECT PACKAGES
CREATE POLICY "Anyone can view packages for published projects"
    ON public.project_packages FOR SELECT
    TO anon, authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.projects
            WHERE projects.id = project_packages.project_id
            AND (projects.is_published = true OR public.is_admin((SELECT auth.uid())))
        )
    );

CREATE POLICY "Admins can manage project packages"
    ON public.project_packages FOR ALL
    TO authenticated
    USING (public.is_admin((SELECT auth.uid())));

-- PROJECT ADD-ONS
CREATE POLICY "Anyone can view add-ons"
    ON public.project_add_ons FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Admins can manage add-ons"
    ON public.project_add_ons FOR ALL
    TO authenticated
    USING (public.is_admin((SELECT auth.uid())));

-- ORDERS
CREATE POLICY "Users view own orders or admins view all"
    ON public.orders FOR SELECT
    TO authenticated
    USING ((SELECT auth.uid()) = user_id OR public.is_admin((SELECT auth.uid())));

CREATE POLICY "Users can create own orders"
    ON public.orders FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can update orders"
    ON public.orders FOR UPDATE
    TO authenticated
    USING (public.is_admin((SELECT auth.uid())));

-- ORDER ITEMS
CREATE POLICY "Users view own order items or admins view all"
    ON public.order_items FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND (orders.user_id = (SELECT auth.uid()) OR public.is_admin((SELECT auth.uid())))
        )
    );

CREATE POLICY "Users can insert order items for their own orders"
    ON public.order_items FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders
            WHERE orders.id = order_items.order_id
            AND orders.user_id = (SELECT auth.uid())
        )
    );

-- PAYMENT EVENTS (Admin Only read, Ingestion via service_role)
CREATE POLICY "Admins view payment events"
    ON public.payment_events FOR SELECT
    TO authenticated
    USING (public.is_admin((SELECT auth.uid())));

-- DELIVERABLE ENTITLEMENTS (Students view active deliverables)
CREATE POLICY "Students view own active deliverables"
    ON public.deliverable_entitlements FOR SELECT
    TO authenticated
    USING (((SELECT auth.uid()) = user_id AND is_active = true) OR public.is_admin((SELECT auth.uid())));

-- AUDIT LOGS (Admin view, authenticated append)
CREATE POLICY "Admins view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin((SELECT auth.uid())));

CREATE POLICY "Authenticated users can append audit logs"
    ON public.audit_logs FOR INSERT
    TO authenticated
    WITH CHECK ((SELECT auth.uid()) = actor_id);

-- -----------------------------------------------------------------------------
-- 15. SEED DATA (Approved Categories from Product Inventory)
-- -----------------------------------------------------------------------------
INSERT INTO public.categories (id, name, slug, description, image_id, display_order)
VALUES
    ('cat-iot', 'IoT Systems', 'iot-systems', 'Connected smart sensor and telemetry projects', 'cat-iot', 1),
    ('cat-software', 'Software Projects', 'software-projects', 'Full-stack applications, algorithms and tools', 'cat-software', 2),
    ('cat-embedded', 'Embedded Systems', 'embedded-systems', 'Microcontroller and firmware based engineering builds', 'cat-embedded', 3),
    ('cat-robotics', 'Robotics', 'robotics', 'Autonomous ground and aerial robotic implementations', 'cat-robotics', 4),
    ('cat-ai-ml', 'AI / ML Projects', 'ai-ml-projects', 'Computer vision, NLP and predictive edge models', 'cat-ai-ml', 5),
    ('cat-electronics', 'Electronics Projects', 'electronics-projects', 'Power electronics, circuit design and PCB projects', 'cat-electronics', 6),
    ('cat-hybrid', 'Hybrid Solutions', 'hybrid-solutions', 'Integrated hardware-software multi-disciplinary systems', 'cat-hybrid', 7)
ON CONFLICT (id) DO NOTHING;
