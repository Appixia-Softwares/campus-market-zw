"use server"

import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"
import { createAccommodation, updateAccommodation, deleteAccommodation } from "@/lib/api/accommodations"
import type { Database } from "@/lib/database.types"

type AccommodationInsert = Database["public"]["Tables"]["accommodations"]["Insert"]
type AccommodationUpdate = Database["public"]["Tables"]["accommodations"]["Update"]

export async function createAccommodationAction(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const location_id = formData.get("location_id") as string
    const accommodation_type_id = formData.get("accommodation_type_id") as string
    const bedrooms = Number.parseInt(formData.get("bedrooms") as string)
    const bathrooms = Number.parseInt(formData.get("bathrooms") as string)
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

    const accommodationData: AccommodationInsert = {
      title,
      description,
      price,
      location_id,
      accommodation_type_id,
      bedrooms,
      bathrooms,
      user_id: user_id || (await supabase.auth.getUser()).data.user?.id,
      status: "pending",
    }

    const { data, error } = await createAccommodation(accommodationData)

    if (error) {
      return { success: false, error: error.message }
    }

    // Handle amenities
    const amenitiesString = formData.get("amenities") as string
    if (amenitiesString) {
      const amenities = JSON.parse(amenitiesString)

      for (const amenityId of amenities) {
        await supabase.from("accommodation_amenities").insert({
          accommodation_id: data.id,
          amenity_id: amenityId,
        })
      }
    }

    // Handle images
    const images = formData.getAll("images") as File[]
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const file = images[i]
        const fileExt = file.name.split(".").pop()
        const fileName = `${data.id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("accommodation-images").upload(fileName, file)

        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          continue
        }

        const { data: publicUrl } = supabase.storage.from("accommodation-images").getPublicUrl(fileName)

        await supabase.from("accommodation_images").insert({
          accommodation_id: data.id,
          url: publicUrl.publicUrl,
          is_primary: i === 0, // First image is primary
        })
      }
    }

    revalidatePath("/accommodation")
    revalidatePath("/landlord/listings")

    return { success: true, data }
  } catch (error) {
    console.error("Error creating accommodation:", error)
    return { success: false, error: "Failed to create accommodation" }
  }
}

export async function updateAccommodationAction(id: string, formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const price = Number.parseFloat(formData.get("price") as string)
    const status = formData.get("status") as string

    const accommodationData: AccommodationUpdate = {
      title,
      description,
      price,
      status,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await updateAccommodation(id, accommodationData)

    if (error) {
      return { success: false, error: error.message }
    }

    // Handle amenities updates
    const amenitiesString = formData.get("amenities") as string
    if (amenitiesString) {
      // Delete existing amenities
      await supabase.from("accommodation_amenities").delete().eq("accommodation_id", id)

      // Add new amenities
      const amenities = JSON.parse(amenitiesString)
      for (const amenityId of amenities) {
        await supabase.from("accommodation_amenities").insert({
          accommodation_id: id,
          amenity_id: amenityId,
        })
      }
    }

    // Handle new images
    const newImages = formData.getAll("new_images") as File[]
    if (newImages.length > 0) {
      for (const file of newImages) {
        const fileExt = file.name.split(".").pop()
        const fileName = `${id}/${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage.from("accommodation-images").upload(fileName, file)

        if (uploadError) {
          console.error("Error uploading image:", uploadError)
          continue
        }

        const { data: publicUrl } = supabase.storage.from("accommodation-images").getPublicUrl(fileName)

        await supabase.from("accommodation_images").insert({
          accommodation_id: id,
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
        await supabase.from("accommodation_images").delete().eq("id", imageId)
      }
    }

    // Handle primary image
    const primaryImage = formData.get("primary_image") as string
    if (primaryImage) {
      // Reset all images to non-primary
      await supabase.from("accommodation_images").update({ is_primary: false }).eq("accommodation_id", id)

      // Set the selected image as primary
      await supabase.from("accommodation_images").update({ is_primary: true }).eq("id", primaryImage)
    }

    revalidatePath(`/accommodation/${id}`)
    revalidatePath("/accommodation")
    revalidatePath("/landlord/listings")

    return { success: true, data }
  } catch (error) {
    console.error("Error updating accommodation:", error)
    return { success: false, error: "Failed to update accommodation" }
  }
}

export async function deleteAccommodationAction(id: string) {
  try {
    // Delete images from storage
    const { data: images } = await supabase.from("accommodation_images").select("url").eq("accommodation_id", id)

    if (images && images.length > 0) {
      for (const image of images) {
        const path = image.url.split("/").pop()
        if (path) {
          await supabase.storage.from("accommodation-images").remove([`${id}/${path}`])
        }
      }
    }

    // Delete accommodation
    const { error } = await deleteAccommodation(id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/accommodation")
    revalidatePath("/landlord/listings")

    return { success: true }
  } catch (error) {
    console.error("Error deleting accommodation:", error)
    return { success: false, error: "Failed to delete accommodation" }
  }
}
