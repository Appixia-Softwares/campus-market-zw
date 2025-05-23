import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Accommodation = Database["public"]["Tables"]["accommodations"]["Row"]
type AccommodationInsert = Database["public"]["Tables"]["accommodations"]["Insert"]
type AccommodationUpdate = Database["public"]["Tables"]["accommodations"]["Update"]

export interface AccommodationWithDetails extends Accommodation {
  locations: {
    name: string
    city: string
  }
  accommodation_types: {
    name: string
    description: string | null
  }
  users: {
    full_name: string
    email: string
    avatar_url: string | null
    verified: boolean
  }
  accommodation_images: {
    id: string
    url: string
    is_primary: boolean
  }[]
  amenities: {
    id: string
    name: string
    icon: string | null
  }[]
}

export async function getAccommodations(filters?: {
  location?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
}) {
  let query = supabase
    .from("accommodations")
    .select(`
      *,
      locations (name, city),
      accommodation_types (name, description),
      users (full_name, email, avatar_url, verified),
      accommodation_images (id, url, is_primary),
      accommodation_amenities (
        amenities (id, name, icon)
      )
    `)
    .eq("status", "available")
    .order("created_at", { ascending: false })

  if (filters?.location) {
    query = query.eq("locations.name", filters.location)
  }

  if (filters?.type) {
    query = query.eq("accommodation_types.name", filters.type)
  }

  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice)
  }

  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice)
  }

  if (filters?.featured) {
    query = query.eq("featured", true)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching accommodations:", error)
    return { data: null, error }
  }

  // Transform the data to flatten amenities
  const transformedData = data?.map((accommodation) => ({
    ...accommodation,
    amenities: accommodation.accommodation_amenities?.map((aa) => aa.amenities).filter(Boolean) || [],
  }))

  return { data: transformedData, error: null }
}

export async function getAccommodationById(id: string) {
  const { data, error } = await supabase
    .from("accommodations")
    .select(`
      *,
      locations (name, city),
      accommodation_types (name, description),
      users (full_name, email, avatar_url, verified),
      accommodation_images (id, url, is_primary),
      accommodation_amenities (
        amenities (id, name, icon)
      ),
      reviews (
        id,
        rating,
        comment,
        created_at,
        users (full_name, avatar_url)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching accommodation:", error)
    return { data: null, error }
  }

  // Transform the data
  const transformedData = {
    ...data,
    amenities: data.accommodation_amenities?.map((aa) => aa.amenities).filter(Boolean) || [],
  }

  return { data: transformedData, error: null }
}

export async function createAccommodation(accommodation: AccommodationInsert) {
  const { data, error } = await supabase.from("accommodations").insert(accommodation).select().single()

  return { data, error }
}

export async function updateAccommodation(id: string, updates: AccommodationUpdate) {
  const { data, error } = await supabase.from("accommodations").update(updates).eq("id", id).select().single()

  return { data, error }
}

export async function deleteAccommodation(id: string) {
  const { data, error } = await supabase.from("accommodations").delete().eq("id", id)

  return { data, error }
}

export async function getLocations() {
  const { data, error } = await supabase.from("locations").select("*").order("name")

  return { data, error }
}

export async function getAccommodationTypes() {
  const { data, error } = await supabase.from("accommodation_types").select("*").order("name")

  return { data, error }
}

export async function getAmenities() {
  const { data, error } = await supabase.from("amenities").select("*").order("name")

  return { data, error }
}
