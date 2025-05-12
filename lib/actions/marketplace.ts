"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function getMarketplaceListings(options?: {
  countryId?: string
  cityId?: string
  universityId?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  condition?: string
  search?: string
  limit?: number
  offset?: number
}) {
  const supabase = createServerClient()

  let query = supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  // Apply filters if provided
  if (options) {
    if (options.countryId) {
      query = query.eq("country_id", options.countryId)
    }

    if (options.cityId) {
      query = query.eq("city_id", options.cityId)
    }

    if (options.universityId) {
      query = query.eq("university_id", options.universityId)
    }

    if (options.category) {
      query = query.eq("category", options.category)
    }

    if (options.minPrice !== undefined) {
      query = query.gte("price", options.minPrice)
    }

    if (options.maxPrice !== undefined) {
      query = query.lte("price", options.maxPrice)
    }

    if (options.condition) {
      query = query.eq("condition", options.condition)
    }

    if (options.search) {
      query = query.textSearch("title", options.search, {
        config: "english",
      })
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
    }
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching marketplace listings:", error)
    return []
  }

  // Fetch user data separately
  if (data && data.length > 0) {
    const userIds = [...new Set(data.map((listing) => listing.user_id))]
    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").in("id", userIds)

    if (!profilesError && profiles) {
      // Create a map of user profiles
      const profileMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile
        return acc
      }, {})

      // Add profile data to listings
      data.forEach((listing) => {
        listing.profile = profileMap[listing.user_id] || null
      })
    }
  }

  return data
}

export async function getFeaturedListings(limit = 4) {
  return getMarketplaceListings({ limit })
}

export async function getMarketplaceListing(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching marketplace listing:", error)
    return null
  }

  // Fetch user data separately
  if (data) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user_id)
      .single()

    if (!profileError && profile) {
      data.profile = profile
    }

    // Fetch country, city, university, currency data if available
    if (data.country_id) {
      const { data: country } = await supabase.from("countries").select("*").eq("id", data.country_id).single()

      if (country) {
        data.country = country
      }
    }

    if (data.city_id) {
      const { data: city } = await supabase.from("cities").select("*").eq("id", data.city_id).single()

      if (city) {
        data.city = city
      }
    }

    if (data.university_id) {
      const { data: university } = await supabase.from("universities").select("*").eq("id", data.university_id).single()

      if (university) {
        data.university = university
      }
    }

    if (data.currency_id) {
      const { data: currency } = await supabase.from("currencies").select("*").eq("id", data.currency_id).single()

      if (currency) {
        data.currency = currency
      }
    }
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

  // New fields
  const countryId = formData.get("countryId") as string
  const cityId = formData.get("cityId") as string
  const universityId = formData.get("universityId") as string
  const currencyId = formData.get("currencyId") as string
  const languageId = formData.get("languageId") as string

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
      country_id: countryId || null,
      city_id: cityId || null,
      university_id: universityId || null,
      currency_id: currencyId || null,
      language_id: languageId || null,
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

export async function searchMarketplaceListings(query: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.rpc("search_marketplace_listings", {
    search_query: query,
  })

  if (error) {
    console.error("Error searching marketplace listings:", error)
    return []
  }

  // Fetch images for each listing
  if (data && data.length > 0) {
    const listingIds = data.map((listing) => listing.id)

    const { data: images } = await supabase.from("marketplace_images").select("*").in("listing_id", listingIds)

    if (images) {
      // Group images by listing_id
      const imagesByListing = images.reduce((acc, img) => {
        if (!acc[img.listing_id]) {
          acc[img.listing_id] = []
        }
        acc[img.listing_id].push(img)
        return acc
      }, {})

      // Add images to each listing
      data.forEach((listing) => {
        listing.marketplace_images = imagesByListing[listing.id] || []
      })
    }

    // Fetch user profiles
    const userIds = [...new Set(data.map((listing) => listing.user_id))]

    const { data: profiles } = await supabase.from("profiles").select("*").in("id", userIds)

    if (profiles) {
      // Create a map of profiles by user_id
      const profileMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile
        return acc
      }, {})

      // Add profile to each listing
      data.forEach((listing) => {
        listing.profile = profileMap[listing.user_id] || null
      })
    }
  }

  return data
}

export async function getRecommendedListings(userId: string, limit = 4) {
  const supabase = createServerClient()

  // Get user profile to determine preferences
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("country_id, city_id, university_id")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    // Fallback to featured listings if we can't get user preferences
    return getFeaturedListings(limit)
  }

  // Get listings based on user's location preferences
  let query = supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (profile.university_id) {
    query = query.eq("university_id", profile.university_id)
  } else if (profile.city_id) {
    query = query.eq("city_id", profile.city_id)
  } else if (profile.country_id) {
    query = query.eq("country_id", profile.country_id)
  }

  const { data, error } = await query

  if (error || !data || data.length === 0) {
    // Fallback to featured listings if no matches or error
    return getFeaturedListings(limit)
  }

  // Fetch user data separately
  if (data && data.length > 0) {
    const userIds = [...new Set(data.map((listing) => listing.user_id))]
    const { data: profiles, error: profilesError } = await supabase.from("profiles").select("*").in("id", userIds)

    if (!profilesError && profiles) {
      // Create a map of user profiles
      const profileMap = profiles.reduce((acc, profile) => {
        acc[profile.id] = profile
        return acc
      }, {})

      // Add profile data to listings
      data.forEach((listing) => {
        listing.profile = profileMap[listing.user_id] || null
      })
    }
  }

  return data
}
