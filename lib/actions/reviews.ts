"use server"

import { createServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createReview(formData: FormData) {
  const supabase = createServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return { error: "You must be logged in to leave a review" }
  }

  const revieweeId = formData.get("revieweeId") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const comment = formData.get("comment") as string

  // Check if user has already reviewed this person
  const { data: existingReview, error: checkError } = await supabase
    .from("reviews")
    .select("id")
    .eq("reviewer_id", session.user.id)
    .eq("reviewee_id", revieweeId)
    .single()

  if (existingReview) {
    return { error: "You have already reviewed this user" }
  }

  // Create the review
  const { error } = await supabase.from("reviews").insert({
    reviewer_id: session.user.id,
    reviewee_id: revieweeId,
    rating,
    comment,
  })

  if (error) {
    return { error: error.message }
  }

  // Send notification to the reviewee
  await supabase.from("notifications").insert({
    user_id: revieweeId,
    title: "New Review",
    content: "Someone has left a review on your profile",
    link: "/profile",
  })

  revalidatePath(`/profile/${revieweeId}`)
  return { success: true }
}

export async function getUserReviews(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles!reviews_reviewer_id_fkey (
        id,
        full_name,
        avatar_url,
        is_verified
      )
    `)
    .eq("reviewee_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user reviews:", error)
    return []
  }

  return data
}

export async function getUserRating(userId: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase.from("reviews").select("rating").eq("reviewee_id", userId)

  if (error) {
    console.error("Error fetching user rating:", error)
    return { rating: 0, count: 0 }
  }

  if (!data || data.length === 0) {
    return { rating: 0, count: 0 }
  }

  const totalRating = data.reduce((sum, review) => sum + review.rating, 0)
  const averageRating = totalRating / data.length

  return {
    rating: Number.parseFloat(averageRating.toFixed(1)),
    count: data.length,
  }
}
