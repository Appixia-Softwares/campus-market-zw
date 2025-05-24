// Update the Supabase client configuration to use environment variables properly
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/lib/database.types'

// Debug logging for environment variables
console.log('Debug - Environment Variables:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set')
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not Set')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('Debug - Supabase Configuration:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  isClient: typeof window !== 'undefined'
})

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Initialize the client-side Supabase client with enhanced session handling
export const supabase = createBrowserClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined
    }
  }
)

// Test the connection only on the client side
if (typeof window !== 'undefined') {
  void (async () => {
    try {
      const { data, error } = await supabase.from('universities').select('count').single()
      console.log('Debug - Supabase connection test:', { data, error })
    } catch (error: unknown) {
      console.error('Debug - Supabase connection test failed:', error)
    }
  })()
}

export async function handleSupabaseError<T extends { data: any; error: any }>(promise: Promise<T>) {
  try {
    const { data, error } = await promise
    if (error) {
      console.error('Debug - Supabase operation error:', error)
      console.error('Debug - Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })
      throw error
    }
    return { data, error: null }
  } catch (error) {
    console.error("Debug - Supabase error:", error)
    return { data: null, error }
  }
}
