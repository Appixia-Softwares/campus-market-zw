import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") || "/"
  const isConfirmation = searchParams.get("type") === "email_confirmation" || searchParams.get("type") === "signup"

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if this is a new user (first login after signup)
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Check if profile exists
        const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

        if (!profile) {
          // Create profile if it doesn't exist
          const { error: profileError } = await supabase.from("profiles").insert({
            id: session.user.id,
            full_name: session.user.user_metadata.full_name || "",
            university: session.user.user_metadata.university || "",
            role: "student",
            is_verified: false,
          })

          if (!profileError) {
            // If this is an email confirmation, redirect to confirmation success page
            if (isConfirmation) {
              return NextResponse.redirect(`${origin}/auth/confirmation-success`)
            }
            // Otherwise redirect to profile completion page for new users
            return NextResponse.redirect(`${origin}/profile/complete`)
          }
        } else if (isConfirmation) {
          // If this is an email confirmation for existing user, redirect to confirmation success page
          return NextResponse.redirect(`${origin}/auth/confirmation-success`)
        }
      }
    }
  }

  // Redirect to the requested page or home page
  return NextResponse.redirect(`${origin}${next}`)
}
