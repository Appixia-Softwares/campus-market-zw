"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import { updateUserProfile } from "@/lib/api/auth"
import type { Database } from "@/lib/database.types"

type UserUpdate = Database["public"]["Tables"]["users"]["Update"]

export async function updateProfileAction(userId: string, formData: FormData) {
  try {
    const full_name = formData.get("full_name") as string
    const phone = formData.get("phone") as string
    const bio = formData.get("bio") as string
    const university_id = formData.get("university_id") as string
    const website = formData.get("website") as string

    const userData: UserUpdate = {
      full_name,
      phone,
      bio,
      university_id: university_id || null,
      website: website || null,
      updated_at: new Date().toISOString(),
    }

    // Handle avatar upload
    const avatar = formData.get("avatar") as File
    if (avatar && avatar.size > 0) {
      const fileExt = avatar.name.split(".").pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(fileName, avatar)

      if (uploadError) {
        console.error("Error uploading avatar:", uploadError)
      } else {
        const { data: publicUrl } = supabase.storage.from("avatars").getPublicUrl(fileName)

        userData.avatar_url = publicUrl.publicUrl
      }
    }

    const { data, error } = await updateUserProfile(userId, userData)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/profile")
    revalidatePath("/dashboard")

    return { success: true, data }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function uploadVerificationDocumentAction(userId: string, formData: FormData) {
  try {
    const document_type = formData.get("document_type") as string
    const document = formData.get("document") as File

    if (!document || document.size === 0) {
      return { success: false, error: "No document provided" }
    }

    const fileExt = document.name.split(".").pop()
    const fileName = `${userId}/${document_type}_${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage.from("verification-documents").upload(fileName, document)

    if (uploadError) {
      console.error("Error uploading document:", uploadError)
      return { success: false, error: "Failed to upload document" }
    }

    const { data: publicUrl } = supabase.storage.from("verification-documents").getPublicUrl(fileName)

    // Create verification request
    const { data, error } = await supabase
      .from("verification_requests")
      .insert({
        user_id: userId,
        document_type,
        document_url: publicUrl.publicUrl,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/profile")

    return { success: true, data }
  } catch (error) {
    console.error("Error uploading verification document:", error)
    return { success: false, error: "Failed to upload document" }
  }
}
