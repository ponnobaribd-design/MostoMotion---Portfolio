-- ==============================================================================
-- MOSTO MOTION — DYNAMIC PORTFOLIO CMS & ROLE-BASED ADMIN DASHBOARD
-- PostgreSQL Migration for Supabase
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums & Types
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('admin', 'moderator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE project_status_type AS ENUM ('draft', 'pending', 'approved', 'rejected', 'published');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role user_role_type NOT NULL DEFAULT 'moderator',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on profiles role for fast lookup
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- 4. CATEGORIES Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    parent_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    description TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON public.categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON public.categories(sort_order);

-- 5. PROJECTS Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
    media_type TEXT NOT NULL DEFAULT 'video',
    source_type TEXT NOT NULL DEFAULT 'direct_mp4',
    media_url TEXT NOT NULL,
    poster_url TEXT,
    aspect_ratio TEXT NOT NULL DEFAULT '16:9',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT false,
    status project_status_type NOT NULL DEFAULT 'draft',
    submitted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_projects_category_id ON public.projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_published ON public.projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_submitted_by ON public.projects(submitted_by);
CREATE INDEX IF NOT EXISTS idx_projects_sort_order ON public.projects(sort_order);

-- 6. SITE SETTINGS Table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Helper Function: Get User Role
CREATE OR REPLACE FUNCTION public.get_user_role(uid UUID)
RETURNS TEXT AS $$
DECLARE
    u_role TEXT;
BEGIN
    SELECT role::text INTO u_role FROM public.profiles WHERE id = uid;
    RETURN u_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger: Automatic updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Trigger: Handle New Auth User Profile Creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    existing_admin_count INT;
    assigned_role user_role_type;
BEGIN
    -- Check how many admins exist; the first registered user is automatically made admin!
    SELECT COUNT(*) INTO existing_admin_count FROM public.profiles WHERE role = 'admin';
    
    IF existing_admin_count = 0 THEN
        assigned_role := 'admin'::user_role_type;
    ELSE
        assigned_role := 'moderator'::user_role_type;
    END IF;

    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, assigned_role)
    ON CONFLICT (id) DO UPDATE SET email = EXCLUDED.email;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- ---------------- PROFILES POLICIES ----------------
-- User can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Admin can view all profiles
CREATE POLICY "Admin can view all profiles"
ON public.profiles FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');

-- Admin can update profiles (e.g. promote moderator to admin)
CREATE POLICY "Admin can update profiles"
ON public.profiles FOR UPDATE
USING (public.get_user_role(auth.uid()) = 'admin');

-- ---------------- CATEGORIES POLICIES ----------------
-- Public read access to active categories
CREATE POLICY "Public can view active categories"
ON public.categories FOR SELECT
USING (is_active = true);

-- Authenticated moderators & admins can view all categories
CREATE POLICY "Staff can view all categories"
ON public.categories FOR SELECT
USING (auth.role() = 'authenticated');

-- Admin has full write access to categories
CREATE POLICY "Admin can insert categories"
ON public.categories FOR INSERT
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin can update categories"
ON public.categories FOR UPDATE
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin can delete categories"
ON public.categories FOR DELETE
USING (public.get_user_role(auth.uid()) = 'admin');

-- ---------------- PROJECTS POLICIES ----------------
-- Public can view only published projects
CREATE POLICY "Public can view published projects"
ON public.projects FOR SELECT
USING (is_published = true AND status = 'published');

-- Admin can view all projects in any status
CREATE POLICY "Admin can view all projects"
ON public.projects FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');

-- Moderator can view own submitted projects
CREATE POLICY "Moderator can view own submissions"
ON public.projects FOR SELECT
USING (submitted_by = auth.uid());

-- Admin full management of projects
CREATE POLICY "Admin can insert projects"
ON public.projects FOR INSERT
WITH CHECK (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin can update projects"
ON public.projects FOR UPDATE
USING (public.get_user_role(auth.uid()) = 'admin');

CREATE POLICY "Admin can delete projects"
ON public.projects FOR DELETE
USING (public.get_user_role(auth.uid()) = 'admin');

-- Moderator can submit projects STRICTLY with status = 'pending' and is_published = false
CREATE POLICY "Moderator can submit pending projects"
ON public.projects FOR INSERT
WITH CHECK (
    public.get_user_role(auth.uid()) = 'moderator'
    AND status = 'pending'
    AND is_published = false
    AND submitted_by = auth.uid()
);

-- Moderator can edit own pending/draft projects before approval, but CANNOT self-publish
CREATE POLICY "Moderator can edit own pending projects"
ON public.projects FOR UPDATE
USING (
    submitted_by = auth.uid() 
    AND status IN ('pending', 'draft')
)
WITH CHECK (
    submitted_by = auth.uid() 
    AND status IN ('pending', 'draft')
    AND is_published = false
);

-- ---------------- SITE SETTINGS POLICIES ----------------
-- Public can read site settings
CREATE POLICY "Public can view site settings"
ON public.site_settings FOR SELECT
USING (true);

-- Admin can modify site settings
CREATE POLICY "Admin can manage site settings"
ON public.site_settings FOR ALL
USING (public.get_user_role(auth.uid()) = 'admin');

-- ==============================================================================
-- 11. SEED DATA: CATEGORIES & SUBCATEGORIES
-- ==============================================================================

-- Main Categories
INSERT INTO public.categories (id, name, slug, parent_id, sort_order, is_active)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Motion Graphics', 'motion-graphics', NULL, 1, true),
    ('22222222-2222-2222-2222-222222222222', 'Video Editing', 'video-editing', NULL, 2, true),
    ('33333333-3333-3333-3333-333333333333', 'Graphic Design', 'graphic-design', NULL, 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Motion Graphics Subcategories
INSERT INTO public.categories (name, slug, parent_id, sort_order, is_active)
VALUES 
    ('Restaurant Ads', 'motion-restaurant-ads', '11111111-1111-1111-1111-111111111111', 1, true),
    ('Promotional / Commercial Video', 'motion-promotional-commercial', '11111111-1111-1111-1111-111111111111', 2, true),
    ('Before / After', 'motion-before-after', '11111111-1111-1111-1111-111111111111', 3, true),
    ('Logo & Title Animation', 'motion-logo-title-animation', '11111111-1111-1111-1111-111111111111', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Video Editing Subcategories
INSERT INTO public.categories (name, slug, parent_id, sort_order, is_active)
VALUES 
    ('Podcast Editing', 'video-podcast-editing', '22222222-2222-2222-2222-222222222222', 1, true),
    ('Short-form Content', 'video-short-form-content', '22222222-2222-2222-2222-222222222222', 2, true),
    ('Before / After', 'video-before-after', '22222222-2222-2222-2222-222222222222', 3, true),
    ('Educational Content', 'video-educational-content', '22222222-2222-2222-2222-222222222222', 4, true),
    ('Restaurant Ads', 'video-restaurant-ads', '22222222-2222-2222-2222-222222222222', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Graphic Design Subcategories
INSERT INTO public.categories (name, slug, parent_id, sort_order, is_active)
VALUES 
    ('Social Media Creatives', 'graphic-social-media-creatives', '33333333-3333-3333-3333-333333333333', 1, true),
    ('YouTube Thumbnails', 'graphic-youtube-thumbnails', '33333333-3333-3333-3333-333333333333', 2, true),
    ('AI Generated Concept Art', 'graphic-ai-generated-concept-art', '33333333-3333-3333-3333-333333333333', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Initial Site Settings
INSERT INTO public.site_settings (setting_key, setting_value)
VALUES 
    ('gallery_config', '{"default_view": "featured", "autoplay_in_view": true, "enable_hover_portal": true}'::jsonb),
    ('contact_info', '{"whatsapp": "+8801700000000", "email": "mostofaeeiubat1@gmail.com"}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;
