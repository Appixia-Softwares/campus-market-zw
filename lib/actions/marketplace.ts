"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getMarketplaceListings() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*),
      profiles!marketplace_listings_user_id_fkey (*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching marketplace listings:", error)
    return []
  }

  return data
}

export async function getFeaturedListings(limit = 4) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*),
      profiles!marketplace_listings_user_id_fkey (*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured listings:", error)
    return []
  }

  return data
}

export async function getMarketplaceListing(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*),
      profiles!marketplace_listings_user_id_fkey (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching marketplace listing:", error)
    return null
  }

  return data
}

export async function getUserListings(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user listings:", error)
    return []
  }

  return data
}

export async function createMarketplaceListing(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to create a listing" }
  }

  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const price = Number.parseFloat(formData.get("price") as string)
  const condition = formData.get("condition") as string
  const category = formData.get("category") as string
  const location = formData.get("location") as string

  // Create the listing
  const { data: listing, error } = await supabase
    .from("marketplace_listings")
    .insert({
      title,
      description,
      price,
      condition,
      category,
      location,
      user_id: session.user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Handle image uploads
  const images = formData.getAll("images") as File[]

  if (images && images.length > 0) {
    for (let i = 0; i < images.length; i++) {
      const image = images[i]

      // Skip if the image is empty (no file selected)
      if (image.size === 0) continue

      // Upload the image to storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("marketplace-images")
        .upload(`${listing.id}/${image.name}`, image)

      if (storageError) {
        return { error: storageError.message }
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("marketplace-images").getPublicUrl(storageData.path)

      // Save the image reference in the database
      const { error: imageError } = await supabase.from("marketplace_images").insert({
        listing_id: listing.id,
        image_url: publicUrl,
        is_primary: i === 0, // First image is primary
      })

      if (imageError) {
        return { error: imageError.message }
      }
    }
  }

  revalidatePath("/marketplace")
  redirect(`/marketplace/${listing.id}`)
}

export async function getRecommendedListings(userId: string, limit = 4) {
  const supabase = createServerClient()

  // Get user profile to determine preferences
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("university")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    // Fallback to featured listings if we can't get user preferences
    return getFeaturedListings(limit)
  }

  // Get listings near the user's university
  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*),
      profiles!marketplace_listings_user_id_fkey (*)
    `)
    .eq("status", "active")
    .ilike("location", `%${profile.university}%`)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error || !data || data.length === 0) {
    // Fallback to featured listings if no matches or error
    return getFeaturedListings(limit)
  }

  return data
}
