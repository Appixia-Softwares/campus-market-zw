// Environment variables with defaults for development
export const env = {
  // Required Supabase variables
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

  // Optional variables with defaults
  VERCEL_URL: process.env.VERCEL_URL || process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000",
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === "true" || false,
  ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS === "true" || false,

  // App configuration
  APP_NAME: "CampusMarket Zimbabwe",
  APP_DESCRIPTION: "Student marketplace for Zimbabwe universities",

  // Feature flags
  FEATURES: {
    analytics: process.env.ENABLE_ANALYTICS === "true",
    notifications: process.env.ENABLE_NOTIFICATIONS === "true",
    realtime: true,
    messaging: true,
  },
} as const

// Validate required environment variables
export function validateEnv() {
  const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY"] as const

  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }

  console.log("✅ Environment variables validated")
  console.log("🔧 App configuration:", {
    name: env.APP_NAME,
    url: env.VERCEL_URL,
    features: env.FEATURES,
  })
}

// Call validation on import
if (typeof window === "undefined") {
  // Only validate on server side to avoid client-side errors
  try {
    if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
      throw new Error("Missing required Supabase environment variables")
    }
    validateEnv()
  } catch (error) {
    console.error("❌ Environment validation failed:", error)
  }
}
