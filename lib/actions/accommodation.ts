"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getAccommodationListings() {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("accommodation_listings")
    .select(`
      *,
      accommodation_images (*),
      accommodation_amenities (*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching accommodation listings:", error)
    return []
  }

  return data
}

export async function getFeaturedAccommodations(limit = 4) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("accommodation_listings")
    .select(`
      *,
      accommodation_images (*),
      profiles!accommodation_listings_user_id_fkey (*)
    `)
    .eq("status", "active")
    .eq("is_verified", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching featured accommodations:", error)
    return []
  }

  return data
}

export async function getAccommodationListing(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("accommodation_listings")
    .select(`
      *,
      accommodation_images (*),
      accommodation_amenities (*),
      accommodation_rules (*),
      profiles!accommodation_listings_user_id_fkey (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching accommodation listing:", error)
    return null
  }

  return data
}

export async function getUserAccommodations(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("accommodation_listings")
    .select(`
      *,
      accommodation_images (*)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user accommodations:", error)
    return []
  }

  return data
}

export async function getUserAccommodationApplications(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("accommodation_applications")
    .select(`
      *,
      accommodation_listings!accommodation_applications_listing_id_fkey (
        *,
        accommodation_images (*)
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user accommodation applications:", error)
    return []
  }

  return data
}

export async function createAccommodationListing(formData: FormData) {
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
  const type = formData.get("type") as string
  const location = formData.get("location") as string
  const availabilityDate = formData.get("availabilityDate") as string
  const amenities = formData.getAll("amenities") as string[]
  const rules = formData.getAll("rules") as string[]

  // Create the listing
  const { data: listing, error } = await supabase
    .from("accommodation_listings")
    .insert({
      title,
      description,
      price,
      type,
      location,
      availability_date: availabilityDate,
      user_id: session.user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Add amenities
  if (amenities && amenities.length > 0) {
    const amenitiesData = amenities.map((amenity) => ({
      listing_id: listing.id,
      amenity,
    }))

    const { error: amenitiesError } = await supabase.from("accommodation_amenities").insert(amenitiesData)

    if (amenitiesError) {
      return { error: amenitiesError.message }
    }
  }

  // Add rules
  if (rules && rules.length > 0) {
    const rulesData = rules.map((rule) => ({
      listing_id: listing.id,
      rule,
    }))

    const { error: rulesError } = await supabase.from("accommodation_rules").insert(rulesData)

    if (rulesError) {
      return { error: rulesError.message }
    }
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
        .from("accommodation-images")
        .upload(`${listing.id}/${image.name}`, image)

      if (storageError) {
        return { error: storageError.message }
      }

      // Get the public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("accommodation-images").getPublicUrl(storageData.path)

      // Save the image reference in the database
      const { error: imageError } = await supabase.from("accommodation_images").insert({
        listing_id: listing.id,
        image_url: publicUrl,
        is_primary: i === 0, // First image is primary
      })

      if (imageError) {
        return { error: imageError.message }
      }
    }
  }

  revalidatePath("/accommodation")
  redirect(`/accommodation/${listing.id}`)
}

export async function applyForAccommodation(listingId: string, formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to apply for accommodation" }
  }

  const message = formData.get("message") as string

  // Check if the user has already applied
  const { data: existingApplication, error: checkError } = await supabase
    .from("accommodation_applications")
    .select("id")
    .eq("listing_id", listingId)
    .eq("user_id", session.user.id)
    .single()

  if (existingApplication) {
    return { error: "You have already applied for this accommodation" }
  }

  // Create the application
  const { error } = await supabase.from("accommodation_applications").insert({
    listing_id: listingId,
    user_id: session.user.id,
    message,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: "Application submitted successfully" }
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to update an application" }
  }

  // Get the application to check ownership
  const { data: application, error: fetchError } = await supabase
    .from("accommodation_applications")
    .select("listing_id")
    .eq("id", applicationId)
    .single()

  if (fetchError || !application) {
    return { error: "Application not found" }
  }

  // Get the listing to check ownership
  const { data: listing, error: listingError } = await supabase
    .from("accommodation_listings")
    .select("user_id")
    .eq("id", application.listing_id)
    .single()

  if (listingError || !listing) {
    return { error: "Listing not found" }
  }

  // Check if the current user is the owner of the listing
  if (listing.user_id !== session.user.id) {
    return { error: "You don't have permission to update this application" }
  }

  // Update the application status
  const { error } = await supabase
    .from("accommodation_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", applicationId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard/accommodation")
  return { success: true }
}

export async function getRecommendedAccommodations(userId: string, limit = 4) {
  const supabase = createServerClient()

  // Get user profile to determine preferences
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("university")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    // Fallback to featured accommodations if we can't get user preferences
    return getFeaturedAccommodations(limit)
  }

  // Get accommodations near the user's university
  const { data, error } = await supabase
    .from("accommodation_listings")
    .select(`
      *,
      accommodation_images (*),
      profiles!accommodation_listings_user_id_fkey (*)
    `)
    .eq("status", "active")
    .eq("is_verified", true)
    .ilike("location", `%${profile.university}%`)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error || !data || data.length === 0) {
    // Fallback to featured accommodations if no matches or error
    return getFeaturedAccommodations(limit)
  }

  return data
}
