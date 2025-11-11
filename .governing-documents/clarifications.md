# 📋 ASSOCIATED PSYCH CONSTITUTION CLARIFICATIONS

> This document provides detailed clarifications and specifications for implementation details referenced in the main Constitution.

---

## 1. FOLDER STRUCTURE (EXPANDED)

### Complete Directory Organization

```
/app
  /(auth)
    /login
    /signup
    /reset-password
  /(dashboard)
    /therapist
      /profile
      /schedule
      /clients
      /analytics
    /client
      /sessions
      /therapists
      /messages
    /admin
      /approvals
      /analytics
      /billing
  /api
    /auth
    /therapists
    /clients
    /sessions
    /messages
    /payments
    /admin
  /therapists
    /[id]
  /about
  /contact
  layout.tsx
  page.tsx
  
/components
  /ui
    /button.tsx
    /card.tsx
    /input.tsx
    /modal.tsx
    /navbar.tsx
    /sidebar.tsx
    /toast.tsx
  /sections
    /hero.tsx
    /features.tsx
    /testimonials.tsx
    /cta.tsx
  /therapists
    /card.tsx
    /profile.tsx
    /schedule-picker.tsx
  /chat
    /chatbox.tsx
    /message-bubble.tsx
    /typing-indicator.tsx
  /forms
    /booking-form.tsx
    /intake-form.tsx
    /profile-form.tsx
    
/lib
  /supabase
    /client.ts
    /server.ts
    /middleware.ts
  /stripe
    /client.ts
    /webhooks.ts
  /utils
    /date.ts
    /validation.ts
    /formatting.ts
  /hooks
    /useAuth.ts
    /useChat.ts
    /useBooking.ts
  /types
    /database.types.ts
    /api.types.ts
    /user.types.ts
  /constants
    /routes.ts
    /config.ts
    
/styles
  globals.css
  
/public
  /images
  /icons
  
/supabase
  /migrations
  /seed.sql
```

### File Naming Conventions
- **Components:** PascalCase for files, named exports (e.g., `Button.tsx` exports `Button`)
- **Utils/Lib:** camelCase for files and exports (e.g., `formatDate.ts` exports `formatDate`)
- **API Routes:** kebab-case folders (e.g., `/api/therapist-profile`)
- **Types:** PascalCase with `.types.ts` suffix

---

## 2. DATA MODEL (DETAILED SCHEMA)

### Core Tables with Full Specifications

#### `users` (Supabase Auth Extended)
```sql
-- Extends auth.users via foreign key
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
  deleted_at TIMESTAMPTZ -- Soft delete
);

CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);
```

#### `therapist_profiles`
```sql
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
  availability_json JSONB, -- Stores weekly schedule
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
```

#### `client_profiles`
```sql
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
```

#### `sessions`
```sql
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
  notes_therapist TEXT, -- Encrypted
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
```

#### `messages`
```sql
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  recipient_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL, -- Encrypted
  read_at TIMESTAMPTZ,
  edited_at TIMESTAMPTZ,
  deleted_by_sender BOOLEAN DEFAULT false,
  deleted_by_recipient BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_unread ON public.messages(recipient_id, read_at) WHERE read_at IS NULL;
```

### Conventions
- **Primary Keys:** Always `id UUID` with `gen_random_uuid()`
- **Foreign Keys:** Named `<table>_id` with proper CASCADE rules
- **Timestamps:** Always include `created_at`, `updated_at`
- **Soft Deletes:** Use `deleted_at TIMESTAMPTZ` for user-facing data
- **Enums:** Use CHECK constraints, not PostgreSQL enums (easier migrations)
- **Indexing:** Index all foreign keys, frequently queried fields, and WHERE clause columns

---

## 3. ROW LEVEL SECURITY (RLS) POLICIES

### Policy Patterns

#### Therapist Profile Access
```sql
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

-- Anyone can view verified therapist profiles
CREATE POLICY "Public can view verified therapists"
ON public.therapist_profiles FOR SELECT
USING (
  verification_status = 'verified' 
  AND is_accepting_clients = true
  AND deleted_at IS NULL
);

-- Admins can view all profiles
CREATE POLICY "Admins can view all therapist profiles"
ON public.therapist_profiles FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

#### Session Access
```sql
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

-- Only therapists can create sessions
CREATE POLICY "Therapists can create sessions"
ON public.sessions FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.therapist_profiles
    WHERE id = therapist_id AND user_id = auth.uid()
  )
);
```

#### Message Privacy
```sql
-- Users can only read messages they sent or received
CREATE POLICY "Users can view own messages"
ON public.messages FOR SELECT
USING (
  sender_id = auth.uid() OR recipient_id = auth.uid()
);

-- Users can only send messages as themselves
CREATE POLICY "Users can send messages"
ON public.messages FOR INSERT
WITH CHECK (sender_id = auth.uid());

-- Users can only update their own sent messages (for edits)
CREATE POLICY "Users can update own sent messages"
ON public.messages FOR UPDATE
USING (sender_id = auth.uid());
```

### Admin Bypass Pattern
```sql
-- Helper function for admin role check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply to any table for admin access
CREATE POLICY "Admins have full access"
ON public.[table_name] FOR ALL
USING (public.is_admin());
```

---

## 4. ENVIRONMENT VARIABLES

### Required Environment Variables

```bash
# .env.example

# ================================
# SUPABASE
# ================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ================================
# STRIPE
# ================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ================================
# APPLICATION
# ================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="Associated Psych"

# ================================
# EMAIL (Optional - via Supabase or SendGrid)
# ================================
SENDGRID_API_KEY=SG...
EMAIL_FROM=noreply@associatedpsych.com

# ================================
# MONITORING
# ================================
SENTRY_DSN=https://...
LOGTAIL_SOURCE_TOKEN=...

# ================================
# ENCRYPTION (for sensitive fields)
# ================================
ENCRYPTION_KEY=your-32-character-encryption-key

# ================================
# SESSION
# ================================
SESSION_TIMEOUT_MINUTES=30
```

### Environment Variable Management
- **Never commit** `.env.local` to version control
- Always maintain `.env.example` with placeholder values
- Use Vercel Environment Variables for production
- Rotate keys quarterly
- Use different keys per environment (dev/staging/prod)

---

## 5. API DESIGN PATTERNS

### REST Conventions

#### Naming
```
GET    /api/therapists              # List all verified therapists
GET    /api/therapists/[id]         # Get specific therapist
POST   /api/therapists              # Create therapist profile
PATCH  /api/therapists/[id]         # Update therapist profile
DELETE /api/therapists/[id]         # Soft delete therapist

GET    /api/sessions                # List user's sessions
POST   /api/sessions                # Create new session
PATCH  /api/sessions/[id]           # Update session
DELETE /api/sessions/[id]/cancel    # Cancel session

POST   /api/messages                # Send message
GET    /api/messages/[conversationId] # Get conversation messages
```

#### Standard Response Format

**Success Response:**
```typescript
{
  success: true,
  data: {
    // Response payload
  },
  meta?: {
    page?: number,
    perPage?: number,
    total?: number
  }
}
```

**Error Response:**
```typescript
{
  success: false,
  error: {
    code: "VALIDATION_ERROR", // Error code for client handling
    message: "User-friendly error message",
    details?: {
      // Field-specific errors for forms
      email: ["Email is required"],
      phone: ["Invalid phone format"]
    }
  }
}
```

#### HTTP Status Codes
- `200` - Success (GET, PATCH)
- `201` - Created (POST)
- `204` - No Content (DELETE)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (business logic error)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

#### Pagination Standard
```typescript
// Query params
?page=1&perPage=20&sortBy=created_at&order=desc

// Response meta
{
  success: true,
  data: [...],
  meta: {
    page: 1,
    perPage: 20,
    total: 156,
    totalPages: 8,
    hasNext: true,
    hasPrev: false
  }
}
```

---

## 6. TESTING STRATEGY

### Testing Pyramid

#### Unit Tests (70%)
**Tool:** Vitest + Testing Library

**Coverage Targets:**
- Utilities: 90%+
- Hooks: 85%+
- Components (logic): 80%+

**Example:**
```typescript
// lib/utils/date.test.ts
import { describe, it, expect } from 'vitest'
import { formatSessionDate } from './date'

describe('formatSessionDate', () => {
  it('formats date correctly for US timezone', () => {
    const date = new Date('2025-01-15T14:00:00Z')
    expect(formatSessionDate(date, 'America/New_York')).toBe('Jan 15, 2025 at 9:00 AM')
  })
})
```

#### Integration Tests (20%)
**Tool:** Playwright or Cypress

**Focus Areas:**
- API routes with database
- Auth flows (signup, login, logout)
- Form submissions
- Real-time messaging

**Example:**
```typescript
// tests/integration/booking.test.ts
test('client can book session with therapist', async ({ page }) => {
  await page.goto('/therapists/123')
  await page.click('[data-testid="book-session"]')
  await page.fill('[name="date"]', '2025-01-15')
  await page.click('[data-testid="submit-booking"]')
  await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
})
```

#### End-to-End Tests (10%)
**Tool:** Playwright

**Critical Paths:**
- Complete client booking flow
- Therapist onboarding
- Payment processing
- Message exchange

### Testing Commands
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:integration": "playwright test",
    "test:e2e": "playwright test --project=e2e"
  }
}
```

---

## 7. ACCESSIBILITY (WCAG 2.1 AA)

### Keyboard Navigation

**Tab Order Rules:**
1. Logical flow: top-to-bottom, left-to-right
2. Skip navigation link at page top
3. Modal traps focus until closed
4. Dropdown menus accessible via arrow keys

**Required Keyboard Shortcuts:**
- `Tab` - Move to next focusable element
- `Shift+Tab` - Move to previous element
- `Enter/Space` - Activate buttons/links
- `Escape` - Close modals/dropdowns
- `Arrow Keys` - Navigate lists/menus

### Screen Reader Requirements

**Every Interactive Element Must Have:**
```tsx
// Good examples
<button aria-label="Close modal">
  <X /> {/* Icon only */}
</button>

<input
  type="text"
  id="email"
  aria-describedby="email-error"
  aria-invalid={hasError}
/>
<span id="email-error" role="alert">{error}</span>

<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="/therapists">Find Therapists</a></li>
  </ul>
</nav>
```

### Focus Management

**Visual Focus Indicators:**
```css
/* globals.css */
*:focus-visible {
  outline: 2px solid #1A365D;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Never use outline: none without replacement */
```

**Focus Trapping in Modals:**
```typescript
// Use focus-trap-react or similar
import FocusTrap from 'focus-trap-react'

export function Modal({ children, onClose }) {
  return (
    <FocusTrap>
      <div role="dialog" aria-modal="true">
        {children}
      </div>
    </FocusTrap>
  )
}
```

### Color Contrast Requirements
- **Normal text:** 4.5:1 minimum
- **Large text (18pt+):** 3:1 minimum
- **UI components:** 3:1 minimum

**Audit Tools:**
- Use axe DevTools browser extension
- Run Lighthouse accessibility audit
- Test with actual screen readers (NVDA, JAWS, VoiceOver)

### Form Accessibility Checklist
- [ ] All inputs have associated `<label>` elements
- [ ] Error messages use `role="alert"` and `aria-describedby`
- [ ] Required fields marked with `aria-required="true"`
- [ ] Form submission errors announced to screen readers
- [ ] Loading states communicated with `aria-busy`
- [ ] Success messages use `role="status"`

---

## 8. HIPAA COMPLIANCE

### Current Platform Status
⚠️ **The platform is NOT currently HIPAA-compliant.**

### What Can Be Stored (Non-HIPAA)
✅ **Permitted:**
- User contact information (name, email, phone)
- Session scheduling data (date, time, duration)
- Public therapist profiles
- Payment transaction records
- General communication preferences

### What CANNOT Be Stored (Protected Health Information)
❌ **Prohibited Without HIPAA Compliance:**
- Detailed therapy session notes containing diagnosis
- Medical history or conditions
- Treatment plans with clinical details
- Prescriptions or medication information
- Insurance claims with diagnostic codes
- Any identifiable health information beyond basic demographics

### Current Data Handling
```typescript
// Example: Session notes are stored but must be generic
interface Session {
  notes_therapist: string // ⚠️ Must be administrative only:
                          // "Client was late", "Rescheduled to next week"
                          // NOT: "Client showed symptoms of..."
  
  notes_client: string    // Client's own notes - outside HIPAA scope
}
```

### Path to HIPAA Compliance (Future)

**Required Changes:**
1. **Business Associate Agreement (BAA)** with:
   - Supabase (they offer BAA)
   - Stripe (they offer BAA)
   - Any other third-party services

2. **Technical Safeguards:**
   - End-to-end encryption for PHI at rest
   - Encrypted database fields using `pgcrypto`
   - Audit logs for all PHI access
   - Automatic session timeout (already planned)
   - Secure video conferencing (BAA-compliant provider like Zoom Healthcare or Doxy.me)

3. **Administrative Safeguards:**
   - HIPAA training for all team members
   - Written policies and procedures
   - Designated Privacy Officer
   - Risk assessment documentation
   - Incident response plan

4. **Physical Safeguards:**
   - Secured development machines
   - No PHI on local environments
   - Secure disposal procedures

### Implementation Roadmap
**Phase 1 (Current):** Non-HIPAA platform for scheduling and communication
**Phase 2 (6-12 months):** HIPAA compliance for clinical notes and EHR integration
**Phase 3 (12-24 months):** Full EHR capabilities with insurance billing

### Interim Solution
Until HIPAA compliance is achieved:
- Therapists must maintain clinical notes in separate HIPAA-compliant systems
- Platform facilitates scheduling, communication, and payment only
- Clear disclaimers about data handling in Terms of Service

---

## 9. ERROR HANDLING PATTERNS

### Client-Side Error Boundaries

```typescript
// components/error-boundary.tsx
'use client'

import { useEffect } from 'react'

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to error monitoring service
    console.error('Error caught by boundary:', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Something went wrong
        </h2>
        <p className="mt-2 text-gray-600">
          We've been notified and are looking into it.
        </p>
        <button
          onClick={reset}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

### API Error Handling

```typescript
// lib/api/client.ts
export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      throw new ApiError(
        data.error.message,
        response.status,
        data.error.code,
        data.error.details
      )
    }

    return data.data
  } catch (error) {
    if (error instanceof ApiError) throw error
    
    // Network or parsing errors
    throw new ApiError(
      'An unexpected error occurred. Please try again.',
      500,
      'NETWORK_ERROR'
    )
  }
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ApiError'
  }
}
```

### User-Facing Error Messages

```typescript
// lib/utils/error-messages.ts
export const ERROR_MESSAGES = {
  // Auth
  'auth/invalid-credentials': 'Invalid email or password.',
  'auth/email-already-exists': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 8 characters.',
  
  // Booking
  'booking/slot-unavailable': 'This time slot is no longer available.',
  'booking/past-date': 'Cannot book sessions in the past.',
  
  // Payment
  'payment/card-declined': 'Your card was declined. Please use a different payment method.',
  'payment/insufficient-funds': 'Insufficient funds. Please use a different payment method.',
  
  // Generic
  'NETWORK_ERROR': 'Unable to connect. Please check your internet connection.',
  'UNKNOWN_ERROR': 'Something went wrong. Please try again.',
}

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES['UNKNOWN_ERROR']
}
```

---

## 10. DEPLOYMENT CHECKLIST

### Pre-Deployment Verification

**Environment:**
- [ ] All environment variables configured in Vercel
- [ ] Database migrations run on production
- [ ] RLS policies enabled on all tables
- [ ] Supabase storage buckets created with correct policies

**Security:**
- [ ] Audit logs enabled
- [ ] Rate limiting configured
- [ ] CORS settings verified
- [ ] CSP headers configured
- [ ] API routes require authentication where needed

**Performance:**
- [ ] Images optimized (Next.js Image component)
- [ ] Database indexes created
- [ ] Supabase connection pooling enabled
- [ ] CDN caching configured

**Monitoring:**
- [ ] Sentry or Logtail configured
- [ ] Uptime monitoring enabled
- [ ] Database backup schedule verified
- [ ] Error alerting configured

**Testing:**
- [ ] All tests passing
- [ ] Lighthouse score > 90
- [ ] Accessibility audit passed
- [ ] Cross-browser testing completed

### Post-Deployment Verification

- [ ] Homepage loads correctly
- [ ] Auth flows work (signup, login, logout)
- [ ] Database connections successful
- [ ] Stripe webhooks receiving events
- [ ] Email notifications sending
- [ ] Real-time messaging functional

---

## 11. CODE QUALITY STANDARDS

### TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### ESLint Rules

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "error",
    "prefer-const": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### Commit Message Convention

```
feat: Add therapist availability calendar
fix: Resolve session booking double-confirmation
docs: Update API documentation for messages endpoint
style: Format code with Prettier
refactor: Simplify authentication logic
test: Add unit tests for date utilities
chore: Update dependencies
```

---

**Document Version:** 1.0  
**Last Updated:** November 10, 2025  
**Maintained By:** Gabe Cabrera
