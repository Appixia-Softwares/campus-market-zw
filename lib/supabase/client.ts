import { createClient } from "@supabase/supabase-js"
import type { Database } from "../database.types"
import { env } from "../env"

// Client-side Supabase client using centralized env config
export const createClientComponentClient = () =>
  createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
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
