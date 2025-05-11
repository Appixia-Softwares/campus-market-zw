"use client"

import { useEffect } from "react"

export default function PerformanceMonitor() {
  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window && "PerformanceObserver" in window) {
      // Create a performance observer to monitor web vitals
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            // Log performance metrics
            console.log(`[Performance] ${entry.name}: ${entry.startTime.toFixed(2)}ms`)

            // Send metrics to analytics if needed
            if (entry.entryType === "navigation") {
              const navigationEntry = entry as PerformanceNavigationTiming
              const metrics = {
                dnsLookup: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
                tcpConnection: navigationEntry.connectEnd - navigationEntry.connectStart,
                requestTime: navigationEntry.responseStart - navigationEntry.requestStart,
                responseTime: navigationEntry.responseEnd - navigationEntry.responseStart,
                domProcessing: navigationEntry.domComplete - navigationEntry.responseEnd,
                domInteractive: navigationEntry.domInteractive,
                loadEvent: navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
                totalPageLoad: navigationEntry.loadEventEnd,
              }

              console.log("[Performance Metrics]", metrics)

              // Here you would send these metrics to your analytics service
              // sendToAnalytics(metrics)
            }
          })
        })

        // Observe different types of performance entries
        observer.observe({ entryTypes: ["navigation", "resource", "paint", "largest-contentful-paint"] })

        return () => {
          observer.disconnect()
        }
      } catch (error) {
        console.error("Error setting up performance monitoring:", error)
      }
    }
  }, [])

  // This component doesn't render anything visible
  return null
}
