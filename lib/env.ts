// Environment variables configuration and validation
export const env = {
  // Supabase Configuration
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET!,

  // PostgreSQL Configuration
  POSTGRES_URL: process.env.POSTGRES_URL!,
  POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL!,
  POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING!,
  POSTGRES_USER: process.env.POSTGRES_USER!,
  POSTGRES_HOST: process.env.POSTGRES_HOST!,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD!,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE!,

  // Application Configuration
  NODE_ENV: process.env.NODE_ENV || "development",
  VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,

  // Feature Flags
  ENABLE_ANALYTICS: process.env.ENABLE_ANALYTICS === "true",
  ENABLE_NOTIFICATIONS: process.env.ENABLE_NOTIFICATIONS === "true",
} as const

// Validate required environment variables
const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY", "POSTGRES_URL"] as const

export function validateEnv() {
  const missing = requiredEnvVars.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`)
  }
}

// Helper to check if we're in production
export const isProduction = env.NODE_ENV === "production"
export const isDevelopment = env.NODE_ENV === "development"

// Database connection string selector
export function getDatabaseUrl() {
  if (isProduction) {
    return env.POSTGRES_URL
  }
  return env.POSTGRES_PRISMA_URL || env.POSTGRES_URL
}

// Supabase configuration object
export const supabaseConfig = {
  url: env.SUPABASE_URL,
  anonKey: env.SUPABASE_ANON_KEY,
  serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
} as const
