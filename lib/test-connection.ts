import { supabase } from "./supabase"
import { createServerSupabaseClient } from "./supabase-server"

export async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...")

    // Test client-side connection
    const { data: clientData, error: clientError } = await supabase.from("universities").select("count").single()

    if (clientError) {
      console.error("❌ Client-side connection failed:", clientError)
      return { success: false, error: clientError }
    }

    console.log("✅ Client-side connection successful")

    // Test server-side connection (only in server environment)
    if (typeof window === "undefined") {
      const serverSupabase = createServerSupabaseClient()
      const { data: serverData, error: serverError } = await serverSupabase
        .from("universities")
        .select("count")
        .single()

      if (serverError) {
        console.error("❌ Server-side connection failed:", serverError)
        return { success: false, error: serverError }
      }

      console.log("✅ Server-side connection successful")
    }

    // Test basic queries
    const { data: universities, error: universitiesError } = await supabase
      .from("universities")
      .select("id, name, location")
      .limit(5)

    if (universitiesError) {
      console.error("❌ Universities query failed:", universitiesError)
      return { success: false, error: universitiesError }
    }

    console.log("✅ Sample data query successful:", universities)

    return {
      success: true,
      data: {
        universities: universities?.length || 0,
        clientConnection: true,
        serverConnection: typeof window === "undefined",
      },
    }
  } catch (error) {
    console.error("❌ Database connection test failed:", error)
    return { success: false, error }
  }
}

// Auto-test connection in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  testDatabaseConnection().then((result) => {
    if (result.success) {
      console.log("🎉 Database connection verified!")
    } else {
      console.error("💥 Database connection failed!")
    }
  })
}
