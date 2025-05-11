"use server"

import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const university = formData.get("university") as string

  const supabase = createServerClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: {
        full_name: fullName,
        university: university,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create profile
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      university,
      role: "student", // Default role
      is_verified: false, // Needs verification
    })

    if (profileError) {
      return { error: profileError.message }
    }
  }

  return { success: true, message: "Check your email to confirm your account" }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = createServerClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
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
  const university = formData.get("university") as string
  const phone = formData.get("phone") as string
  const avatarFile = formData.get("avatar") as File

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
    university,
    phone,
    updated_at: new Date().toISOString(),
  }

  if (avatarUrl) {
    updateData.avatar_url = avatarUrl
  }

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
