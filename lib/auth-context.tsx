"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase, testConnection } from "@/lib/supabase"
import type { User, Session } from "@supabase/supabase-js"
import { OnboardingModal } from "@/components/onboarding-modal"

interface UserProfile {
  id: string
  full_name: string
  email: string
  phone?: string
  university_id?: string
  role: "user" | "landlord" | "admin"
  status: "active" | "pending" | "inactive" | "suspended"
  verified: boolean
  email_verified: boolean
  phone_verified: boolean
  avatar_url?: string
  bio?: string
  created_at?: string
  university?: {
    id: string
    name: string
    location: string
    abbreviation: string
  }
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  loading: boolean
  connectionError: string | null
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  retryConnection: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const router = useRouter()
  const initialized = useRef(false)

  const createUserProfile = useCallback(async (authUser: User, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        const newProfile = {
          id: authUser.id,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "User",
          email: authUser.email || "",
          role: "user" as const,
          status: "pending" as const,
          verified: false,
          email_verified: !!authUser.email_confirmed_at,
          phone_verified: false,
        }

        const { data, error } = await supabase.from("users").insert(newProfile).select().single()

        if (error) {
          if (error.code === "23505") {
            // User already exists, fetch existing profile
            const { data: existing } = await supabase
              .from("users")
              .select(`
                *,
                university:universities(
                  id,
                  name,
                  location,
                  abbreviation
                )
              `)
              .eq("id", authUser.id)
              .single()
            return existing
          }

          if (i === retries - 1) {
            console.error("Error creating profile:", error)
            return null
          }
          continue
        }

        return data
      } catch (error: any) {
        console.error(`Error in createUserProfile (attempt ${i + 1}):`, error)
        if (i === retries - 1) {
          return null
        }
        // Wait before retry
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
      }
    }
    return null
  }, [])

  const fetchUserProfile = useCallback(
    async (userId: string, authUser?: User, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          setConnectionError(null)

          // Test connection first
          const connectionTest = await testConnection(1)
          if (!connectionTest.success) {
            if (i === retries - 1) {
              setConnectionError(connectionTest.error || "Connection failed")
              return null
            }
            continue
          }

          const { data: existingProfile, error: fetchError } = await supabase
            .from("users")
            .select(`
              *,
              university:universities(
                id,
                name,
                location,
                abbreviation
              )
            `)
            .eq("id", userId)
            .maybeSingle()

          if (fetchError) {
            if (i === retries - 1) {
              console.error("Error fetching profile:", fetchError)
              setConnectionError(fetchError.message)
              return null
            }
            continue
          }

          if (existingProfile) {
            return existingProfile
          }

          if (authUser) {
            const newProfile = await createUserProfile(authUser)
            return newProfile
          }

          return null
        } catch (error: any) {
          console.error(`Error in fetchUserProfile (attempt ${i + 1}):`, error)
          if (i === retries - 1) {
            setConnectionError(error.message || "Failed to fetch profile")
            return null
          }
          // Wait before retry
          await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)))
        }
      }
      return null
    },
    [createUserProfile],
  )

  const refreshUser = useCallback(async () => {
    try {
      setConnectionError(null)

      // Get current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        setUser(null)
        setProfile(null)
        setSession(null)
        return
      }

      setUser(session.user)
      setSession(session)

      // Try to fetch profile with retry logic
      const profileData = await fetchUserProfile(session.user.id, session.user)
      setProfile(profileData)
    } catch (error: any) {
      console.error("Error refreshing user:", error)
      setConnectionError(error.message || "Failed to refresh user")
      setUser(null)
      setProfile(null)
      setSession(null)
    }
  }, [fetchUserProfile])

  const retryConnection = useCallback(async () => {
    setLoading(true)
    setConnectionError(null)

    // Test connection first
    const connectionTest = await testConnection()
    if (!connectionTest.success) {
      setConnectionError(connectionTest.error || "Connection failed")
      setLoading(false)
      return
    }

    await refreshUser()
    setLoading(false)
  }, [refreshUser])

  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!user) return

      try {
        setConnectionError(null)

        // Prepare the updates object, handling university_id properly
        const profileUpdates: any = { ...updates }

        // If university_id is provided, validate it's a proper UUID
        if (profileUpdates.university_id !== undefined) {
          if (profileUpdates.university_id === "" || profileUpdates.university_id === null) {
            profileUpdates.university_id = null
          } else {
            // Validate that the university exists and get its UUID
            const { data: university, error: universityError } = await supabase
              .from("universities")
              .select("id")
              .eq("id", profileUpdates.university_id)
              .single()

            if (universityError || !university) {
              // If the provided ID is not a valid UUID, try to find by name or other criteria
              console.error("Invalid university ID:", profileUpdates.university_id)
              throw new Error("Invalid university selected")
            }
          }
        }

        // Remove university object if it exists (we only want to update university_id)
        delete profileUpdates.university

        console.log("Updating profile with:", profileUpdates)

        const { data, error } = await supabase
          .from("users")
          .update(profileUpdates)
          .eq("id", user.id)
          .select(`
            *,
            university:universities(
              id,
              name,
              location,
              abbreviation
            )
          `)
          .single()

        if (error) {
          console.error("Database error:", error)
          throw error
        }

        console.log("Profile updated successfully:", data)
        setProfile(data)
      } catch (error: any) {
        console.error("Error updating profile:", error)
        setConnectionError(error.message || "Failed to update profile")
        throw error
      }
    },
    [user],
  )

  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
      }

      setUser(null)
      setProfile(null)
      setSession(null)
      setConnectionError(null)
      router.push("/")
    } catch (error: any) {
      console.error("Unexpected error during sign out:", error)
    }
  }, [router])

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true

    let mounted = true

    const getInitialUser = async () => {
      try {
        setConnectionError(null)

        // Get initial session immediately
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log("Initial session check:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          error: sessionError?.message,
        })

        if (!mounted) return

        if (sessionError || !session?.user) {
          setLoading(false)
          return
        }

        // Set user and session immediately
        setUser(session.user)
        setSession(session)

        // Fetch profile in background
        const profileData = await fetchUserProfile(session.user.id, session.user)
        if (mounted) {
          setProfile(profileData)
          setLoading(false)
        }
      } catch (error: any) {
        console.error("Error in getInitialUser:", error)
        if (mounted) {
          setConnectionError(error.message || "Initialization failed")
          setLoading(false)
        }
      }
    }

    getInitialUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("Auth state changed:", event, session?.user?.id)

      try {
        setConnectionError(null)

        if (event === "SIGNED_OUT" || !session?.user) {
          setUser(null)
          setProfile(null)
          setSession(null)
          setLoading(false)
          return
        }

        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "INITIAL_SESSION") {
          setUser(session.user)
          setSession(session)

          const profileData = await fetchUserProfile(session.user.id, session.user)
          if (mounted) {
            setProfile(profileData)
          }
        }

        if (mounted) {
          setLoading(false)
        }
      } catch (error: any) {
        console.error("Error in auth state change:", error)
        if (mounted) {
          setConnectionError(error.message || "Auth state change failed")
          setUser(null)
          setProfile(null)
          setSession(null)
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [fetchUserProfile])

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        connectionError,
        signOut,
        refreshUser,
        updateProfile,
        retryConnection,
      }}
    >
      {children}
      {connectionError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm z-50">
          <div className="flex items-center gap-2">
            <span className="text-sm">Connection Error: {connectionError}</span>
            <button
              onClick={retryConnection}
              className="bg-white text-red-500 px-2 py-1 rounded text-xs hover:bg-gray-100"
            >
              Retry
            </button>
          </div>
        </div>
      )}
      <OnboardingModal />
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
