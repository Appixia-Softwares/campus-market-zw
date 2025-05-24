import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Create a singleton browser client
let clientInstance: ReturnType<typeof createBrowserClient<Database>> | null = null

export function createClient() {
  if (typeof window === "undefined") {
    // Server-side: always create a new instance
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
  }

  // Client-side: use singleton
  if (!clientInstance) {
    clientInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }

  return clientInstance
}

// Export the client instance
export const supabase = createClient()
