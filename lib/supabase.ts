// Update the Supabase client configuration to use environment variables properly
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Server-side client with service role key
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function handleSupabaseError<T extends { data: any; error: any }>(promise: Promise<T>) {
  try {
    const { data, error } = await promise
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Supabase error:", error)
    return { data: null, error }
  }
}
