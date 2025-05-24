'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'

// List of public routes that don't require authentication
const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/auth'
]

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'landlord' | 'user'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, session, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      // Check if the current route is public
      const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

      if (!session && !isPublicRoute) {
        // Redirect to login if no session and not a public route
        router.push('/login')
        return
      }

      if (session && isPublicRoute) {
        // Redirect to dashboard if logged in and trying to access auth pages
        router.push('/dashboard')
        return
      }

      if (session && requiredRole) {
        const userRole = user?.user_metadata?.role
        if (userRole !== requiredRole) {
          // Redirect to dashboard if user doesn't have required role
          router.push('/dashboard')
          return
        }
      }
    }
  }, [session, loading, router, requiredRole, user, pathname])

  // Show loading state while checking auth
  if (loading) {
    return <div>Loading...</div>
  }

  // Show children if:
  // 1. It's a public route
  // 2. User is authenticated and has required role
  // 3. User is authenticated and no role is required
  return <>{children}</>
}
