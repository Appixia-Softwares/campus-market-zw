// Update the Supabase client configuration to use environment variables properly
import { createClient } from "@supabase/supabase-js"

// Debug logging for environment variables
console.log('Debug - Environment Variables:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: Missing required Supabase environment variables')
  throw new Error('Missing required Supabase environment variables')
}

// Initialize the client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Only initialize admin client on the server side
let supabaseAdmin: ReturnType<typeof createClient> | null = null

if (typeof window === 'undefined') {
  // Server-side only
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    console.error('Error: Missing SUPABASE_SERVICE_ROLE_KEY for server-side operations')
  } else {
    try {
      supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
      console.log('Debug - Supabase admin client initialized (server-side only)')
    } catch (error) {
      console.error('Debug - Error initializing Supabase admin client:', error)
    }
  }
}

export { supabaseAdmin }

export async function handleSupabaseError<T extends { data: any; error: any }>(promise: Promise<T>) {
  try {
    const { data, error } = await promise
    if (error) {
      console.error('Debug - Supabase operation error:', error)
      throw error
    }
    return { data, error: null }
  } catch (error) {
    console.error("Debug - Supabase error:", error)
    return { data: null, error }
  }
}
