import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Create a single instance of the client to be used across the client components
let clientInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (clientInstance) return clientInstance

  clientInstance = createClientComponentClient<Database>()
  return clientInstance
}
