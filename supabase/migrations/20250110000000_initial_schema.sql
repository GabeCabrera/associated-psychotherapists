-- =====================================================
-- ASSOCIATED PSYCH PLATFORM - INITIAL SCHEMA
-- =====================================================
-- Migration: 20250110000000_initial_schema
-- Description: Creates base tables, RLS policies, and helper functions
-- Dependencies: Supabase Auth (auth.users)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for encryption functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
-- Base user profile extending Supabase Auth
-- Links to auth.users via foreign key

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('therapist', 'client', 'admin')),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true NOT NULL,
  deleted_at TIMESTAMPTZ -- Soft delete
);

-- Indexes for performance
CREATE INDEX idx_profiles_role ON public.profiles(role) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_email ON public.profiles(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active) WHERE deleted_at IS NULL;

-- Comment for documentation
COMMENT ON TABLE public.profiles IS 'Base user profiles extending Supabase Auth. All users have a profile regardless of role.';

-- =====================================================
-- THERAPIST PROFILES TABLE
-- =====================================================
-- Detailed profile information for therapist users

CREATE TABLE public.therapist_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- License & Verification
  license_number VARCHAR(50) NOT NULL,
  license_state VARCHAR(2) NOT NULL,
  license_verified BOOLEAN DEFAULT false NOT NULL,
  verification_status VARCHAR(20) DEFAULT 'pending' NOT NULL
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_notes TEXT,
  
  -- Professional Information
  specializations TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  years_experience INTEGER,
  education TEXT,
  approach TEXT,
  
  -- Pricing & Insurance
  rate_per_session DECIMAL(10,2),
  accepts_insurance BOOLEAN DEFAULT false NOT NULL,
  insurance_providers TEXT[],
  
  -- Availability & Settings
  availability_json JSONB, -- Stores weekly schedule structure
  timezone VARCHAR(50) DEFAULT 'America/New_York' NOT NULL,
  is_accepting_clients BOOLEAN DEFAULT true NOT NULL,
  
  -- Media
  video_intro_url TEXT,
  website_url TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_therapist_user_id ON public.therapist_profiles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_therapist_specializations ON public.therapist_profiles USING GIN(specializations) WHERE deleted_at IS NULL;
CREATE INDEX idx_therapist_verification ON public.therapist_profiles(verification_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_therapist_accepting ON public.therapist_profiles(is_accepting_clients, verification_status) WHERE deleted_at IS NULL;
CREATE INDEX idx_therapist_rate ON public.therapist_profiles(rate_per_session) WHERE deleted_at IS NULL;

COMMENT ON TABLE public.therapist_profiles IS 'Extended profile information for therapist users including credentials, specializations, and availability.';

-- =====================================================
-- CLIENT PROFILES TABLE
-- =====================================================
-- Detailed profile information for client users

CREATE TABLE public.client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Demographics
  date_of_birth DATE,
  gender VARCHAR(50),
  preferred_pronouns VARCHAR(50),
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  
  -- Insurance
  insurance_provider VARCHAR(255),
  insurance_member_id VARCHAR(100),
  
  -- Preferences & Goals
  goals TEXT,
  previous_therapy BOOLEAN,
  preferred_communication VARCHAR(20) DEFAULT 'video' NOT NULL
    CHECK (preferred_communication IN ('video', 'phone', 'chat', 'in-person')),
  
  -- Settings
  timezone VARCHAR(50) DEFAULT 'America/New_York' NOT NULL,
  
  -- Intake Status
  intake_completed BOOLEAN DEFAULT false NOT NULL,
  intake_completed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_client_user_id ON public.client_profiles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_client_intake ON public.client_profiles(intake_completed) WHERE deleted_at IS NULL;

COMMENT ON TABLE public.client_profiles IS 'Extended profile information for client users including demographics, preferences, and intake status.';

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() 
      AND role = 'admin'
      AND is_active = true
      AND deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.is_admin IS 'Security definer function to check if current user has admin role.';

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.handle_updated_at IS 'Trigger function to automatically update updated_at timestamp on row updates.';

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Auto-update updated_at on profiles
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-update updated_at on therapist_profiles
CREATE TRIGGER therapist_profiles_updated_at
  BEFORE UPDATE ON public.therapist_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Auto-update updated_at on client_profiles
CREATE TRIGGER client_profiles_updated_at
  BEFORE UPDATE ON public.client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (public.is_admin());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE
USING (public.is_admin());

-- Admins can insert profiles (for manual user creation)
CREATE POLICY "Admins can insert profiles"
ON public.profiles FOR INSERT
WITH CHECK (public.is_admin());

-- =====================================================
-- THERAPIST PROFILES TABLE POLICIES
-- =====================================================

-- Therapists can view their own profile
CREATE POLICY "Therapists can view own profile"
ON public.therapist_profiles FOR SELECT
USING (
  user_id = auth.uid()
);

-- Therapists can update their own profile
CREATE POLICY "Therapists can update own profile"
ON public.therapist_profiles FOR UPDATE
USING (user_id = auth.uid());

-- Therapists can insert their own profile (on signup)
CREATE POLICY "Therapists can create own profile"
ON public.therapist_profiles FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'therapist'
  )
);

-- Public can view verified therapist profiles (for directory)
CREATE POLICY "Public can view verified therapists"
ON public.therapist_profiles FOR SELECT
USING (
  verification_status = 'verified' 
  AND is_accepting_clients = true
  AND deleted_at IS NULL
);

-- Admins can view all therapist profiles
CREATE POLICY "Admins can view all therapist profiles"
ON public.therapist_profiles FOR SELECT
USING (public.is_admin());

-- Admins can update all therapist profiles (for verification)
CREATE POLICY "Admins can update all therapist profiles"
ON public.therapist_profiles FOR UPDATE
USING (public.is_admin());

-- =====================================================
-- CLIENT PROFILES TABLE POLICIES
-- =====================================================

-- Clients can view their own profile
CREATE POLICY "Clients can view own profile"
ON public.client_profiles FOR SELECT
USING (user_id = auth.uid());

-- Clients can update their own profile
CREATE POLICY "Clients can update own profile"
ON public.client_profiles FOR UPDATE
USING (user_id = auth.uid());

-- Clients can insert their own profile (on signup)
CREATE POLICY "Clients can create own profile"
ON public.client_profiles FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'client'
  )
);

-- Admins can view all client profiles
CREATE POLICY "Admins can view all client profiles"
ON public.client_profiles FOR SELECT
USING (public.is_admin());

-- Admins can update all client profiles
CREATE POLICY "Admins can update all client profiles"
ON public.client_profiles FOR UPDATE
USING (public.is_admin());

-- =====================================================
-- INITIAL SEED DATA (OPTIONAL)
-- =====================================================
-- Uncomment to create a test admin user
-- Note: You'll need to create the auth.users entry first via Supabase Dashboard

/*
-- Example: Insert test admin profile
-- First create user via Supabase Dashboard Auth, then insert profile:
INSERT INTO public.profiles (id, role, email, full_name, is_active)
VALUES (
  '[your-auth-user-uuid]'::uuid,
  'admin',
  'admin@associatedpsych.com',
  'Admin User',
  true
);
*/

-- =====================================================
-- VERIFICATION & TESTING QUERIES
-- =====================================================
-- Run these after migration to verify setup

-- Check tables created
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check RLS is enabled
-- SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Check policies created
-- SELECT tablename, policyname FROM pg_policies WHERE schemaname = 'public';

-- =====================================================
-- END OF MIGRATION
-- =====================================================
