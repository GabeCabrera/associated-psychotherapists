# 🗄️ Supabase Project Initialization Guide

**Phase 0, Section 2: Supabase Project Setup**

This guide walks through setting up the Supabase project for the Associated Psych platform, including authentication, database, storage, and migrations.

---

## 📋 Prerequisites

- Supabase account (https://supabase.com)
- Supabase CLI installed: `npm install -g supabase`
- Git repository initialized

---

## 🚀 Step 1: Create Supabase Project

### 1.1 Via Supabase Dashboard

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in project details:
   - **Name**: `associated-psych` or `associated-psych-dev`
   - **Database Password**: Generate a strong password (save it securely!)
   - **Region**: Choose closest to your target users (e.g., `us-east-1`)
   - **Pricing Plan**: Start with Free tier for development

4. Wait for project provisioning (~2 minutes)

### 1.2 Get Project Credentials

Once created, navigate to **Project Settings** → **API**:

- **Project URL**: `https://[your-project-ref].supabase.co`
- **anon/public key**: Used for client-side operations
- **service_role key**: Used for server-side admin operations (keep secret!)

Save these to your `.env.local` file (see Step 5).

---

## 🔐 Step 2: Configure Authentication

### 2.1 Email Authentication (Primary)

1. Go to **Authentication** → **Providers** → **Email**
2. Enable "Email" provider
3. Configure email settings:
   - **Enable email confirmations**: `ON` (for production, can disable for dev)
   - **Secure email change**: `ON`
   - **Double confirm email changes**: `ON`

### 2.2 OAuth Providers (Optional)

For future implementation, enable:

#### Google OAuth
1. Go to **Authentication** → **Providers** → **Google**
2. Enable provider
3. Add Client ID and Client Secret from Google Cloud Console
4. Configure authorized redirect URIs: `https://[your-project-ref].supabase.co/auth/v1/callback`

#### Apple Sign In
1. Similar process via **Apple** provider
2. Requires Apple Developer account

### 2.3 Auth Settings

Go to **Authentication** → **Settings**:

- **Site URL**: `http://localhost:3000` (dev) / `https://yourdomain.com` (prod)
- **Redirect URLs**: Add allowed redirect URLs:
  - `http://localhost:3000/**`
  - `https://yourdomain.com/**`
- **JWT Expiry**: `3600` (1 hour)
- **Refresh Token Rotation**: `ON`
- **Enable custom access token hook**: `OFF` (for now)

### 2.4 Email Templates

Customize email templates in **Authentication** → **Email Templates**:

- **Confirm signup**: Welcoming message aligned with brand voice (calm, professional)
- **Magic Link**: For passwordless login (optional)
- **Reset Password**: Clear instructions, empathetic tone
- **Change Email Address**: Security-focused message

Use the brand palette colors:
- Primary: `#1A365D`
- Accent: `#6B8EAE`
- Background: `#E6EEF5`

---

## 🗄️ Step 3: Initialize Database & Migrations

### 3.1 Link Local Project to Supabase

```bash
# Login to Supabase CLI
supabase login

# Link your local project to remote Supabase project
supabase link --project-ref [your-project-ref]

# Initialize local development setup
supabase init
```

This creates a `/supabase` directory with:
- `/migrations/` - SQL migration files
- `/seed.sql` - Seed data
- `config.toml` - Supabase configuration

### 3.2 Configure Local Development (Optional)

To run Supabase locally with Docker:

```bash
# Start local Supabase (requires Docker)
supabase start

# This spins up:
# - PostgreSQL database
# - Auth server
# - Realtime server
# - Storage server
# - Studio (local dashboard)
```

Access local Studio at: `http://localhost:54323`

### 3.3 Create Initial Migration

The initial migration file has been created at `/supabase/migrations/20250101000000_initial_schema.sql` (see next section).

To apply migrations:

```bash
# Push migrations to remote Supabase
supabase db push

# Or apply to local instance
supabase db reset  # Resets and applies all migrations
```

### 3.4 Migration Workflow

For future schema changes:

```bash
# Create new migration
supabase migration new [migration_name]

# Example
supabase migration new add_session_ratings

# Edit the generated file in /supabase/migrations/
# Then push to remote
supabase db push
```

---

## 📦 Step 4: Configure Storage Buckets

### 4.1 Create Buckets

Go to **Storage** in Supabase Dashboard:

#### Bucket 1: `avatars`
- **Purpose**: User profile photos (therapists & clients)
- **Public**: `NO` (controlled access via RLS)
- **File size limit**: `5 MB`
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`

#### Bucket 2: `documents`
- **Purpose**: Therapist licenses, certifications, insurance documents
- **Public**: `NO`
- **File size limit**: `10 MB`
- **Allowed MIME types**: `application/pdf`, `image/jpeg`, `image/png`

### 4.2 Storage RLS Policies

After creating buckets, add Row Level Security policies:

#### Avatars Bucket Policies

```sql
-- Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Anyone can view avatars (for therapist discovery)
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

#### Documents Bucket Policies

```sql
-- Therapists can upload their documents
CREATE POLICY "Therapists can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1] AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'therapist'
  )
);

-- Users can view only their own documents
CREATE POLICY "Users can view own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

**Note**: Apply these policies via SQL Editor in Supabase Dashboard after creating the `profiles` table.

---

## 🌐 Step 5: Environment Variables Setup

Update your `.env.local` with Supabase credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Security Notes**:
- ✅ `NEXT_PUBLIC_*` variables are safe to expose to the browser
- ❌ **NEVER** expose `SUPABASE_SERVICE_ROLE_KEY` to the client
- Service role key bypasses RLS - use only in API routes/server components

---

## 🔍 Step 6: Verify Setup

### 6.1 Test Database Connection

Run the first migration (see next step) and verify in Supabase Dashboard:
- Go to **Table Editor**
- Confirm `profiles` table exists
- Check **Database** → **Roles** for proper RLS policies

### 6.2 Test Authentication

Once Supabase client utilities are created:

```typescript
// Test file: /app/api/test-supabase/route.ts
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getSession()
  
  return Response.json({ 
    connected: !error,
    hasSession: !!data.session 
  })
}
```

Visit `http://localhost:3000/api/test-supabase` to verify connection.

### 6.3 Test Storage

Create a test upload in the Supabase Dashboard:
1. Go to **Storage** → `avatars`
2. Try uploading an image
3. Verify RLS policies work as expected

---

## 📚 Next Steps

After completing Supabase initialization:

1. ✅ Apply initial database migration (see `/supabase/migrations/`)
2. ✅ Create Supabase client utilities (`/lib/supabase/client.ts`, `server.ts`)
3. ✅ Set up TypeScript types for database schema
4. ✅ Create middleware for auth protection
5. ✅ Move to Phase 1: Authentication & Base Layout

---

## 🔗 Useful Resources

- **Supabase Docs**: https://supabase.com/docs
- **Auth Documentation**: https://supabase.com/docs/guides/auth
- **Row Level Security**: https://supabase.com/docs/guides/auth/row-level-security
- **Storage Guide**: https://supabase.com/docs/guides/storage
- **CLI Reference**: https://supabase.com/docs/reference/cli

---

## 🚨 Security Checklist

Before going to production:

- [ ] Enable email confirmation for signups
- [ ] Configure proper redirect URLs (no wildcards in production)
- [ ] Rotate service role key regularly
- [ ] Enable MFA for Supabase dashboard access
- [ ] Set up database backups
- [ ] Review and test all RLS policies
- [ ] Configure rate limiting on auth endpoints
- [ ] Enable CAPTCHA for signup (optional)

---

**Document Version**: 1.0  
**Last Updated**: November 10, 2025  
**Maintained By**: Gabe Cabrera
