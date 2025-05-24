"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { RealtimeChannel } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

type RealtimeContextType = {
  subscribeToMessages: (conversationId: string, callback: (payload: any) => void) => () => void
  subscribeToAccommodations: (callback: (payload: any) => void) => () => void
  subscribeToProducts: (callback: (payload: any) => void) => () => void
  subscribeToNotifications: (userId: string, callback: (payload: any) => void) => () => void
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [channels, setChannels] = useState<RealtimeChannel[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      // Verify Supabase client is initialized
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }
      setIsInitialized(true)
    } catch (error) {
      console.error('Error initializing realtime context:', error)
    }
  }, [])

  // Clean up channels on unmount
  useEffect(() => {
    return () => {
      if (channels.length > 0) {
        channels.forEach((channel) => {
          try {
            supabase.removeChannel(channel)
          } catch (error) {
            console.error('Error removing channel:', error)
          }
        })
      }
    }
  }, [channels])

  // Subscribe to messages in a specific conversation
  const subscribeToMessages = (conversationId: string, callback: (payload: any) => void) => {
    if (!isInitialized) {
      console.error('Realtime context not initialized')
      return () => {}
    }

    try {
      const channel = supabase
        .channel(`messages:${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            callback(payload)
          },
        )
        .subscribe()

      setChannels((prev) => [...prev, channel])

      return () => {
        try {
          supabase.removeChannel(channel)
          setChannels((prev) => prev.filter((c) => c !== channel))
        } catch (error) {
          console.error('Error cleaning up message channel:', error)
        }
      }
    } catch (error) {
      console.error('Error subscribing to messages:', error)
      return () => {}
    }
  }

  // Subscribe to accommodation changes
  const subscribeToAccommodations = (callback: (payload: any) => void) => {
    if (!isInitialized) {
      console.error('Realtime context not initialized')
      return () => {}
    }

    try {
      const channel = supabase
        .channel("accommodations_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "accommodations",
          },
          (payload) => {
            callback(payload)
          },
        )
        .subscribe()

      setChannels((prev) => [...prev, channel])

      return () => {
        try {
          supabase.removeChannel(channel)
          setChannels((prev) => prev.filter((c) => c !== channel))
        } catch (error) {
          console.error('Error cleaning up accommodations channel:', error)
        }
      }
    } catch (error) {
      console.error('Error subscribing to accommodations:', error)
      return () => {}
    }
  }

  // Subscribe to product changes
  const subscribeToProducts = (callback: (payload: any) => void) => {
    if (!isInitialized) {
      console.error('Realtime context not initialized')
      return () => {}
    }

    try {
      const channel = supabase
        .channel("products_changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "products",
          },
          (payload) => {
            callback(payload)
          },
        )
        .subscribe()

      setChannels((prev) => [...prev, channel])

      return () => {
        try {
          supabase.removeChannel(channel)
          setChannels((prev) => prev.filter((c) => c !== channel))
        } catch (error) {
          console.error('Error cleaning up products channel:', error)
        }
      }
    } catch (error) {
      console.error('Error subscribing to products:', error)
      return () => {}
    }
  }

  // Subscribe to notifications for a specific user
  const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
    if (!isInitialized) {
      console.error('Realtime context not initialized')
      return () => {}
    }

    try {
      const channel = supabase
        .channel(`notifications:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            // Show toast notification
            toast({
              title: "New Notification",
              description: payload.new.message,
              duration: 5000,
            })
            callback(payload)
          },
        )
        .subscribe()

      setChannels((prev) => [...prev, channel])

      return () => {
        try {
          supabase.removeChannel(channel)
          setChannels((prev) => prev.filter((c) => c !== channel))
        } catch (error) {
          console.error('Error cleaning up notifications channel:', error)
        }
      }
    } catch (error) {
      console.error('Error subscribing to notifications:', error)
      return () => {}
    }
  }

  if (!isInitialized) {
    return null // or a loading state
  }

  return (
    <RealtimeContext.Provider
      value={{
        subscribeToMessages,
        subscribeToAccommodations,
        subscribeToProducts,
        subscribeToNotifications,
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error("useRealtime must be used within a RealtimeProvider")
  }
  return context
}
