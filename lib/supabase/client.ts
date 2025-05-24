import { createClient } from "@supabase/supabase-js"
import type { Database } from "../database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const createClientComponentClient = () =>
  createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

// Single client instance for browser
let clientInstance: ReturnType<typeof createClientComponentClient> | null = null

export const supabase = (() => {
  if (!clientInstance) {
    clientInstance = createClientComponentClient()
  }
  return clientInstance
})()

export default supabase
