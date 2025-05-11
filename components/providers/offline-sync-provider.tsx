"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type OfflineSyncContextType = {
  isOnline: boolean
  pendingActions: any[]
  addPendingAction: (action: any) => void
  processPendingActions: () => Promise<void>
}

const OfflineSyncContext = createContext<OfflineSyncContextType>({
  isOnline: true,
  pendingActions: [],
  addPendingAction: () => {},
  processPendingActions: async () => {},
})

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState(true)
  const [pendingActions, setPendingActions] = useState<any[]>([])

  useEffect(() => {
    // Set initial online status
    setIsOnline(navigator.onLine)

    // Add event listeners for online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      processPendingActions()
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Load pending actions from localStorage
    const storedActions = localStorage.getItem("pendingActions")
    if (storedActions) {
      try {
        setPendingActions(JSON.parse(storedActions))
      } catch (error) {
        console.error("Error parsing stored pending actions:", error)
        localStorage.removeItem("pendingActions")
      }
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  // Save pending actions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("pendingActions", JSON.stringify(pendingActions))
  }, [pendingActions])

  const addPendingAction = (action: any) => {
    setPendingActions((prev) => [...prev, { ...action, timestamp: Date.now() }])
  }

  const processPendingActions = async () => {
    if (!isOnline || pendingActions.length === 0) return

    const actions = [...pendingActions]
    setPendingActions([])

    for (const action of actions) {
      try {
        // Process the action based on its type
        switch (action.type) {
          case "create_listing":
            // await createListing(action.data)
            console.log("Processing create listing action", action)
            break
          case "update_listing":
            // await updateListing(action.data)
            console.log("Processing update listing action", action)
            break
          case "send_message":
            // await sendMessage(action.data)
            console.log("Processing send message action", action)
            break
          default:
            console.warn("Unknown action type:", action.type)
            break
        }
      } catch (error) {
        console.error(`Error processing action ${action.type}:`, error)
        // Add back to pending actions if it failed
        addPendingAction(action)
      }
    }
  }

  return (
    <OfflineSyncContext.Provider
      value={{
        isOnline,
        pendingActions,
        addPendingAction,
        processPendingActions,
      }}
    >
      {children}
    </OfflineSyncContext.Provider>
  )
}

export const useOfflineSync = () => useContext(OfflineSyncContext)
