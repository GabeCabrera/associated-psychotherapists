# Associated Psych Platform

A SaaS solution for therapists and clients to connect, communicate, and grow.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend:** Supabase (Postgres + Auth + Realtime + Storage)
- **Payments:** Stripe
- **Deployment:** Vercel
- **UI Libraries:** Framer Motion, Lucide Icons

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account
- Stripe account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

3. Copy `.env.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/components` - React components organized by type
- `/lib` - Utilities, hooks, types, and integrations
- `/public` - Static assets
- `/supabase` - Database migrations and seed data
- `/.governing-documents` - Project constitution and guidelines

## Development

### Code Quality

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Format
npm run format
```

## Documentation

- **Constitution:** `.governing-documents/constitution.md`
- **Clarifications:** `.governing-documents/clarifications.md`
- **Development Plan:** `.governing-documents/plan.md`
- **Rules:** `.governing-documents/.cursorrules`

## License

Proprietary - Associated Psych © 2025
