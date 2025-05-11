"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createOrder(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to create an order" }
  }

  const listingId = formData.get("listingId") as string
  const sellerId = formData.get("sellerId") as string
  const quantity = Number.parseInt(formData.get("quantity") as string) || 1
  const meetupLocation = formData.get("meetupLocation") as string
  const meetupDate = formData.get("meetupDate") as string
  const meetupTime = formData.get("meetupTime") as string
  const notes = formData.get("notes") as string

  // Get the listing details
  const { data: listing, error: listingError } = await supabase
    .from("marketplace_listings")
    .select("title, price")
    .eq("id", listingId)
    .single()

  if (listingError) {
    return { error: "Listing not found" }
  }

  // Create the order
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      buyer_id: session.user.id,
      seller_id: sellerId,
      listing_id: listingId,
      quantity,
      total_price: listing.price * quantity,
      status: "pending",
      meetup_location: meetupLocation,
      meetup_date: meetupDate,
      meetup_time: meetupTime,
      notes,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  // Send notification to the seller
  await supabase.from("notifications").insert({
    user_id: sellerId,
    title: "New Order",
    content: `You have a new order for "${listing.title}"`,
    link: `/orders/${order.id}`,
  })

  revalidatePath("/orders")
  return { success: true, orderId: order.id }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to update an order" }
  }

  // Get the order to check ownership
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("seller_id, buyer_id, listing_id")
    .eq("id", orderId)
    .single()

  if (fetchError || !order) {
    return { error: "Order not found" }
  }

  // Check if the current user is the seller or buyer
  if (order.seller_id !== session.user.id && order.buyer_id !== session.user.id) {
    return { error: "You don't have permission to update this order" }
  }

  // Only sellers can mark as shipped/completed, and buyers can mark as received
  if ((status === "shipped" || status === "completed") && order.seller_id !== session.user.id) {
    return { error: "Only the seller can update to this status" }
  }

  if (status === "received" && order.buyer_id !== session.user.id) {
    return { error: "Only the buyer can mark as received" }
  }

  // Update the order status
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) {
    return { error: error.message }
  }

  // Get the listing details for the notification
  const { data: listing } = await supabase
    .from("marketplace_listings")
    .select("title")
    .eq("id", order.listing_id)
    .single()

  // Send notification to the other party
  const notificationUserId = session.user.id === order.seller_id ? order.buyer_id : order.seller_id
  const statusText = status.charAt(0).toUpperCase() + status.slice(1)

  await supabase.from("notifications").insert({
    user_id: notificationUserId,
    title: "Order Status Updated",
    content: `Your order for "${listing?.title}" has been marked as ${statusText}`,
    link: `/orders/${orderId}`,
  })

  revalidatePath(`/orders/${orderId}`)
  return { success: true }
}

export async function getUserOrders(role: "buyer" | "seller") {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return []
  }

  const field = role === "buyer" ? "buyer_id" : "seller_id"

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      marketplace_listings (
        id,
        title,
        price,
        marketplace_images (*)
      ),
      profiles!orders_buyer_id_fkey (
        id,
        full_name,
        avatar_url
      ),
      seller:profiles!orders_seller_id_fkey (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq(field, session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error(`Error fetching ${role} orders:`, error)
    return []
  }

  return data
}

export async function getOrderById(orderId: string) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      marketplace_listings (
        *,
        marketplace_images (*)
      ),
      profiles!orders_buyer_id_fkey (
        id,
        full_name,
        avatar_url,
        phone
      ),
      seller:profiles!orders_seller_id_fkey (
        id,
        full_name,
        avatar_url,
        phone
      )
    `)
    .eq("id", orderId)
    .single()

  if (error) {
    console.error("Error fetching order:", error)
    return null
  }

  // Check if the current user is the buyer or seller
  if (data.buyer_id !== session.user.id && data.seller_id !== session.user.id) {
    return null
  }

  return data
}
