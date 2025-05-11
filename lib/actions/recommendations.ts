"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getPersonalizedRecommendations(userId: string, limit = 8) {
  const supabase = createServerClient()

  if (!userId) {
    return {
      marketplace: [],
      accommodation: [],
    }
  }

  // Get user profile to determine preferences
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("university, interests, location")
    .eq("id", userId)
    .single()

  if (profileError) {
    console.error("Error fetching user profile:", profileError)
    return {
      marketplace: [],
      accommodation: [],
    }
  }

  // Get user's past interactions
  const { data: orders } = await supabase.from("orders").select("listing_id").eq("buyer_id", userId)

  const purchasedListingIds = orders?.map((order) => order.listing_id) || []

  // Get user's viewed items (assuming you have a table tracking this)
  const { data: viewedItems } = await supabase
    .from("user_views")
    .select("item_id, item_type")
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false })
    .limit(10)

  const viewedMarketplaceIds =
    viewedItems?.filter((item) => item.item_type === "marketplace").map((item) => item.item_id) || []

  const viewedAccommodationIds =
    viewedItems?.filter((item) => item.item_type === "accommodation").map((item) => item.item_id) || []

  // Get categories of items the user has interacted with
  const { data: interactedListings } = await supabase
    .from("marketplace_listings")
    .select("category")
    .in("id", [...purchasedListingIds, ...viewedMarketplaceIds])

  const preferredCategories = interactedListings?.map((listing) => listing.category).filter(Boolean) || []

  // Build recommendation queries
  // 1. Location-based recommendations
  const locationQuery = profile.location || profile.university || ""

  // 2. Category-based recommendations
  const categoryFilter = preferredCategories.length > 0 ? preferredCategories : ["books", "electronics", "furniture"] // Default popular categories

  // Get marketplace recommendations
  const { data: marketplaceRecs, error: marketplaceError } = await supabase
    .from("marketplace_listings")
    .select(`
      *,
      marketplace_images (*),
      profiles!marketplace_listings_user_id_fkey (*)
    `)
    .eq("status", "active")
    .not("id", "in", `(${[...purchasedListingIds, ...viewedMarketplaceIds].join(",")})`)
    .or(`location.ilike.%${locationQuery}%,category.in.(${categoryFilter.join(",")})`)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (marketplaceError) {
    console.error("Error fetching marketplace recommendations:", marketplaceError)
  }

  // Get accommodation recommendations
  const { data: accommodationRecs, error: accommodationError } = await supabase
    .from("accommodation_listings")
    .select(`
      *,
      accommodation_images (*),
      accommodation_amenities (*),
      profiles!accommodation_listings_user_id_fkey (*)
    `)
    .eq("status", "active")
    .not("id", "in", `(${viewedAccommodationIds.join(",")})`)
    .or(`location.ilike.%${locationQuery}%`)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (accommodationError) {
    console.error("Error fetching accommodation recommendations:", accommodationError)
  }

  // If we don't have enough recommendations, get some popular items
  if (!marketplaceRecs || marketplaceRecs.length < limit / 2) {
    const { data: popularMarketplace } = await supabase
      .from("marketplace_listings")
      .select(`
        *,
        marketplace_images (*),
        profiles!marketplace_listings_user_id_fkey (*)
      `)
      .eq("status", "active")
      .not("id", "in", `(${[...purchasedListingIds, ...viewedMarketplaceIds].join(",")})`)
      .order("views", { ascending: false })
      .limit(limit - (marketplaceRecs?.length || 0))

    if (popularMarketplace) {
      marketplaceRecs?.push(...popularMarketplace)
    }
  }

  if (!accommodationRecs || accommodationRecs.length < limit / 2) {
    const { data: popularAccommodation } = await supabase
      .from("accommodation_listings")
      .select(`
        *,
        accommodation_images (*),
        accommodation_amenities (*),
        profiles!accommodation_listings_user_id_fkey (*)
      `)
      .eq("status", "active")
      .not("id", "in", `(${viewedAccommodationIds.join(",")})`)
      .order("views", { ascending: false })
      .limit(limit - (accommodationRecs?.length || 0))

    if (popularAccommodation) {
      accommodationRecs?.push(...popularAccommodation)
    }
  }

  return {
    marketplace: marketplaceRecs || [],
    accommodation: accommodationRecs || [],
  }
}

// Track user views for better recommendations
export async function trackUserView(userId: string, itemId: string, itemType: "marketplace" | "accommodation") {
  if (!userId) return { success: false }

  const supabase = createServerClient()

  // Increment view count on the listing
  if (itemType === "marketplace") {
    await supabase
      .from("marketplace_listings")
      .update({ views: supabase.rpc("increment", { x: 1 }) })
      .eq("id", itemId)
  } else {
    await supabase
      .from("accommodation_listings")
      .update({ views: supabase.rpc("increment", { x: 1 }) })
      .eq("id", itemId)
  }

  // Record the view in user_views table
  const { error } = await supabase.from("user_views").upsert(
    {
      user_id: userId,
      item_id: itemId,
      item_type: itemType,
      viewed_at: new Date().toISOString(),
    },
    {
      onConflict: "user_id,item_id,item_type",
      ignoreDuplicates: false,
    },
  )

  if (error) {
    console.error("Error tracking user view:", error)
    return { success: false }
  }

  return { success: true }
}
