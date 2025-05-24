import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with the service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function POST(request: Request) {
  try {
    const { email, password, full_name, university_id } = await request.json()

    // Validate required fields
    if (!email || !password || !full_name) {
      return NextResponse.json({ error: "Email, password, and full name are required" }, { status: 400 })
    }

    console.log("Debug - Starting signup process for:", email)

    // Step 1: Create auth user using admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for development
      user_metadata: {
        full_name,
        university_id,
      },
    })

    if (authError) {
      console.error("Debug - Auth signup error:", authError)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authData.user) {
      console.error("Debug - No user data returned from auth signup")
      return NextResponse.json({ error: "Failed to create user account" }, { status: 400 })
    }

    console.log("Debug - Auth user created successfully:", authData.user.id)

    // Step 2: Create user profile using admin client (bypasses RLS)
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from("users")
      .insert({
        id: authData.user.id,
        full_name,
        email,
        university_id: university_id || null,
        role: "user",
        status: "active", // Set to active instead of pending
        verified: false,
        email_verified: true, // Auto-verify for development
        phone_verified: false,
      })
      .select(`
        *,
        university:universities(
          id,
          name,
          location,
          abbreviation
        )
      `)
      .single()

    if (profileError) {
      console.error("Debug - Profile creation error:", profileError)

      // Clean up auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        console.log("Debug - Cleaned up auth user after profile creation failure")
      } catch (cleanupError) {
        console.error("Debug - Error during cleanup:", cleanupError)
      }

      return NextResponse.json({ error: `Profile creation failed: ${profileError.message}` }, { status: 400 })
    }

    console.log("Debug - User profile created successfully:", profileData.id)

    // Step 3: Create a session for the user (optional, for immediate login)
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: "signup",
      email,
      password,
    })

    if (sessionError) {
      console.warn("Debug - Session creation warning:", sessionError)
      // Don't fail the signup if session creation fails
    }

    return NextResponse.json({
      success: true,
      message: "Account created successfully! You can now log in.",
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
      profile: profileData,
    })
  } catch (error: any) {
    console.error("Debug - Unexpected error in signup:", error)
    return NextResponse.json({ error: error.message || "An unexpected error occurred during signup" }, { status: 500 })
  }
}
