"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { createBrowserClient } from '@supabase/ssr'
import { getCurrentUser } from "@/lib/api/auth"

interface AuthContextType {
  user: User | null
  profile: any | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const MAX_RETRIES = 3

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const refreshUser = async () => {
    try {
      console.log('Debug - Refreshing user...')
      
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error('Debug - Error getting session:', sessionError)
        throw sessionError
      }

      if (!session) {
        console.log('Debug - No session found')
        setUser(null)
        setProfile(null)
        setLoading(false)
        return
      }

      console.log('Debug - Session found:', {
        userId: session.user.id,
        accessToken: session.access_token ? 'present' : 'missing',
        expiresAt: session.expires_at
      })
      
      // Now get the user profile
      const { data, error } = await getCurrentUser()
      
      if (error) {
        console.error('Debug - Error getting user profile:', error)
        throw error
      }

      if (data) {
        console.log('Debug - User refreshed successfully:', {
          userId: data.user?.id,
          hasProfile: !!data.profile
        })
        setUser(data.user)
        setProfile(data.profile)
        setRetryCount(0) // Reset retry count on success
      } else {
        console.log('Debug - No user data found')
        setUser(null)
        setProfile(null)
      }
    } catch (error) {
      console.error('Debug - Error in refreshUser:', error)
      setUser(null)
      setProfile(null)

      // Only retry if we haven't exceeded max retries
      if (retryCount < MAX_RETRIES) {
        console.log(`Debug - Retrying refresh (${retryCount + 1}/${MAX_RETRIES})...`)
        setRetryCount(prev => prev + 1)
        setTimeout(refreshUser, 1000 * Math.pow(2, retryCount)) // Exponential backoff
      } else {
        setLoading(false)
      }
    } finally {
      if (retryCount >= MAX_RETRIES) {
        setLoading(false)
      }
    }
  }

  const signOut = async () => {
    try {
      console.log('Debug - Signing out...')
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      console.log('Debug - Sign out successful')
    } catch (error) {
      console.error('Debug - Error signing out:', error)
    }
  }

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      console.log('Debug - Initializing auth...')
      
      // Get initial session
      if (mounted) {
        await refreshUser()
      }

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Debug - Auth state changed:', {
          event,
          userId: session?.user?.id,
          accessToken: session?.access_token ? 'present' : 'missing'
        })
        
        if (!mounted) return

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          console.log('Debug - User signed in or token refreshed')
          await refreshUser()
        } else if (event === "SIGNED_OUT") {
          console.log('Debug - User signed out')
          setUser(null)
          setProfile(null)
          setLoading(false)
        }
      })

      return () => {
        console.log('Debug - Cleaning up auth subscription')
        subscription.unsubscribe()
      }
    }

    initializeAuth()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
