"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LifeBuoy, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminSupportBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Check if the banner has been dismissed in this session
    const dismissed = sessionStorage.getItem("supportBannerDismissed")
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show the banner after 5 seconds on the site
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  // Hide on admin pages
  if (pathname?.startsWith("/admin") || isDismissed || !isVisible) {
    return null
  }

  const dismissBanner = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem("supportBannerDismissed", "true")
  }

  return (
    <div className="bg-primary/10 rounded-lg p-4 mb-6 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2"
        onClick={dismissBanner}
        aria-label="Dismiss support banner"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <div className="flex items-center mb-2 md:mb-0">
          <LifeBuoy className="h-5 w-5 mr-2 text-primary" />
          <span className="font-medium">Need help? Admin support is available!</span>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/help">View Help Center</Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link href="/report">Report an Issue</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
