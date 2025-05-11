"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function getAnalyticsData() {
  const supabase = createServerClient()

  // Get user counts
  const { count: totalUsers } = await supabase.from("profiles").select("*", { count: "exact", head: true })

  const { count: newUsersToday } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

  // Get listing counts
  const { count: totalMarketplaceListings } = await supabase
    .from("marketplace_listings")
    .select("*", { count: "exact", head: true })

  const { count: totalAccommodationListings } = await supabase
    .from("accommodation_listings")
    .select("*", { count: "exact", head: true })

  // Get order counts
  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true })

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  const { count: completedOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .or("status.eq.completed,status.eq.received")

  // Get message counts
  const { count: totalMessages } = await supabase.from("messages").select("*", { count: "exact", head: true })

  const { count: todayMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date(new Date().setHours(0, 0, 0, 0)).toISOString())

  // Get user growth data for chart
  const { data: userGrowthData } = await supabase.rpc("get_user_growth_by_month")

  // Get listing growth data for chart
  const { data: listingGrowthData } = await supabase.rpc("get_listing_growth_by_month")

  // Get order data for chart
  const { data: orderData } = await supabase.rpc("get_orders_by_month")

  // Get recent activity
  const { data: recentActivity } = await supabase
    .from("activity_log")
    .select(`
      *,
      profiles (id, full_name, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  return {
    counts: {
      totalUsers: totalUsers || 0,
      newUsersToday: newUsersToday || 0,
      totalMarketplaceListings: totalMarketplaceListings || 0,
      totalAccommodationListings: totalAccommodationListings || 0,
      totalOrders: totalOrders || 0,
      pendingOrders: pendingOrders || 0,
      completedOrders: completedOrders || 0,
      totalMessages: totalMessages || 0,
      todayMessages: todayMessages || 0,
    },
    charts: {
      userGrowth: userGrowthData || [],
      listingGrowth: listingGrowthData || [],
      orders: orderData || [],
    },
    recentActivity: recentActivity || [],
  }
}

export async function logActivity(userId: string, action: string, details: any = {}) {
  const supabase = createServerClient()

  const { error } = await supabase.from("activity_log").insert({
    user_id: userId,
    action,
    details,
  })

  if (error) {
    console.error("Error logging activity:", error)
  }
}

export async function getUserStats(userId: string) {
  const supabase = createServerClient()

  // Get user's listings
  const { count: marketplaceListings } = await supabase
    .from("marketplace_listings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  const { count: accommodationListings } = await supabase
    .from("accommodation_listings")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Get user's orders
  const { count: buyerOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("buyer_id", userId)

  const { count: sellerOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("seller_id", userId)

  // Get user's messages
  const { count: sentMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("sender_id", userId)

  const { count: receivedMessages } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", userId)

  // Get user's reviews
  const { count: receivedReviews } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", userId)

  const { data: averageRating } = await supabase.rpc("get_average_rating", { user_id: userId })

  return {
    listings: {
      marketplace: marketplaceListings || 0,
      accommodation: accommodationListings || 0,
      total: (marketplaceListings || 0) + (accommodationListings || 0),
    },
    orders: {
      buyer: buyerOrders || 0,
      seller: sellerOrders || 0,
      total: (buyerOrders || 0) + (sellerOrders || 0),
    },
    messages: {
      sent: sentMessages || 0,
      received: receivedMessages || 0,
      total: (sentMessages || 0) + (receivedMessages || 0),
    },
    reviews: {
      count: receivedReviews || 0,
      averageRating: averageRating || 0,
    },
  }
}
