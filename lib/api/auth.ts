import { supabase } from "@/lib/supabase"

interface SignUpData {
  full_name: string
  university_id?: string
}

interface AuthError {
  message: string
  code?: string
  details?: string
  hint?: string
}

interface AuthResponse<T> {
  data: T | null
  error: AuthError | null
}

export async function signUp(
  email: string,
  password: string,
  data: SignUpData,
): Promise<AuthResponse<{ user: any; profile: any }>> {
  try {
    console.log("Debug - Starting signup process with data:", { email, ...data })

    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        full_name: data.full_name,
        university_id: data.university_id,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error("Debug - Signup error:", result.error)
      return { data: null, error: { message: result.error } }
    }

    console.log("Debug - Signup successful:", result)
    return { data: result, error: null }
  } catch (error: any) {
    console.error("Debug - Unexpected error in signup:", error)
    return {
      data: null,
      error: {
        message: error.message || "An unexpected error occurred during signup",
      },
    }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse<{ user: any; session: any }>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data, error: null }
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || "An unexpected error occurred during sign in",
      },
    }
  }
}

export async function signOut(): Promise<AuthResponse<null>> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      return { data: null, error: { message: error.message } }
    }
    return { data: null, error: null }
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || "An unexpected error occurred during sign out",
      },
    }
  }
}

export async function getCurrentUser(): Promise<AuthResponse<{ user: any; profile: any }>> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      return { data: null, error: { message: userError.message } }
    }

    if (!user) {
      return { data: null, error: null }
    }

    // Fetch user profile from our users table with university info
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select(`
        *,
        university:universities(
          id,
          name,
          location,
          abbreviation
        )
      `)
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Debug - Profile fetch error:", profileError)
      return { data: null, error: { message: profileError.message } }
    }

    return {
      data: {
        user,
        profile,
      },
      error: null,
    }
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || "An unexpected error occurred while getting user data",
      },
    }
  }
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<{
    full_name: string
    university_id: string
    status: string
    verified: boolean
  }>,
): Promise<AuthResponse<{ profile: any }>> {
  try {
    const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

    if (error) {
      return { data: null, error: { message: error.message } }
    }

    return { data: { profile: data }, error: null }
  } catch (error: any) {
    return {
      data: null,
      error: {
        message: error.message || "An unexpected error occurred while updating profile",
      },
    }
  }
}

export async function getUniversities(): Promise<AuthResponse<Array<{ id: string; name: string; location: string }>>> {
  try {
    console.log("Debug - Starting to fetch universities")

    // First, let's check if we can access the table at all
    const { count, error: countError } = await supabase.from("universities").select("*", { count: "exact", head: true })

    console.log("Debug - Count query result:", { count, error: countError })

    if (countError) {
      console.error("Debug - Error getting count:", countError)
      return { data: null, error: { message: countError.message } }
    }

    // Now try to get the actual data
    const { data, error } = await supabase.from("universities").select("id, name, location").order("name")

    console.log("Debug - Data query result:", { data, error })

    if (error) {
      console.error("Debug - Error fetching universities:", error)
      return { data: null, error: { message: error.message } }
    }

    if (!data || data.length === 0) {
      console.log("Debug - No universities found in database")
      return { data: [], error: null }
    }

    console.log("Debug - Successfully fetched universities:", data.length)
    console.log("Debug - First university:", data[0])
    return { data, error: null }
  } catch (error: any) {
    console.error("Debug - Unexpected error fetching universities:", error)
    console.error("Debug - Error stack:", error.stack)
    return {
      data: null,
      error: {
        message: error.message || "An unexpected error occurred while fetching universities",
      },
    }
  }
}
