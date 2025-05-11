"use client"

import { createClient } from "@/lib/supabase/client"

// Define the types of data we want to sync
type SyncableData = {
  type: "marketplace" | "accommodation" | "message"
  action: "create" | "update" | "delete"
  data: any
  id?: string
  timestamp: number
}

// Initialize the queue in localStorage if it doesn't exist
const initQueue = () => {
  if (typeof window === "undefined") return

  if (!localStorage.getItem("syncQueue")) {
    localStorage.setItem("syncQueue", JSON.stringify([]))
  }
}

// Add an item to the sync queue
export const addToSyncQueue = (item: Omit<SyncableData, "timestamp">) => {
  if (typeof window === "undefined") return

  initQueue()

  const queue = JSON.parse(localStorage.getItem("syncQueue") || "[]")
  queue.push({
    ...item,
    timestamp: Date.now(),
  })

  localStorage.setItem("syncQueue", JSON.stringify(queue))
}

// Process the sync queue when online
export const processSyncQueue = async () => {
  if (typeof window === "undefined") return

  initQueue()

  // If offline, don't try to sync
  if (!navigator.onLine) return

  const queue = JSON.parse(localStorage.getItem("syncQueue") || "[]")
  if (queue.length === 0) return

  const supabase = createClient()
  const newQueue = [...queue]

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i]
    let success = false

    try {
      if (item.type === "marketplace") {
        if (item.action === "create") {
          const { error } = await supabase.from("marketplace_listings").insert(item.data)
          success = !error
        } else if (item.action === "update" && item.id) {
          const { error } = await supabase.from("marketplace_listings").update(item.data).eq("id", item.id)
          success = !error
        } else if (item.action === "delete" && item.id) {
          const { error } = await supabase.from("marketplace_listings").delete().eq("id", item.id)
          success = !error
        }
      } else if (item.type === "accommodation") {
        if (item.action === "create") {
          const { error } = await supabase.from("accommodation_listings").insert(item.data)
          success = !error
        } else if (item.action === "update" && item.id) {
          const { error } = await supabase.from("accommodation_listings").update(item.data).eq("id", item.id)
          success = !error
        } else if (item.action === "delete" && item.id) {
          const { error } = await supabase.from("accommodation_listings").delete().eq("id", item.id)
          success = !error
        }
      } else if (item.type === "message") {
        if (item.action === "create") {
          const { error } = await supabase.from("messages").insert(item.data)
          success = !error
        }
      }

      if (success) {
        // Remove the item from the queue if successful
        newQueue.splice(i, 1)
        i--
      }
    } catch (error) {
      console.error("Error processing sync queue item:", error)
    }
  }

  // Update the queue in localStorage
  localStorage.setItem("syncQueue", JSON.stringify(newQueue))
}

// Set up listeners for online/offline events
export const setupOfflineSync = () => {
  if (typeof window === "undefined") return

  initQueue()

  // Process the queue when coming online
  window.addEventListener("online", processSyncQueue)

  // Also process periodically when online
  if (navigator.onLine) {
    setInterval(processSyncQueue, 60000) // Try every minute
  }
}
