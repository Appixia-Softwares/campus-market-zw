"use client"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"

const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const retryCount = useRef(0)

  useEffect(() => {
    if (!pathname) return

    const trackPageView = async () => {
      try {
        const { error } = await supabase.from("page_views").insert({
          path: pathname,
          query_params: searchParams?.toString() || null,
          user_id: user?.id || null,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
        })

        if (error) {
          throw error
        }

        // Reset retry count on success
        retryCount.current = 0
      } catch (error) {
        console.error("Analytics error:", error)
        
        // Retry logic
        if (retryCount.current < MAX_RETRIES) {
          retryCount.current += 1
          setTimeout(trackPageView, RETRY_DELAY * retryCount.current)
        }
      }
    }

    trackPageView()
  }, [pathname, searchParams, user])

  return null
}
