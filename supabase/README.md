# Database Migrations Guide

This directory contains SQL migration files for the Associated Psych Platform database schema.

## 📂 Structure

```
/supabase
  /migrations
    20250110000000_initial_schema.sql
    [timestamp]_[description].sql
  seed.sql (optional)
```

## 🚀 Quick Start

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link to Your Project

```bash
# Get your project ref from Supabase Dashboard > Project Settings > General
supabase link --project-ref [your-project-ref]
```

### 4. Apply Migrations

```bash
# Push all migrations to remote database
supabase db push

# This will:
# - Connect to your remote Supabase project
# - Apply all migration files in order
# - Create tables, indexes, policies, etc.
```

## 📝 Creating New Migrations

### Method 1: Manual Creation

```bash
# Create a new migration file
supabase migration new add_sessions_table

# This creates: /supabase/migrations/[timestamp]_add_sessions_table.sql
# Edit the file with your SQL changes
```

### Method 2: Generate from DB Changes

```bash
# Make changes via Supabase Dashboard SQL Editor
# Then pull changes into a migration file
supabase db pull
```

## ✅ Migration Best Practices

### 1. Always Use Timestamps
- Migration files are run in alphabetical order
- Timestamp format: `YYYYMMDDHHMMSS`
- Example: `20250110143000_add_messages_table.sql`

### 2. Include Rollback Instructions
```sql
-- Migration: Add sessions table
-- Rollback: DROP TABLE IF EXISTS public.sessions CASCADE;

CREATE TABLE public.sessions (...);
```

### 3. Test Locally First
```bash
# Start local Supabase (requires Docker)
supabase start

# Apply migrations locally
supabase db reset

# Verify everything works
# Then push to remote
supabase db push
```

### 4. Never Modify Existing Migrations
- Once a migration is applied, never edit it
- Create a new migration to make changes
- Example: `20250110150000_update_sessions_add_notes.sql`

## 🗄️ Current Schema

### Tables Created by Initial Migration

#### `profiles`
Base user profiles extending Supabase Auth
- Links to `auth.users` via foreign key
- Stores role (therapist/client/admin)
- Soft delete support

#### `therapist_profiles`
Extended profile for therapist users
- License information
- Specializations
- Availability
- Verification status

#### `client_profiles`
Extended profile for client users
- Demographics
- Preferences
- Insurance information
- Intake status

### Functions
- `is_admin()`: Check if current user has admin role
- `handle_updated_at()`: Auto-update timestamp trigger

### RLS Policies
All tables have Row Level Security enabled with policies for:
- Users viewing their own data
- Public viewing verified therapist profiles
- Admin access to all records

## 🔍 Verification Commands

### Check Applied Migrations
```bash
# View migration history
supabase migration list
```

### View Current Schema
```bash
# Generate types from current schema
supabase gen types typescript --local > lib/types/database.types.ts
```

### Inspect Database
```bash
# Open local Studio
supabase start
# Visit: http://localhost:54323

# Or use psql
supabase db psql
```

## 🧪 Testing Migrations

### Test Queries

```sql
-- Check tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check policies created
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Check triggers
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_schema = 'public';
```

## 🐛 Troubleshooting

### Migration Failed
```bash
# View detailed error
supabase db push --debug

# Reset local database and try again
supabase db reset
```

### Schema Drift
```bash
# Compare local vs remote
supabase db diff

# Pull remote changes
supabase db pull
```

### Connection Issues
```bash
# Verify connection
supabase status

# Re-link project
supabase link --project-ref [your-project-ref]
```

## 📚 Resources

- [Supabase CLI Docs](https://supabase.com/docs/reference/cli)
- [Database Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)

## 🔐 Security Notes

- **Never commit** `.env.local` with real credentials
- **Service role key** bypasses RLS - use with extreme caution
- **Always test RLS policies** before deploying
- **Backup database** before major schema changes
- **Review SQL** in migration files for security issues

## 📞 Need Help?

- Check `SUPABASE_SETUP.md` for detailed setup instructions
- Review `constitution.md` for architecture decisions
- See `clarifications.md` Section 2 for schema details

---

**Last Updated**: November 10, 2025
