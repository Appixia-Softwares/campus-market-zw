"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  useEffect(() => {
    if (!pathname) return

    const trackPageView = async () => {
      try {
        await supabase.from("page_views").insert({
          path: pathname,
          query_params: searchParams?.toString() || null,
          user_id: user?.id || null,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        })
      } catch (error) {
        // Silently fail - analytics should not affect user experience
        console.error("Analytics error:", error)
      }
    }

    trackPageView()
  }, [pathname, searchParams, user])

  return null
}
