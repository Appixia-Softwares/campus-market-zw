"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getUserProfile(userId?: string) {
  const supabase = createServerClient()

  if (!userId) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return null
    }

    userId = session.user.id
  }

  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error fetching user profile:", error)
    return null
  }

  return data
}

export async function updateUserProfile(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to update your profile" }
  }

  const fullName = formData.get("fullName") as string
  const username = formData.get("username") as string
  const university = formData.get("university") as string
  const phone = formData.get("phone") as string
  const studentId = formData.get("studentId") as string

  // Check if username is already taken
  if (username) {
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", username)
      .neq("id", session.user.id)
      .single()

    if (existingUser) {
      return { error: "Username is already taken" }
    }
  }

  // Handle avatar upload
  const avatar = formData.get("avatar") as File
  let avatarUrl = null

  if (avatar && avatar.size > 0) {
    const { data: storageData, error: storageError } = await supabase.storage
      .from("avatars")
      .upload(`${session.user.id}/${Date.now()}-${avatar.name}`, avatar, {
        upsert: true,
      })

    if (storageError) {
      return { error: storageError.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(storageData.path)

    avatarUrl = publicUrl
  }

  // Handle verification document upload
  const verificationDoc = formData.get("verificationDocument") as File
  let verificationDocUrl = null

  if (verificationDoc && verificationDoc.size > 0) {
    const { data: storageData, error: storageError } = await supabase.storage
      .from("verification-documents")
      .upload(`${session.user.id}/${Date.now()}-${verificationDoc.name}`, verificationDoc, {
        upsert: true,
      })

    if (storageError) {
      return { error: storageError.message }
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("verification-documents").getPublicUrl(storageData.path)

    verificationDocUrl = publicUrl
  }

  // Update profile
  const updateData: any = {
    full_name: fullName,
    username,
    university,
    phone,
    student_id: studentId,
  }

  if (avatarUrl) {
    updateData.avatar_url = avatarUrl
  }

  if (verificationDocUrl) {
    updateData.verification_document = verificationDocUrl
    updateData.is_verified = false // Reset verification status when new document is uploaded
  }

  const { error } = await supabase.from("profiles").update(updateData).eq("id", session.user.id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/profile")
  return { success: true }
}

export async function getUserListings() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { marketplace: [], accommodation: [] }
  }

  // Get marketplace listings
  const { data: marketplaceListings, error: marketplaceError } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*)
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (marketplaceError) {
    console.error("Error fetching user marketplace listings:", marketplaceError)
  }

  // Get accommodation listings
  const { data: accommodationListings, error: accommodationError } = await supabase
    .from("accommodation_listings")
    .select(`
      *,
      accommodation_images (*)
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (accommodationError) {
    console.error("Error fetching user accommodation listings:", accommodationError)
  }

  return {
    marketplace: marketplaceListings || [],
    accommodation: accommodationListings || [],
  }
}

export async function getAccommodationApplications() {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return []
  }

  // Get applications made by the user
  const { data, error } = await supabase
    .from("accommodation_applications")
    .select(`
      *,
      accommodation_listings (
        id,
        title,
        price,
        type,
        location
      ),
      profiles!accommodation_listings_user_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching accommodation applications:", error)
    return []
  }

  return data
}
