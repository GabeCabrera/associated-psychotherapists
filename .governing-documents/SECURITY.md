# SECURITY SPECIFICATION

**PURPOSE:** Security patterns, RLS policies, auth flows for Associated Psych Platform
**AUDIENCE:** AI agents implementing authentication, authorization, and data protection
**VERSION:** 2.0

---

## 🔐 SECURITY PRINCIPLES

1. **Zero Trust** → Validate everything server-side
2. **Least Privilege** → Users access only their own data
3. **RLS First** → Enforce at database level, not application
4. **Audit Everything** → Log all sensitive operations
5. **Encrypt Sensitive Data** → Notes, messages, PHI

---

## 🔑 AUTHENTICATION (Supabase Auth)

### Setup (Copy-Paste Ready)

**Supabase Client (Client Component):**
```typescript
// lib/supabase/client.ts
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/lib/types/database.types';

export const createClient = () => createClientComponentClient<Database>();
```

**Supabase Client (Server Component):**
```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/types/database.types';

export const createClient = () => createServerComponentClient<Database>({ cookies });
```

**Middleware (Route Protection):**
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if no session
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Redirect to dashboard if logged in and accessing auth pages
  if (session && (req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/signup'))) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/dashboard';
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/api/:path*',
  ],
};
```

### Auth Hook (Copy-Paste Ready)

```typescript
// lib/hooks/useAuth.ts
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User, Session } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return {
    user,
    session,
    loading,
    signOut,
    isAuthenticated: !!user,
  };
}
```

### Login/Signup Patterns

**Login:**
```typescript
// app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: 'Login failed',
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-background">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-heading font-semibold">Welcome Back</h1>
          <p className="text-gray-600 font-body">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

**Signup with Role Selection:**
```typescript
// app/(auth)/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/components/ui/use-toast';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'therapist' | 'client'>('client');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (authError) {
      toast({
        title: 'Signup failed',
        description: authError.message,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    // 2. Create profile (via trigger or API call)
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          full_name: fullName,
          role,
        });

      if (profileError) {
        toast({
          title: 'Profile creation failed',
          description: profileError.message,
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      // 3. Create role-specific profile
      if (role === 'therapist') {
        await supabase.from('therapist_profiles').insert({
          user_id: authData.user.id,
          license_number: '',
          license_state: '',
        });
      } else {
        await supabase.from('client_profiles').insert({
          user_id: authData.user.id,
        });
      }

      toast({
        title: 'Account created',
        description: 'Please check your email to verify your account.',
      });

      router.push('/dashboard');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-background">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-8 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-heading font-semibold">Create Account</h1>
          <p className="text-gray-600 font-body">Join Associated Psych</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label>I am a...</Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as 'therapist' | 'client')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="client" id="client" />
                <Label htmlFor="client" className="font-normal cursor-pointer">
                  Client (seeking therapy)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="therapist" id="therapist" />
                <Label htmlFor="therapist" className="font-normal cursor-pointer">
                  Therapist (providing services)
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <p className="text-sm text-gray-500">Minimum 8 characters</p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
```

---

## 🛡️ ROW LEVEL SECURITY (RLS) POLICIES

### RLS Pattern Template

```sql
-- Step 1: Enable RLS
ALTER TABLE public.table_name ENABLE ROW LEVEL SECURITY;

-- Step 2: Create policies
CREATE POLICY "policy_name"
ON public.table_name
FOR SELECT | INSERT | UPDATE | DELETE
USING (condition)       -- For SELECT/UPDATE/DELETE
WITH CHECK (condition); -- For INSERT/UPDATE
```

### Complete RLS Policies (Copy-Paste Ready)

**Profiles:**
```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

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
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

**Therapist Profiles:**
```sql
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;

-- Therapists can view their own profile
CREATE POLICY "Therapists can view own profile"
ON public.therapist_profiles FOR SELECT
USING (user_id = auth.uid());

-- Therapists can update their own profile
CREATE POLICY "Therapists can update own profile"
ON public.therapist_profiles FOR UPDATE
USING (user_id = auth.uid());

-- Anyone can view verified therapists
CREATE POLICY "Public can view verified therapists"
ON public.therapist_profiles FOR SELECT
USING (
  verification_status = 'verified' 
  AND is_accepting_clients = true
  AND deleted_at IS NULL
);

-- Admins can do everything
CREATE POLICY "Admins full access to therapist profiles"
ON public.therapist_profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

**Client Profiles:**
```sql
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

-- Clients can view their own profile
CREATE POLICY "Clients can view own profile"
ON public.client_profiles FOR SELECT
USING (user_id = auth.uid());

-- Clients can update their own profile
CREATE POLICY "Clients can update own profile"
ON public.client_profiles FOR UPDATE
USING (user_id = auth.uid());

-- Therapists can view their clients' profiles (only if they have a session together)
CREATE POLICY "Therapists can view client profiles of their clients"
ON public.client_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.sessions s
    JOIN public.therapist_profiles tp ON s.therapist_id = tp.id
    WHERE tp.user_id = auth.uid() AND s.client_id = client_profiles.id
  )
);

-- Admins can do everything
CREATE POLICY "Admins full access to client profiles"
ON public.client_profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

**Sessions:**
```sql
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- Clients can view their own sessions
CREATE POLICY "Clients can view own sessions"
ON public.sessions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.client_profiles
    WHERE id = client_id AND user_id = auth.uid()
  )
);

-- Therapists can view their sessions
CREATE POLICY "Therapists can view own sessions"
ON public.sessions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.therapist_profiles
    WHERE id = therapist_id AND user_id = auth.uid()
  )
);

-- Only clients can create sessions (book appointments)
CREATE POLICY "Clients can create sessions"
ON public.sessions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.client_profiles
    WHERE id = client_id AND user_id = auth.uid()
  )
);

-- Therapists and clients can update their own sessions
CREATE POLICY "Therapists can update own sessions"
ON public.sessions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.therapist_profiles
    WHERE id = therapist_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Clients can update own sessions"
ON public.sessions FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.client_profiles
    WHERE id = client_id AND user_id = auth.uid()
  )
);

-- Admins can do everything
CREATE POLICY "Admins full access to sessions"
ON public.sessions FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

**Messages:**
```sql
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can only read messages they sent or received
CREATE POLICY "Users can view own messages"
ON public.messages FOR SELECT
USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Users can only send messages as themselves
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (sender_id = auth.uid());

-- Users can only update their own sent messages (for editing)
CREATE POLICY "Users can update own sent messages"
ON public.messages FOR UPDATE
USING (sender_id = auth.uid());

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
ON public.messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

### Helper Functions for RLS

```sql
-- Check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is therapist
CREATE OR REPLACE FUNCTION public.is_therapist()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'therapist'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is client
CREATE OR REPLACE FUNCTION public.is_client()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'client'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 🔒 DATA ENCRYPTION

### Sensitive Fields (Use pgcrypto)

**Setup:**
```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

**Encrypt/Decrypt Functions:**
```sql
-- Function to encrypt text
CREATE OR REPLACE FUNCTION encrypt_text(text_to_encrypt TEXT, encryption_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(
    pgp_sym_encrypt(text_to_encrypt, encryption_key),
    'base64'
  );
END;
$$ LANGUAGE plpgsql;

-- Function to decrypt text
CREATE OR REPLACE FUNCTION decrypt_text(encrypted_text TEXT, encryption_key TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN pgp_sym_decrypt(
    decode(encrypted_text, 'base64'),
    encryption_key
  );
END;
$$ LANGUAGE plpgsql;
```

**Usage in Application:**
```typescript
// lib/utils/encryption.ts
import { createClient } from '@/lib/supabase/server';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;

export async function encryptField(text: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('encrypt_text', {
    text_to_encrypt: text,
    encryption_key: ENCRYPTION_KEY,
  });

  if (error) throw error;
  return data;
}

export async function decryptField(encryptedText: string): Promise<string> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc('decrypt_text', {
    encrypted_text: encryptedText,
    encryption_key: ENCRYPTION_KEY,
  });

  if (error) throw error;
  return data;
}
```

**Fields to Encrypt:**
- `sessions.notes_therapist` (clinical notes)
- `messages.content` (message content)
- Any other PHI/sensitive data

---

## 🚨 HIPAA COMPLIANCE STATUS

### ⚠️ CURRENT STATUS: NOT HIPAA COMPLIANT

**What can be stored:**
✅ Contact info (name, email, phone)
✅ Session scheduling (date, time, duration)
✅ Public therapist profiles
✅ Payment records
✅ Non-clinical communication

**What CANNOT be stored (without HIPAA compliance):**
❌ Clinical diagnosis
❌ Detailed therapy session notes
❌ Medical history
❌ Treatment plans
❌ Prescriptions
❌ Insurance claims with diagnostic codes

### Path to HIPAA Compliance (Future Phase)

**Required:**
1. **Business Associate Agreements (BAA):**
   - Supabase (available)
   - Stripe (available)
   - Any other third parties

2. **Technical Safeguards:**
   - ✅ Encryption at rest (pgcrypto)
   - ✅ Encryption in transit (HTTPS)
   - ✅ Audit logs
   - ✅ Session timeout
   - ⏳ BAA-compliant video provider (Zoom Healthcare, Doxy.me)

3. **Administrative:**
   - ⏳ HIPAA training
   - ⏳ Written policies
   - ⏳ Privacy Officer
   - ⏳ Risk assessment
   - ⏳ Incident response plan

4. **Physical:**
   - ⏳ Secured development machines
   - ⏳ No PHI on local environments

**Implementation Timeline:**
- Phase 1 (Current): Non-clinical platform
- Phase 2 (6-12 months): HIPAA compliance
- Phase 3 (12-24 months): Full EHR capabilities

---

## 📊 AUDIT LOGGING

### Audit Log Table

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action VARCHAR(50) NOT NULL, -- 'create', 'update', 'delete', 'view'
  table_name VARCHAR(50) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_table ON public.audit_logs(table_name, record_id);
```

### Audit Log Trigger (Auto-logging)

```sql
-- Function to log updates
CREATE OR REPLACE FUNCTION log_audit()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.audit_logs (
    user_id,
    action,
    table_name,
    record_id,
    old_values,
    new_values
  ) VALUES (
    auth.uid(),
    TG_OP,
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to sensitive tables
CREATE TRIGGER audit_therapist_profiles
AFTER INSERT OR UPDATE OR DELETE ON public.therapist_profiles
FOR EACH ROW EXECUTE FUNCTION log_audit();

CREATE TRIGGER audit_sessions
AFTER INSERT OR UPDATE OR DELETE ON public.sessions
FOR EACH ROW EXECUTE FUNCTION log_audit();
```

---

## 🔐 SECURITY CHECKLIST

### Before Deploying Any Feature:

**Authentication:**
- [ ] Routes protected with middleware
- [ ] API endpoints check `auth.uid()`
- [ ] Session timeout configured (30 min default)
- [ ] Logout clears all client state

**Authorization:**
- [ ] RLS policies enabled on ALL tables
- [ ] Policies tested with different user roles
- [ ] No data leakage between users
- [ ] Admin-only functions properly protected

**Data Protection:**
- [ ] Sensitive fields encrypted (notes, messages)
- [ ] No PHI stored (unless HIPAA compliant)
- [ ] Soft delete used (no hard deletes)
- [ ] Audit logs created for sensitive operations

**Input Validation:**
- [ ] All inputs validated server-side
- [ ] Zod schemas for all forms
- [ ] SQL injection prevented (using Supabase client)
- [ ] XSS prevented (React escapes by default)

**API Security:**
- [ ] Rate limiting on public endpoints
- [ ] CORS configured properly
- [ ] Error messages don't leak sensitive info
- [ ] No API keys in client code

---

**Document Version:** 2.0
**Last Updated:** November 11, 2025
**Maintained By:** Gabe Cabrera
