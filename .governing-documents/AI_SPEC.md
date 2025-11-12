# AI DEVELOPMENT SPECIFICATION

**PURPOSE:** Machine-readable development spec for AI-driven code generation
**USAGE:** Reference this file FIRST for all implementation decisions
**VERSION:** 2.0 (AI-Optimized)

---

## 🎯 QUICK REFERENCE

### Tech Stack (Locked)
```yaml
framework: Next.js 14 (App Router)
language: TypeScript (strict mode)
database: Supabase (Postgres + Auth + Realtime + Storage)
styling: TailwindCSS
animation: Framer Motion
icons: Lucide React
payments: Stripe
deployment: Vercel
```

### Design Tokens
```typescript
// Copy-paste ready constants
export const DESIGN_TOKENS = {
  colors: {
    background: '#E6EEF5',
    primary: '#1A365D',
    accent: '#6B8EAE',
    white: '#F7FAFC',
    text: '#2D3748',
  },
  typography: {
    heading: 'Inter, sans-serif',
    body: 'Lato, sans-serif',
    button: 'Nunito Sans, sans-serif',
  },
  motion: {
    duration: '200-300ms',
    easing: 'ease-in-out',
  },
  spacing: {
    scale: 4, // 4px base unit
  },
  layout: {
    maxWidth: '1200px',
    gridColumns: 12,
  },
} as const;
```

### File Structure Pattern
```
app/
  /(auth)/          → login, signup, reset-password
  /(dashboard)/     → role-based dashboards
  /api/             → API routes (REST)
  /therapists/      → public pages
components/
  /ui/              → base components (shadcn/ui)
  /sections/        → page sections
  /therapists/      → domain components
  /chat/            → chat components
  /forms/           → form components
lib/
  /supabase/        → DB clients
  /stripe/          → payment logic
  /utils/           → pure functions
  /hooks/           → React hooks
  /types/           → TypeScript types
  /constants/       → app constants
```

---

## 📦 PREBUILT LIBRARIES (USE THESE)

### UI Components - shadcn/ui
**Installation:** `npx shadcn-ui@latest init`
**Why:** Radix UI primitives + TailwindCSS, fully customizable, accessible

**Components to Install:**
```bash
# Core UI
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add form
npx shadcn-ui@latest add label
npx shadcn-ui@latest add textarea

# Advanced
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
```

**Customization Required:**
```typescript
// components/ui/button.tsx - Update variants to match design tokens
const buttonVariants = cva(
  "...",
  {
    variants: {
      variant: {
        default: "bg-[#1A365D] text-white hover:bg-[#1A365D]/90",
        accent: "bg-[#6B8EAE] text-white hover:bg-[#6B8EAE]/90",
        // ...
      }
    }
  }
)
```

### Forms - React Hook Form + Zod
```bash
npm install react-hook-form zod @hookform/resolvers
```

**Pattern:**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Date/Time - date-fns
```bash
npm install date-fns date-fns-tz
```

**Why:** Lightweight, tree-shakable, better than moment/dayjs
**Usage:** All date formatting, timezone handling, calendar logic

### Calendar/Scheduling - react-big-calendar
```bash
npm install react-big-calendar
```

**Why:** Battle-tested, customizable, works with date-fns

### Tables - @tanstack/react-table
```bash
npm install @tanstack/react-table
```

**Why:** Headless, powerful, works with shadcn/ui patterns

### Charts - Recharts
```bash
npm install recharts
```

**Why:** Simple, React-native, good for admin dashboards

### Real-time - Supabase Client (built-in)
**No additional library needed** - use `supabase.channel()`

### Authentication - Supabase Auth (built-in)
**No additional library needed** - use `supabase.auth`

### File Upload - react-dropzone
```bash
npm install react-dropzone
```

**Why:** Accessible, mobile-friendly, drag-drop support

### Rich Text (if needed) - Tiptap
```bash
npm install @tiptap/react @tiptap/starter-kit
```

**Why:** Headless, extensible, modern (avoid Draft.js)

---

## 🗄️ DATABASE SCHEMA (COPY-PASTE READY)

### Core Tables SQL

```sql
-- Run these migrations in order

-- 1. Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('therapist', 'client', 'admin')),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Therapist Profiles
CREATE TABLE public.therapist_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  license_number VARCHAR(50) NOT NULL,
  license_state VARCHAR(2) NOT NULL,
  license_verified BOOLEAN DEFAULT false,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  years_experience INTEGER,
  education TEXT,
  approach TEXT,
  rate_per_session DECIMAL(10,2),
  accepts_insurance BOOLEAN DEFAULT false,
  insurance_providers TEXT[],
  availability_json JSONB,
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  video_intro_url TEXT,
  website_url TEXT,
  is_accepting_clients BOOLEAN DEFAULT true,
  verification_status VARCHAR(20) DEFAULT 'pending' 
    CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_therapist_specializations ON public.therapist_profiles USING GIN(specializations);
CREATE INDEX idx_therapist_verification ON public.therapist_profiles(verification_status);

ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Therapists can view own profile"
  ON public.therapist_profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Public can view verified therapists"
  ON public.therapist_profiles FOR SELECT
  USING (verification_status = 'verified' AND is_accepting_clients = true AND deleted_at IS NULL);

-- 3. Client Profiles
CREATE TABLE public.client_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  date_of_birth DATE,
  gender VARCHAR(50),
  preferred_pronouns VARCHAR(50),
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  insurance_provider VARCHAR(255),
  insurance_member_id VARCHAR(100),
  goals TEXT,
  previous_therapy BOOLEAN,
  preferred_communication VARCHAR(20) DEFAULT 'video' 
    CHECK (preferred_communication IN ('video', 'phone', 'chat', 'in-person')),
  timezone VARCHAR(50) DEFAULT 'America/New_York',
  intake_completed BOOLEAN DEFAULT false,
  intake_completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own profile"
  ON public.client_profiles FOR SELECT
  USING (user_id = auth.uid());

-- 4. Sessions
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.therapist_profiles(id),
  client_id UUID NOT NULL REFERENCES public.client_profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 50,
  session_type VARCHAR(20) DEFAULT 'video' 
    CHECK (session_type IN ('video', 'phone', 'in-person')),
  status VARCHAR(20) DEFAULT 'scheduled' 
    CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show')),
  meeting_url TEXT,
  notes_therapist TEXT,
  notes_client TEXT,
  amount_charged DECIMAL(10,2),
  payment_status VARCHAR(20) DEFAULT 'pending' 
    CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
  stripe_payment_intent_id VARCHAR(255),
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES public.profiles(id),
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_sessions_therapist ON public.sessions(therapist_id, scheduled_at);
CREATE INDEX idx_sessions_client ON public.sessions(client_id, scheduled_at);
CREATE INDEX idx_sessions_status ON public.sessions(status);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.client_profiles
      WHERE id = client_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Therapists can view own sessions"
  ON public.sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.therapist_profiles
      WHERE id = therapist_id AND user_id = auth.uid()
    )
  );

-- 5. Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  edited_at TIMESTAMPTZ,
  deleted_by_sender BOOLEAN DEFAULT false,
  deleted_by_recipient BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_unread ON public.messages(recipient_id, read_at) WHERE read_at IS NULL;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages"
  ON public.messages FOR SELECT
  USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());
```

---

## 🔌 API PATTERNS (COPY-PASTE READY)

### Standard API Route Template

```typescript
// app/api/[resource]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Standard response type
type ApiResponse<T> = {
  success: true;
  data: T;
  meta?: {
    page?: number;
    perPage?: number;
    total?: number;
  };
} | {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

// GET handler with pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Auth check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        } satisfies ApiResponse<never>,
        { status: 401 }
      );
    }

    // Query params
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '20');
    const from = (page - 1) * perPage;
    const to = from + perPage - 1;

    // Query
    const { data, error, count } = await supabase
      .from('resource')
      .select('*', { count: 'exact' })
      .range(from, to);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      data,
      meta: {
        page,
        perPage,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / perPage),
      },
    } satisfies ApiResponse<typeof data>);
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}

// POST handler with validation
const createSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
        } satisfies ApiResponse<never>,
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = createSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: validation.error.flatten().fieldErrors,
          },
        } satisfies ApiResponse<never>,
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('resource')
      .insert(validation.data)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        data,
      } satisfies ApiResponse<typeof data>,
      { status: 201 }
    );
    
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to create resource' },
      } satisfies ApiResponse<never>,
      { status: 500 }
    );
  }
}
```

### Supabase Client Setup

```typescript
// lib/supabase/client.ts (Client Component)
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const createClient = () => createClientComponentClient();

// lib/supabase/server.ts (Server Component)
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createClient = () => createServerComponentClient({ cookies });

// lib/supabase/middleware.ts (Middleware)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}
```

---

## 🎨 COMPONENT PATTERNS

### Page Layout Template
```typescript
// app/(dashboard)/therapist/profile/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/forms/profile-form';

export default async function TherapistProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('therapist_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-semibold mb-6">Your Profile</h1>
      <ProfileForm initialData={profile} />
    </div>
  );
}
```

### Form Component Template
```typescript
// components/forms/profile-form.tsx
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const formSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be less than 500 characters'),
  rate_per_session: z.number().positive(),
});

type FormData = z.infer<typeof formSchema>;

export function ProfileForm({ initialData }: { initialData?: Partial<FormData> }) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  async function onSubmit(data: FormData) {
    try {
      const response = await fetch('/api/therapists/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error.message);
      }

      toast({
        title: 'Profile updated',
        description: 'Your changes have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to update profile',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </Form>
  );
}
```

---

## 🚀 INITIALIZATION COMMANDS

### Project Setup (Run Once)
```bash
# 1. Create Next.js project
npx create-next-app@14 . --typescript --tailwind --app --src-dir=false --import-alias="@/*"

# 2. Install core dependencies
npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
npm install framer-motion lucide-react
npm install react-hook-form zod @hookform/resolvers
npm install date-fns date-fns-tz
npm install stripe @stripe/stripe-js

# 3. Install shadcn/ui
npx shadcn-ui@latest init
# Select: Default style, Zinc color, CSS variables

# 4. Install shadcn components
npx shadcn-ui@latest add button input card dialog dropdown-menu select toast form label textarea calendar popover tabs avatar badge separator

# 5. Dev dependencies
npm install -D @types/node vitest @testing-library/react @testing-library/jest-dom
npm install -D prettier eslint-config-prettier
npm install -D @playwright/test

# 6. Initialize Supabase (if using local dev)
npx supabase init
npx supabase start
```

### Environment Variables
```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🎯 AI DECISION MATRIX

### When building a component, choose:

| Need | Use | Why |
|------|-----|-----|
| Button | shadcn/ui `<Button>` | Pre-styled, accessible, customizable |
| Form | react-hook-form + zod | Type-safe, performant, integrates with shadcn |
| Modal/Dialog | shadcn/ui `<Dialog>` | Built on Radix, focus trap, animations |
| Date picker | shadcn/ui `<Calendar>` | Works with date-fns, accessible |
| Dropdown | shadcn/ui `<DropdownMenu>` | Keyboard nav, positioning |
| Toast/Notification | shadcn/ui `<Toast>` | Non-blocking, accessible |
| Table | @tanstack/react-table + shadcn | Sorting, filtering, pagination |
| Auth | Supabase Auth | Built-in RLS, social providers |
| Real-time | Supabase Realtime | WebSocket, auto-reconnect |
| File upload | react-dropzone | Drag-drop, mobile, accessible |
| Icons | lucide-react | Tree-shakable, consistent |
| Animation | Framer Motion | Spring physics, gestures |
| Charts | Recharts | Simple, composable |

### When implementing a feature, follow:

1. **Check if prebuilt solution exists** (shadcn, Supabase feature, etc.)
2. **Copy-paste from AI_SPEC.md** (this file)
3. **Customize design tokens only** (colors, fonts, spacing)
4. **Never rewrite from scratch** what exists in a library

---

## ⚡ OPTIMIZATION RULES

### Performance
- Use Next.js `<Image>` for all images
- Lazy load heavy components with `dynamic(() => import())`
- Use React Server Components by default
- Only use `'use client'` when needed (hooks, events, browser APIs)
- Index all foreign keys in database
- Use Supabase connection pooling (PgBouncer)

### Security
- **Always enable RLS** on every table
- **Never trust client input** - validate server-side
- Use Supabase Auth, not custom JWT
- Store sensitive data encrypted (use `pgcrypto`)
- Rate limit all public API routes

### Accessibility
- Use semantic HTML (`<button>`, `<nav>`, `<main>`)
- Add `aria-label` to icon-only buttons
- Ensure 4.5:1 color contrast
- Test with keyboard only (no mouse)
- Use shadcn/ui components (built-in accessibility)

### Code Quality
- Enable TypeScript `strict` mode
- Never use `any` type
- Validate all forms with Zod
- Write tests for utils and hooks (70% coverage target)
- Use Prettier for formatting

---

## 📋 PROJECT PHASES (AI REFERENCE)

### Phase 0: Foundation (Week 1-2)
- Run initialization commands above
- Set up folder structure
- Create design tokens file
- Initialize Supabase project
- Run database migrations

### Phase 1: Auth (Week 3-4)
- Use Supabase Auth (no custom logic)
- Copy API templates from this file
- Use shadcn forms for login/signup
- Implement middleware for protected routes

### Phase 2: Profiles (Week 5-7)
- Run database migrations for profiles
- Use ProfileForm template above
- Use react-dropzone for avatar upload
- Use shadcn `<Badge>` for verification status

### Phase 3: Discovery (Week 8-9)
- Use @tanstack/react-table for listing
- Use shadcn `<Select>` for filters
- Implement pagination from API template

### Phase 4: Booking (Week 10-12)
- Use react-big-calendar for schedule view
- Use shadcn `<Calendar>` for date picker
- Use date-fns for timezone handling

### Phase 5: Messaging (Week 13-15)
- Use Supabase Realtime channels
- Use shadcn `<ScrollArea>` for message list
- Use Framer Motion for message animations

### Phase 6: Payments (Week 16-18)
- Use Stripe Checkout (not custom flow)
- Use Stripe Connect for therapist payouts
- Copy webhook handler template

### Phase 7: Admin (Week 19-20)
- Use Recharts for analytics
- Use @tanstack/react-table for user management
- Copy admin RLS policies from database migrations

---

## 🔍 QUICK LOOKUP

**Need database schema?** → Section: DATABASE SCHEMA (COPY-PASTE READY)
**Need API route?** → Section: API PATTERNS (COPY-PASTE READY)
**Need component pattern?** → Section: COMPONENT PATTERNS
**Need to choose library?** → Section: AI DECISION MATRIX
**Need design tokens?** → Section: QUICK REFERENCE → Design Tokens
**Need installation commands?** → Section: INITIALIZATION COMMANDS

---

**Document Version:** 2.0 (AI-Optimized)
**Last Updated:** November 11, 2025
**Maintained By:** Gabe Cabrera
