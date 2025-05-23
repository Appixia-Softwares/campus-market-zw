"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import { createProduct, updateProduct, deleteProduct } from "@/lib/api/products"
import type { Database } from "@/lib/database.types"

type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export async function createProductAction(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const category_id = formData.get("category_id") as string
    const condition = formData.get("condition") as string
    const location = formData.get("location") as string
    const user_id = formData.get("user_id") as string

    // Get current user if not provided
    if (!user_id) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: "User not authenticated" }
      }
    }

    const productData: ProductInsert = {
      title,
      description,
      price,
      category_id,
      condition,
      location,
      user_id: user_id || (await supabase.auth.getUser()).data.user?.id,
      status: "active",
      views: 0,
      likes: 0,
    }

    const { data, error } = await createProduct(productData)

    if (error) {
      return { success: false, error: error.message }
    }

    // Handle images
    const images = formData.getAll("images") as File[]
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileExt = file.name.split(".").pop()
        const fileName = `${data.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file)

        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          continue
        }

        const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(fileName)

        await supabase.from("product_images").insert({
          product_id: data.id,
          url: publicUrl.publicUrl,
          is_primary: i === 0, // First image is primary
        })
      }
    }

    revalidatePath("/marketplace")

    return { success: true, data }
  } catch (error) {
    console.error("Error creating product:", error)
    return { success: false, error: "Failed to create product" }
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const status = formData.get("status") as string
    const condition = formData.get("condition") as string

    const productData: ProductUpdate = {
      title,
      description,
      price,
      status,
      condition,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await updateProduct(id, productData)

    if (error) {
      return { success: false, error: error.message }
    }

    // Handle new images
    const newImages = formData.getAll("new_images") as File[]
    if (newImages.length > 0) {
      for (const file of newImages) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("product-images").upload(fileName, file)

        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          continue
        }

        const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(fileName)

        await supabase.from("product_images").insert({
          product_id: id,
          url: publicUrl.publicUrl,
          is_primary: false,
        })
      }
    }

    // Handle deleted images
    const deletedImagesString = formData.get("deleted_images") as string
    if (deletedImagesString) {
      const deletedImages = JSON.parse(deletedImagesString)
      for (const imageId of deletedImages) {
        await supabase.from("product_images").delete().eq("id", imageId)
      }
    }

    // Handle primary image
    const primaryImage = formData.get("primary_image") as string
    if (primaryImage) {
      // Reset all images to non-primary
      await supabase.from("product_images").update({ is_primary: false }).eq("product_id", id)

      // Set the selected image as primary
      await supabase.from("product_images").update({ is_primary: true }).eq("id", primaryImage)
    }

    revalidatePath(`/marketplace/products/${id}`)
    revalidatePath("/marketplace")

    return { success: true, data }
  } catch (error) {
    console.error("Error updating product:", error)
    return { success: false, error: "Failed to update product" }
  }
}

export async function deleteProductAction(id: string) {
  try {
    // Delete images from storage
    const { data: images } = await supabase.from("product_images").select("url").eq("product_id", id)

    if (images && images.length > 0) {
      for (const image of images) {
        const path = image.url.split("/").pop()
        if (path) {
          await supabase.storage.from("product-images").remove([`${id}/${path}`])
        }
      }
    }

    // Delete product
    const { error } = await deleteProduct(id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/marketplace")

    return { success: true }
  } catch (error) {
    console.error("Error deleting product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}

export async function markProductAsSoldAction(id: string) {
  try {
    const { data, error } = await updateProduct(id, {
      status: "sold",
      updated_at: new Date().toISOString(),
    })

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/marketplace/products/${id}`)
    revalidatePath("/marketplace")

    return { success: true, data }
  } catch (error) {
    console.error("Error marking product as sold:", error)
    return { success: false, error: "Failed to update product status" }
  }
}
