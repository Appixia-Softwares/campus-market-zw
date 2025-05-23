import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  // Check if we have a session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Authentication routes
  if (["/login", "/signup", "/forgot-password"].includes(request.nextUrl.pathname)) {
    // If user is already logged in, redirect to dashboard
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return response
  }

  // Protected routes that require authentication
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile") ||
    request.nextUrl.pathname.startsWith("/messages") ||
    request.nextUrl.pathname.startsWith("/notifications") ||
    request.nextUrl.pathname.startsWith("/bookings") ||
    request.nextUrl.pathname.startsWith("/settings")
  ) {
    if (!session) {
      // Save the URL they tried to visit
      const redirectUrl = request.nextUrl.pathname + request.nextUrl.search

      return NextResponse.redirect(new URL(`/login?redirectTo=${encodeURIComponent(redirectUrl)}`, request.url))
    }

    // Check for role-specific routes
    if (request.nextUrl.pathname.startsWith("/admin")) {
      // Fetch user profile to check role
      const { data: profile } = await supabase.from("users").select("role").eq("id", session.user.id).single()

      if (!profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    if (request.nextUrl.pathname.startsWith("/landlord")) {
      // Fetch user profile to check role
      const { data: profile } = await supabase.from("users").select("role").eq("id", session.user.id).single()

      if (!profile || profile.role !== "landlord") {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
}
