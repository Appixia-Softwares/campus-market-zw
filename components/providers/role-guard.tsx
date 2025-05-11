"use client"

import type React from "react"

import { useAuth } from "@/components/providers/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { LoadingSpinner } from "@/components/loading-spinner"

interface RoleGuardProps {
  children: React.ReactNode
  allowedRoles: string[]
  fallback?: React.ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { user, isLoading: authLoading } = useAuth()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkUserRole() {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase.from("profiles").select("role").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching user role:", error)
          setUserRole(null)
        } else {
          setUserRole(data?.role || null)
        }
      } catch (error) {
        console.error("Error in role check:", error)
        setUserRole(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (!authLoading) {
      checkUserRole()
    }
  }, [user, authLoading, supabase])

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <LoadingSpinner />
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    router.push("/auth/signin")
    return null
  }

  // Show fallback or redirect if not authorized
  if (!userRole || !allowedRoles.includes(userRole)) {
    if (fallback) {
      return <>{fallback}</>
    } else {
      router.push("/unauthorized")
      return null
    }
  }

  // User has the required role
  return <>{children}</>
}
