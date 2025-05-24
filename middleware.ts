import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  try {
    // Get the user instead of just the session
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log('Debug - Middleware user check:', {
      path: request.nextUrl.pathname,
      hasUser: !!user,
      userId: user?.id,
      error: userError
    })

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || 
                       request.nextUrl.pathname.startsWith('/signup')
    const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') || 
                            request.nextUrl.pathname.startsWith('/profile') ||
                            request.nextUrl.pathname.startsWith('/admin') ||
                            request.nextUrl.pathname.startsWith('/landlord')

    // Handle auth routes
    if (isAuthRoute) {
      if (user) {
        // If user is authenticated and trying to access auth routes, redirect to dashboard
        console.log('Debug - User already logged in, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
      // If not authenticated, allow access to auth routes
      return response
    }

    // Handle protected routes
    if (isProtectedRoute) {
      if (!user) {
        // If not authenticated and trying to access protected routes, redirect to login
        console.log('Debug - No user found, redirecting to login')
        const redirectUrl = new URL('/login', request.url)
        redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Check role-specific routes
      if (request.nextUrl.pathname.startsWith('/admin')) {
        if (user.user_metadata?.role !== 'admin') {
          console.log('Debug - User is not an admin, redirecting to dashboard')
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }

      if (request.nextUrl.pathname.startsWith('/landlord')) {
        if (user.user_metadata?.role !== 'landlord') {
          console.log('Debug - User is not a landlord, redirecting to dashboard')
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }

      // If authenticated and authorized, allow access to protected routes
      return response
    }

    // For all other routes, allow access
    return response
  } catch (error) {
    console.error('Debug - Middleware error:', error)
    // On error, redirect to login
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/admin/:path*',
    '/landlord/:path*',
    '/login',
    '/signup'
  ],
}
