import { supabase } from "./supabase"

export async function testSupabaseConnection() {
  try {
    console.log("🔍 Testing Supabase connection...")
    console.log("Environment check:", {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
    })

    // Test basic connectivity
    const { data, error } = await supabase.from("users").select("count").limit(1)

    if (error) {
      console.error("❌ Supabase connection failed:", error)
      return { success: false, error: error.message }
    }

    console.log("✅ Supabase connection successful")
    return { success: true, data }
  } catch (error: any) {
    console.error("❌ Network error:", error)
    return { success: false, error: error.message }
  }
}

export async function ensureUserExists(userId: string, authUser: any) {
  try {
    // First test connection
    const connectionTest = await testSupabaseConnection()
    if (!connectionTest.success) {
      throw new Error(`Connection failed: ${connectionTest.error}`)
    }

    // Check if user exists
    const { data: existingUser, error: checkError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .maybeSingle()

    if (checkError) {
      console.error("Error checking user existence:", checkError)
      throw checkError
    }

    if (existingUser) {
      console.log("User already exists in database")
      return true
    }

    // Create user if doesn't exist
    console.log("Creating new user in database...")
    const newProfile = {
      id: userId,
      full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
      email: authUser.email || "",
      role: "user" as const,
      status: "pending" as const,
      verified: false,
      email_verified: !!authUser.email_confirmed_at,
      phone_verified: false,
    }

    const { data: createdProfile, error: createError } = await supabase
      .from("users")
      .insert(newProfile)
      .select()
      .single()

    if (createError) {
      console.error("Error creating user profile:", createError)
      throw createError
    }

    console.log("✅ User profile created successfully")
    return true
  } catch (error) {
    console.error("❌ Error ensuring user exists:", error)
    throw error
  }
}
