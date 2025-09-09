import { createBrowserClient } from "@supabase/ssr"

// Singleton pattern for browser client to avoid multiple instances
let supabaseClient = null

// For client-side usage (components, pages)
export function getBrowserSupabase() {
  if (!supabaseClient) {
    supabaseClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  }
  return supabaseClient
}

// Reset client (useful for testing or auth state changes)
export function resetSupabaseClient() {
  supabaseClient = null
}
