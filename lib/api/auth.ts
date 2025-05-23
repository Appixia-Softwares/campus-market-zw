import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type UserInsert = Database["public"]["Tables"]["users"]["Insert"]

export async function signUp(
  email: string,
  password: string,
  userData: {
    full_name: string
    university_id?: string
  },
) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    return { data: null, error: authError }
  }

  if (authData.user) {
    // Create user profile
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        full_name: userData.full_name,
        email: email,
        university_id: userData.university_id,
        role: "user",
        status: "pending",
      })
      .select()
      .single()

    if (profileError) {
      return { data: null, error: profileError }
    }

    return { data: { user: authData.user, profile: profileData }, error: null }
  }

  return { data: authData, error: null }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: authError }
  }

  const { data: profile, error: profileError } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (profileError) {
    return { data: null, error: profileError }
  }

  return { data: { user, profile }, error: null }
}

export async function updateUserProfile(userId: string, updates: Partial<UserInsert>) {
  const { data, error } = await supabase.from("users").update(updates).eq("id", userId).select().single()

  return { data, error }
}

export async function getUniversities() {
  const { data, error } = await supabase.from("universities").select("*").order("name")

  return { data, error }
}
