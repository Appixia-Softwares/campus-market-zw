import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"
import { env, validateEnv } from "./env"

// Create Supabase client with proper configuration
export const supabase = createClient<Database>(
  env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
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
    global: {
      headers: {
        "X-Client-Info": "campus-market-zw",
      },
    },
  }
)

// Add ensureEnv function with better error handling
export function ensureEnv() {
  try {
    return validateEnv();
  } catch (error) {
    console.warn('Environment validation failed:', error);
    // In development, we'll continue even if validation fails
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    throw error;
  }
}

// Test connection function with better error handling
export async function testConnection(timeout = 5000): Promise<{ success: boolean; error?: string }> {
  try {
    ensureEnv();
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    const { data, error } = await supabase.from("users").select("count").limit(1).abortSignal(controller.signal)

    clearTimeout(timeoutId)

    if (error) {
      console.error("Supabase connection test failed:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Supabase connection test error:", error)
    return {
      success: false,
      error: error.name === "AbortError" ? "Connection timeout" : error.message,
    }
  }
}

// Health check function with better error handling
export async function healthCheck() {
  try {
    ensureEnv();
    const { data, error } = await supabase.from("users").select("count").limit(1)

    return {
      database: !error,
      auth: !!supabase.auth,
      realtime: !!supabase.realtime,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    return {
      database: false,
      auth: false,
      realtime: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

export default supabase
