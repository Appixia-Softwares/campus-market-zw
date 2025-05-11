"use server"

import { createServerClient } from "@/lib/supabase/server"

export async function seedMarketplaceListings() {
  const supabase = createServerClient()

  // Get existing user IDs from the profiles table
  const { data: users, error: userError } = await supabase.from("profiles").select("id, username, full_name").limit(5)

  if (userError || !users || users.length === 0) {
    console.error("Error fetching users:", userError)
    return { error: "No users found to associate with listings" }
  }

  // Sample marketplace listings
  const listings = [
    {
      title: "Textbook: Introduction to Economics",
      description: "Barely used textbook for ECO101. Great condition with no highlights or notes.",
      price: 25.0,
      condition: "Like New",
      category: "Books",
      location: "University of Zimbabwe",
      user_id: users[0].id,
    },
    {
      title: "Scientific Calculator",
      description: "Texas Instruments TI-84 Plus. Perfect for engineering and science courses.",
      price: 45.0,
      condition: "Good",
      category: "Electronics",
      location: "National University of Science and Technology",
      user_id: users[0].id,
    },
    {
      title: "Desk Lamp",
      description: "Adjustable LED desk lamp with multiple brightness settings. Great for studying.",
      price: 15.0,
      condition: "Excellent",
      category: "Furniture",
      location: "Midlands State University",
      user_id: users[1].id,
    },
    {
      title: "Laptop: Dell XPS 13",
      description: "2022 model, 16GB RAM, 512GB SSD, Intel i7. Perfect for students.",
      price: 650.0,
      condition: "Like New",
      category: "Electronics",
      location: "Harare Institute of Technology",
      user_id: users[1].id,
    },
  ]

  // Insert marketplace listings
  for (const listing of listings) {
    const { data: newListing, error: listingError } = await supabase
      .from("marketplace_listings")
      .insert(listing)
      .select()
      .single()

    if (listingError) {
      console.error("Error creating listing:", listingError)
      continue
    }

    // Add an image for each listing
    const imageUrl = getImageUrlForListing(listing.title)
    if (imageUrl) {
      await supabase.from("marketplace_images").insert({
        listing_id: newListing.id,
        image_url: imageUrl,
        is_primary: true,
      })
    }
  }

  return { success: true, message: "Marketplace listings seeded successfully" }
}

export async function seedAccommodationListings() {
  const supabase = createServerClient()

  // Get existing user IDs from the profiles table
  const { data: users, error: userError } = await supabase.from("profiles").select("id, username, full_name").limit(5)

  if (userError || !users || users.length === 0) {
    console.error("Error fetching users:", userError)
    return { error: "No users found to associate with listings" }
  }

  // Sample accommodation listings
  const listings = [
    {
      title: "Cozy Studio Apartment Near UZ",
      description:
        "Fully furnished studio apartment within walking distance to University of Zimbabwe. Includes utilities and WiFi.",
      price: 250.0,
      type: "Studio",
      location: "Mount Pleasant, Harare",
      is_verified: true,
      availability_date: "2023-09-01",
      user_id: users[0].id,
    },
    {
      title: "Shared 3-Bedroom House",
      description:
        "Room available in a shared house with 2 other students. Shared kitchen and bathroom. Close to NUST.",
      price: 150.0,
      type: "Shared Room",
      location: "Bulawayo",
      is_verified: true,
      availability_date: "2023-08-15",
      user_id: users[0].id,
    },
    {
      title: "Modern 1-Bedroom Apartment",
      description:
        "Newly renovated 1-bedroom apartment with balcony. 10-minute drive to MSU. Secure building with parking.",
      price: 300.0,
      type: "1-Bedroom",
      location: "Gweru",
      is_verified: true,
      availability_date: "2023-09-15",
      user_id: users[1].id,
    },
    {
      title: "Student Hostel Room",
      description: "Single room in a student hostel. Shared facilities. Walking distance to HIT.",
      price: 120.0,
      type: "Single Room",
      location: "Harare",
      is_verified: false,
      availability_date: "2023-08-01",
      user_id: users[1].id,
    },
  ]

  // Insert accommodation listings
  for (const listing of listings) {
    const { data: newListing, error: listingError } = await supabase
      .from("accommodation_listings")
      .insert(listing)
      .select()
      .single()

    if (listingError) {
      console.error("Error creating listing:", listingError)
      continue
    }

    // Add an image for each listing
    const imageUrl = getImageUrlForAccommodation(listing.title)
    if (imageUrl) {
      await supabase.from("accommodation_images").insert({
        listing_id: newListing.id,
        image_url: imageUrl,
        is_primary: true,
      })
    }

    // Add amenities
    const amenities = getAmenitiesForListing(listing.title)
    for (const amenity of amenities) {
      await supabase.from("accommodation_amenities").insert({
        listing_id: newListing.id,
        amenity,
      })
    }

    // Add rules
    const rules = getRulesForListing(listing.title)
    for (const rule of rules) {
      await supabase.from("accommodation_rules").insert({
        listing_id: newListing.id,
        rule,
      })
    }
  }

  return { success: true, message: "Accommodation listings seeded successfully" }
}

export async function seedNotifications() {
  const supabase = createServerClient()

  // Get existing user IDs from the profiles table
  const { data: users, error: userError } = await supabase.from("profiles").select("id, username, full_name").limit(5)

  if (userError || !users || users.length === 0) {
    console.error("Error fetching users:", userError)
    return { error: "No users found to associate with notifications" }
  }

  // Sample notifications
  const notifications = [
    {
      user_id: users[0].id,
      title: "Welcome to Campus Market",
      content: "Thank you for joining Campus Market! Complete your profile to get started.",
      link: "/profile",
      is_read: false,
    },
    {
      user_id: users[0].id,
      title: "Verification Required",
      content: "Please verify your student ID to access all features of Campus Market.",
      link: "/profile/verification",
      is_read: false,
    },
    {
      user_id: users[1].id,
      title: "New Message",
      content: "You have a new message regarding your listing.",
      link: "/messages",
      is_read: false,
    },
    {
      user_id: users[1].id,
      title: "Listing Approved",
      content: "Your accommodation listing has been approved and is now visible to others.",
      link: "/accommodation",
      is_read: true,
    },
  ]

  // Insert notifications
  for (const notification of notifications) {
    await supabase.from("notifications").insert(notification)
  }

  return { success: true, message: "Notifications seeded successfully" }
}

export async function seedMessages() {
  const supabase = createServerClient()

  // Get existing user IDs from the profiles table
  const { data: users, error: userError } = await supabase.from("profiles").select("id, username, full_name").limit(5)

  if (userError || !users || users.length === 0) {
    console.error("Error fetching users:", userError)
    return { error: "No users found to associate with messages" }
  }

  // Get a marketplace listing
  const { data: marketplaceListings } = await supabase.from("marketplace_listings").select("id").limit(1)

  // Get an accommodation listing
  const { data: accommodationListings } = await supabase.from("accommodation_listings").select("id").limit(1)

  // Sample messages
  const messages = [
    {
      sender_id: users[0].id,
      receiver_id: users[1].id,
      content: "Hi, I am interested in your textbook. Is it still available?",
      is_read: false,
      listing_id: marketplaceListings && marketplaceListings[0]?.id,
      listing_type: "marketplace",
    },
    {
      sender_id: users[1].id,
      receiver_id: users[0].id,
      content: "Yes, it is still available. When would you like to meet?",
      is_read: true,
      listing_id: marketplaceListings && marketplaceListings[0]?.id,
      listing_type: "marketplace",
    },
    {
      sender_id: users[0].id,
      receiver_id: users[1].id,
      content: "Hello, I am interested in viewing the apartment. Is it possible to schedule a viewing this weekend?",
      is_read: false,
      listing_id: accommodationListings && accommodationListings[0]?.id,
      listing_type: "accommodation",
    },
  ]

  // Insert messages
  for (const message of messages) {
    await supabase.from("messages").insert(message)
  }

  return { success: true, message: "Messages seeded successfully" }
}

// Helper functions to get image URLs and other data
function getImageUrlForListing(title: string): string {
  const imageMap: Record<string, string> = {
    "Textbook: Introduction to Economics":
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
    "Scientific Calculator":
      "https://images.unsplash.com/photo-1564473185935-58113cba1e80?auto=format&fit=crop&q=80&w=800",
    "Desk Lamp": "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    "Laptop: Dell XPS 13":
      "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=800",
  }

  return (
    imageMap[title] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800"
  )
}

function getImageUrlForAccommodation(title: string): string {
  const imageMap: Record<string, string> = {
    "Cozy Studio Apartment Near UZ":
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    "Shared 3-Bedroom House":
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&q=80&w=800",
    "Modern 1-Bedroom Apartment":
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
    "Student Hostel Room": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
  }

  return imageMap[title] || "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=800"
}

function getAmenitiesForListing(title: string): string[] {
  const amenitiesMap: Record<string, string[]> = {
    "Cozy Studio Apartment Near UZ": ["WiFi", "Furnished", "Water Included", "Electricity Included"],
    "Shared 3-Bedroom House": ["WiFi", "Furnished", "Parking"],
    "Modern 1-Bedroom Apartment": ["WiFi", "Furnished", "Air Conditioning", "Balcony", "Parking"],
    "Student Hostel Room": ["WiFi", "Furnished", "Shared Kitchen"],
  }

  return amenitiesMap[title] || ["WiFi", "Furnished"]
}

function getRulesForListing(title: string): string[] {
  const rulesMap: Record<string, string[]> = {
    "Cozy Studio Apartment Near UZ": ["No Smoking", "No Pets", "No Parties"],
    "Shared 3-Bedroom House": ["No Smoking", "Quiet Hours 10PM-7AM"],
    "Modern 1-Bedroom Apartment": ["No Smoking", "No Pets"],
    "Student Hostel Room": ["No Visitors After 9PM", "No Alcohol", "No Cooking in Rooms"],
  }

  return rulesMap[title] || ["No Smoking"]
}
