import { supabase } from "@/lib/supabase"
import type { Database } from "@/lib/database.types"

type Product = Database["public"]["Tables"]["products"]["Row"]
type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export interface ProductWithDetails extends Product {
  product_categories: {
    name: string
    description: string | null
  }
  users: {
    full_name: string
    email: string
    avatar_url: string | null
    verified: boolean
  }
  product_images: {
    id: string
    url: string
    is_primary: boolean
  }[]
}

export async function getProducts(filters?: {
  category?: string
  condition?: string
  minPrice?: number
  maxPrice?: number
  featured?: boolean
  search?: string
}) {
  let query = supabase
    .from("products")
    .select(`
      *,
      product_categories (name, description),
      users (full_name, email, avatar_url, verified),
      product_images (id, url, is_primary)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })

  if (filters?.category) {
    query = query.eq("product_categories.name", filters.category)
  }

  if (filters?.condition) {
    query = query.eq("condition", filters.condition)
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

  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  return { data, error }
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      product_categories (name, description),
      users (full_name, email, avatar_url, verified),
      product_images (id, url, is_primary),
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
    console.error("Error fetching product:", error)
    return { data: null, error }
  }

  // Increment view count
  await supabase.rpc("increment_product_views", { product_id: id })

  return { data, error: null }
}

export async function createProduct(product: ProductInsert) {
  const { data, error } = await supabase.from("products").insert(product).select().single()

  return { data, error }
}

export async function updateProduct(id: string, updates: ProductUpdate) {
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

  return { data, error }
}

export async function deleteProduct(id: string) {
  const { data, error } = await supabase.from("products").delete().eq("id", id)

  return { data, error }
}

export async function toggleProductLike(productId: string, userId: string) {
  const { data, error } = await supabase.rpc("toggle_product_like", {
    product_id: productId,
    user_id: userId,
  })

  return { data, error }
}

export async function getProductCategories() {
  const { data, error } = await supabase.from("product_categories").select("*").order("name")

  return { data, error }
}
