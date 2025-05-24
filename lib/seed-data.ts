import { supabase } from "./supabase"

export async function seedSampleData() {
  try {
    console.log("🌱 Starting data seeding...")

    // Check if data already exists
    const { data: existingUniversities } = await supabase.from("universities").select("count").single()

    if (existingUniversities && existingUniversities.count > 0) {
      console.log("✅ Sample data already exists, skipping seeding")
      return { success: true, message: "Data already exists" }
    }

    // Seed universities
    const { error: universitiesError } = await supabase.from("universities").insert([
      {
        name: "University of Zimbabwe",
        location: "Harare",
        abbreviation: "UZ",
        website: "https://www.uz.ac.zw",
        contact_email: "info@uz.ac.zw",
        contact_phone: "+263-4-303211",
      },
      {
        name: "Midlands State University",
        location: "Gweru",
        abbreviation: "MSU",
        website: "https://www.msu.ac.zw",
        contact_email: "info@msu.ac.zw",
        contact_phone: "+263-54-260404",
      },
      {
        name: "National University of Science and Technology",
        location: "Bulawayo",
        abbreviation: "NUST",
        website: "https://www.nust.ac.zw",
        contact_email: "info@nust.ac.zw",
        contact_phone: "+263-9-282842",
      },
    ])

    if (universitiesError) {
      console.error("❌ Error seeding universities:", universitiesError)
      return { success: false, error: universitiesError }
    }

    console.log("✅ Universities seeded successfully")

    // Seed locations
    const { error: locationsError } = await supabase.from("locations").insert([
      {
        name: "Avondale",
        city: "Harare",
        province: "Harare",
        country: "Zimbabwe",
        latitude: -17.8047,
        longitude: 31.0669,
        description: "Upmarket residential area near UZ",
      },
      {
        name: "Mount Pleasant",
        city: "Harare",
        province: "Harare",
        country: "Zimbabwe",
        latitude: -17.784,
        longitude: 31.0946,
        description: "Popular student accommodation area",
      },
      {
        name: "Senga",
        city: "Gweru",
        province: "Midlands",
        country: "Zimbabwe",
        latitude: -19.45,
        longitude: 29.8167,
        description: "Near MSU campus",
      },
    ])

    if (locationsError) {
      console.error("❌ Error seeding locations:", locationsError)
      return { success: false, error: locationsError }
    }

    console.log("✅ Locations seeded successfully")

    // Seed accommodation types
    const { error: typesError } = await supabase.from("accommodation_types").insert([
      {
        name: "Single Room",
        description: "Private single occupancy room",
        icon: "bed-single",
      },
      {
        name: "Shared Room",
        description: "Shared room with other students",
        icon: "users",
      },
      {
        name: "Studio Apartment",
        description: "Self-contained studio unit",
        icon: "home",
      },
    ])

    if (typesError) {
      console.error("❌ Error seeding accommodation types:", typesError)
      return { success: false, error: typesError }
    }

    console.log("✅ Accommodation types seeded successfully")

    // Seed product categories
    const { error: categoriesError } = await supabase.from("product_categories").insert([
      {
        name: "Electronics",
        description: "Phones, laptops, gadgets",
        icon: "smartphone",
        sort_order: 1,
      },
      {
        name: "Books & Study Materials",
        description: "Textbooks, notes, stationery",
        icon: "book",
        sort_order: 2,
      },
      {
        name: "Furniture",
        description: "Desks, chairs, storage",
        icon: "armchair",
        sort_order: 3,
      },
    ])

    if (categoriesError) {
      console.error("❌ Error seeding product categories:", categoriesError)
      return { success: false, error: categoriesError }
    }

    console.log("✅ Product categories seeded successfully")

    console.log("🎉 All sample data seeded successfully!")
    return { success: true, message: "Sample data seeded successfully" }
  } catch (error) {
    console.error("💥 Error during data seeding:", error)
    return { success: false, error }
  }
}

// Auto-seed in development environment
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  // Wait a bit for the app to initialize
  setTimeout(() => {
    seedSampleData().then((result) => {
      if (result.success) {
        console.log("🌱 Sample data seeding completed")
      } else {
        console.warn("⚠️ Sample data seeding failed:", result.error)
      }
    })
  }, 2000)
}
