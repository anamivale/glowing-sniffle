// lib/supabaseClient.js
import { createBrowserClient } from "@supabase/ssr"

// For client-side usage (components, pages)
export function getBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}
