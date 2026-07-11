import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// When unconfigured the app renders a setup notice instead of crashing —
// see AuthProvider. Copy .env.example to .env.local to configure.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)

// Anon-key browser client. RLS is the security boundary — the service key
// must never appear anywhere in this codebase (Master Document §8).
export const supabase = createClient(
  supabaseUrl ?? 'http://not-configured.localhost',
  supabaseAnonKey ?? 'not-configured',
)
