import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Single client instance for browser with better configuration
let clientInstance: ReturnType<typeof createClient<Database>> | null = null

export const supabase = (() => {
  if (!clientInstance) {
    clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      global: {
        headers: {
          "X-Client-Info": "campusmarket-web",
        },
      },
      db: {
        schema: "public",
      },
    })
    console.log("✅ Created Supabase client")
  }
  return clientInstance
})()

// Enhanced connection test with retry logic
export async function testConnection(retries = 3): Promise<{ success: boolean; error?: string }> {
  for (let i = 0; i < retries; i++) {
    try {
      // Test with a simple auth check first
      const { data, error } = await supabase.auth.getUser()

      if (error && error.message !== "Auth session missing!") {
        if (i === retries - 1) {
          return { success: false, error: error.message }
        }
        continue
      }

      // If auth works, test database connection
      const { data: testData, error: dbError } = await supabase.from("users").select("count").limit(1).maybeSingle()

      if (dbError) {
        if (i === retries - 1) {
          return { success: false, error: dbError.message }
        }
        continue
      }

      return { success: true }
    } catch (error: any) {
      if (i === retries - 1) {
        return { success: false, error: error.message || "Network error" }
      }
      // Wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
    }
  }

  return { success: false, error: "Max retries exceeded" }
}

export default supabase
