"use client"

import type React from "react"

import { useEffect } from "react"
import { setupOfflineSync } from "@/lib/offline-sync"

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    setupOfflineSync()
  }, [])

  return <>{children}</>
}
