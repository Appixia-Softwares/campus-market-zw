"use server"

import { createServerClient, createServiceClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signUp(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string
    const countryId = formData.get("countryId") as string
    const cityId = formData.get("cityId") as string
    const universityId = formData.get("universityId") as string

    // Validate required fields
    if (!email || !password || !fullName) {
      return { error: "Please fill in all required fields" }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { error: "Please enter a valid email address" }
    }

    // Validate password strength
    if (password.length < 6) {
      return { error: "Password must be at least 6 characters long" }
    }

    const supabase = createServerClient()
    const serviceClient = createServiceClient()

    // Check if email already exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (existingUser?.user) {
      return { error: "An account with this email already exists" }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    // Create profile using service client to bypass RLS
    if (data.user) {
      const { error: profileError } = await serviceClient.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        country_id: countryId || null,
        city_id: cityId || null,
        university_id: universityId || null,
        role: "student", // Default role
        is_verified: false, // Needs verification
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      })

      if (profileError) {
        // If profile creation fails, delete the auth user
        await supabase.auth.admin.deleteUser(data.user.id)
        return { error: "Failed to create profile. Please try again." }
      }
    }

    return { 
      success: true, 
      message: "Account created successfully! Please check your email to confirm your account." 
    }
  } catch (error) {
    console.error("Signup error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Please fill in all fields" }
    }

    const supabase = createServerClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return { error: "Invalid email or password" }
      }
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Sign in error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signOut() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function getSession() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getUserProfile() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  if (error || !data) {
    return null
  }

  return data
}

export async function updateUserProfile(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return { error: "You must be logged in to update your profile" }
  }

  const fullName = formData.get("fullName") as string
  const username = formData.get("username") as string
  const phone = formData.get("phone") as string
  const avatarFile = formData.get("avatar") as File

  // New fields
  const countryId = formData.get("countryId") as string
  const cityId = formData.get("cityId") as string
  const universityId = formData.get("universityId") as string
  const currencyId = formData.get("currencyId") as string
  const languageId = formData.get("languageId") as string
  const timezone = formData.get("timezone") as string

  let avatarUrl = null

  // Upload avatar if provided
  if (avatarFile && avatarFile.size > 0) {
    const fileExt = avatarFile.name.split(".").pop()
    const fileName = `${session.user.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatarFile, { upsert: true })

    if (uploadError) {
      return { error: uploadError.message }
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(fileName)
    avatarUrl = data.publicUrl
  }

  // Update profile
  const updateData: any = {
    full_name: fullName,
    username,
    phone,
    updated_at: new Date().toISOString(),
  }

  if (avatarUrl) {
    updateData.avatar_url = avatarUrl
  }

  // Add new fields if they exist
  if (countryId) updateData.country_id = countryId
  if (cityId) updateData.city_id = cityId
  if (universityId) updateData.university_id = universityId
  if (currencyId) updateData.preferred_currency_id = currencyId
  if (languageId) updateData.preferred_language_id = languageId
  if (timezone) updateData.timezone = timezone

  const { error } = await supabase.from("profiles").update(updateData).eq("id", session.user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function verifyStudent(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return { error: "You must be logged in to verify your account" }
  }

  const studentId = formData.get("studentId") as string
  const universityId = formData.get("universityId") as string
  const verificationFile = formData.get("verificationDocument") as File

  if (!verificationFile || verificationFile.size === 0) {
    return { error: "Please upload a verification document" }
  }

  // Upload verification document
  const fileExt = verificationFile.name.split(".").pop()
  const fileName = `${session.user.id}/verification.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from("verification-documents")
    .upload(fileName, verificationFile, { upsert: true })

  if (uploadError) {
    return { error: uploadError.message }
  }

  const { data } = supabase.storage.from("verification-documents").getPublicUrl(fileName)
  const verificationDocUrl = data.publicUrl

  // Update profile
  const { error } = await supabase
    .from("profiles")
    .update({
      student_id: studentId,
      university_id: universityId || null,
      verification_document: verificationDocUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/profile")
  return { success: true, message: "Verification document submitted successfully. It will be reviewed by an admin." }
}
