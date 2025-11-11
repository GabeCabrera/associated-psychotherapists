# 🚀 Quick Start: Supabase Setup

**Phase 0, Section 2 - Fast track setup guide**

---

## ⚡ 5-Minute Setup

### 1. Create Supabase Project
```bash
# Go to: https://app.supabase.com
# Click: "New Project"
# Name: associated-psych-dev
# Region: us-east-1 (or closest to you)
# Generate strong database password
```

### 2. Get Credentials
```bash
# Dashboard > Project Settings > API
# Copy these values:
# - Project URL
# - anon/public key  
# - service_role key (keep secret!)
```

### 3. Configure Environment
```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and paste your credentials:
NEXT_PUBLIC_SUPABASE_URL=https://[your-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb...
SUPABASE_SERVICE_ROLE_KEY=eyJhb...
```

### 4. Apply Database Migration
```bash
# Install CLI (if not already)
npm install -g supabase

# Login
supabase login

# Link project (get ref from URL)
supabase link --project-ref [your-project-ref]

# Push migration to create tables
supabase db push
```

### 5. Configure Auth
```bash
# Dashboard > Authentication > Providers > Email
# ✓ Enable Email provider
# ✓ Enable email confirmations

# Dashboard > Authentication > Settings
# Site URL: http://localhost:3000
# Redirect URLs: http://localhost:3000/**
```

### 6. Create Storage Buckets
```bash
# Dashboard > Storage > "New bucket"

# Bucket 1: avatars
# - Public: NO
# - Size limit: 5 MB

# Bucket 2: documents  
# - Public: NO
# - Size limit: 10 MB
```

### 7. Apply Storage Policies
```sql
-- Dashboard > SQL Editor > New query
-- Copy SQL from SUPABASE_SETUP.md Section 4.2
-- Run the queries for both buckets
```

### 8. Verify Setup
```bash
# Start dev server
npm run dev

# Visit: http://localhost:3000
# Check no errors in console

# Optional: View tables in Dashboard > Table Editor
```

---

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] `.env.local` configured with credentials
- [ ] Supabase CLI installed and logged in
- [ ] Project linked via CLI
- [ ] Migration applied (tables visible in Dashboard)
- [ ] Email auth enabled
- [ ] Redirect URLs configured
- [ ] Storage buckets created (`avatars`, `documents`)
- [ ] Storage RLS policies applied
- [ ] Dev server runs without errors

---

## 🆘 Quick Troubleshooting

### "Cannot connect to Supabase"
```bash
# Check credentials in .env.local
# Verify project is not paused (free tier auto-pauses after inactivity)
# Dashboard > General > Resume project
```

### "Migration failed"
```bash
# Check SQL syntax
supabase db push --debug

# Reset and retry
supabase db reset
```

### "Module not found" errors
```bash
# Restart Next.js dev server
# Restart VS Code TypeScript server: Cmd+Shift+P > "TypeScript: Restart TS Server"
```

---

## 📚 Full Documentation

- **Complete setup**: See `SUPABASE_SETUP.md`
- **Migration guide**: See `supabase/README.md`
- **Phase completion**: See `PHASE_0_SECTION_2_COMPLETE.md`

---

## 🎯 What's Next?

After Supabase is set up:

**Option A**: Continue Phase 0
- Section 3: Development Tooling (testing, monitoring)
- Section 4: Core Utilities & Types

**Option B**: Jump to Phase 1
- Authentication & Base Layout
- Build login/signup pages

---

**Ready?** 🚀 Follow the 8 steps above and you're live in 5 minutes!
