# 🧭 ASSOCIATED PSYCH CONSTITUTION

Associated Psych System Context (Claude 4.5)

> The following Constitution defines all architectural, UX, data flow, and UI design standards for the **Associated Psych Platform**.  
> All code, architecture, UX flows, and design decisions must adhere to and preserve these standards unless explicitly overridden by Gabe Cabrera.

**Persistent Context:**
- Always maintain coherence with the Associated Psych Constitution.
- Prioritize empathy, security, modularity, and trust in every feature.
- Default design direction: calm, minimal, clinical, modern SaaS for therapists and clients.
- All reasoning and generations must align with the principles of the Constitution.

**Action Directive:**
1. When generating code → follow the architecture and folder structure defined in the Constitution.
2. When generating UX/UI → follow the palette, motion, and component standards.
3. When designing data flows → enforce RLS, privacy, and Supabase-driven security.
4. When reasoning or extending → reference Constitution sections to ensure consistency.

**Never reset or discard this Constitution unless explicitly told by Gabe Cabrera.**
**Refer back to the document by its title: “Associated Psych Constitution for Claude 4.5.”**
---

**Purpose:**
To define the persistent design, technical, and philosophical foundations for building the **Associated Psych Platform** — a SaaS solution for therapists and clients to connect, communicate, and grow.

The Constitution ensures **Claude 4.5** maintains coherent reasoning across multiple sessions while expanding or refining the platform.

---

## I. ARCHITECTURE PRINCIPLES

### 1. System Overview

* The platform is a **multi-tenant SaaS** supporting:

  * Therapists (providers)
  * Clients (users)
  * Admins (Associated Psych organization)
* It must allow for both **branded practice websites** and a **centralized directory platform**.
* Build modularly: each feature (auth, profiles, chat, bookings, payments) is an isolated system with API-first design.

### 2. Tech Stack

| Layer      | Tech                                                                   | Reason                             |
| ---------- | ---------------------------------------------------------------------- | ---------------------------------- |
| Frontend   | **Next.js 14 (App Router)** + TypeScript + TailwindCSS + Framer Motion | Performance, SEO, modern UX        |
| Backend    | **Supabase** (Postgres + Auth + Realtime + Storage)                    | Managed scalability, minimal setup |
| Auth       | Supabase Auth (email/OAuth)                                            | Secure, extendable                 |
| Messaging  | Supabase Realtime                                                      | Built-in WebSocket channels        |
| Payments   | Stripe                                                                 | Subscription + booking payments    |
| Deployment | Vercel                                                                 | Auto-deploy + SSL + global CDN     |
| Monitoring | Logtail or Sentry                                                      | Error logging and metrics          |

### 3. Folder Structure (Guiding Example)

```
/app
  /components
  /lib
  /styles
  /api
  /therapists
  /clients
  /dashboard
  layout.tsx
  page.tsx
```

### 4. Data Model (Conceptual)

**Entities:**

* `User`: base auth identity (therapist or client)
* `TherapistProfile`: specialization, bio, availability, pricing, contact
* `ClientProfile`: demographics, goals, session history
* `Session`: booking details, therapist_id, client_id, status
* `Message`: real-time chat logs
* `Admin`: system-level controls

Relational schema → enforce referential integrity, role-based access, and privacy.

---

## II. UX DESIGN FLOWS

### 1. Core User Journeys

**Client Flow:**

1. Land on site → view therapists
2. Take optional matching quiz
3. View profile → book consultation
4. Receive confirmation + reminders
5. Secure chat after onboarding

**Therapist Flow:**

1. Sign up → complete profile (photo, bio, license)
2. Set schedule and rates
3. Approve client bookings
4. Conduct sessions + manage follow-ups

**Admin Flow:**

1. Approve therapist accounts
2. Review analytics and disputes
3. Manage billing and directory content

### 2. UX Ethos

* **Empathetic, grounded, secure**
* Reduce cognitive load (calm, clean layouts)
* **No marketing noise**; clarity > conversion
* Use **progressive disclosure** — show details only when needed
* Ensure **100% accessibility (WCAG 2.1)**

---

## III. DATA FLOW & SECURITY

### 1. Principles

* **Least privilege:** users only access their own data
* **Zero-trust mindset:** never assume client-side integrity
* **Auditability:** all sensitive operations logged

### 2. Client–Server Data Flow

1. Frontend → Supabase Auth (login/signup)
2. Auth → generates JWT token → used for secure API access
3. All requests validated by RLS (Row Level Security) policies
4. Real-time messaging via WebSocket channels
5. Sensitive fields (notes, messages) encrypted at rest

### 3. Protection Against Malice

* SQL Injection prevention via parameterized queries
* XSS prevention through Next.js default sanitization
* CSRF tokens for any form submissions
* Rate limiting on public endpoints
* Encrypted at-rest and in-transit data (HTTPS, AES-256)
* Auto logout on inactivity (configurable timeout)
* Therapist verification (license upload & manual approval)

### 4. Backup & Recovery

* Supabase automated daily backups
* Option for encrypted off-site backup (S3)
* Recovery simulation every 90 days

---

## IV. UI STANDARDIZATION

### 1. Brand Identity

* **Palette:**

  * `#E6EEF5` — Background (soft calm)
  * `#1A365D` — Primary (trust, intellect)
  * `#6B8EAE` — Accent (warm professionalism)
  * `#F7FAFC` — White space
  * `#2D3748` — Text (grounded contrast)

* **Typography:**

  * Headings → `Inter`, semibold
  * Body → `Lato`, regular
  * Button text → `Nunito Sans`, medium

* **Iconography:**

  * Use **Lucide Icons** for minimal, modern style

* **Motion:**

  * 200–300ms eased transitions (`ease-in-out`)
  * Use **Framer Motion** for page transitions and modals

### 2. Layout Standards

* **Container Width:** max 1200px
* **Grid:** 12-column responsive
* **Spacing:** 4px scale
* **Buttons:** rounded-xl, shadow-sm, hover-scale
* **Cards:** glassmorphic base, blur-sm, shadow-md

### 3. Component Standards

| Component         | Behavior                           | Example                           |
| ----------------- | ---------------------------------- | --------------------------------- |
| **NavBar**        | Sticks to top, shrinks on scroll   | `/components/ui/navbar.tsx`       |
| **Hero**          | Calm gradient + CTA button         | `/components/sections/hero.tsx`   |
| **TherapistCard** | Photo + name + specialties + CTA   | `/components/therapists/card.tsx` |
| **ChatUI**        | Bubbles, timestamps, read receipts | `/components/chat/chatbox.tsx`    |

---

## V. DESIGN ETHOS & LONG-TERM INTENT

* Every feature should **decrease friction** between care-seeker and care-provider.
* The product is **not just a tool**, but an environment of trust.
* Simplicity, transparency, and reliability are sacred.
* The platform should feel **human, calm, and organized**.

---

## VI. FUTURE EXPANSIONS

* AI-assisted intake form matching clients with therapists
* Analytics dashboard for therapists (session frequency, client retention)
* White-label offering for private practices
* HIPAA-compliant EHR integration via modular API

---

**Final Note:**
Claude 4.5 must preserve and reference this Constitution when reasoning about:

* architectural tradeoffs
* design iterations
* data schema extensions
* and UI/UX improvements

All changes should **preserve alignment with the principles herein** unless explicitly overridden by Gabe.
