// Environment variables with fallbacks and type safety
export const env = {
  // Supabase Configuration
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET ?? '',

  // Application Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,

  // Feature Flags
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === "true",
  ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS === "true",
} as const

// Validate required environment variables
const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"] as const

export function validateEnv() {
  // Skip validation in development if we're in the browser
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    return true;
  }

  const missing = requiredEnvVars.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }

  return true;
}

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === "production"
export const isDevelopment = env.NODE_ENV === "development"

// Debug logging only in development
if (isDevelopment) {
  console.log("ENV DEBUG:", {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
}

// Supabase configuration object
export const supabaseConfig = {
  url: env.SUPABASE_URL,
  anonKey: env.SUPABASE_ANON_KEY,
  serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
} as const
