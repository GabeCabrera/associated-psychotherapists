/**
 * Supabase Client (Browser)
 * 
 * Creates a Supabase client for use in Client Components and browser contexts.
 * Uses the anon key which respects Row Level Security (RLS) policies.
 * 
 * @see https://supabase.com/docs/guides/auth/server-side/creating-a-client
 */

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/types/database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
