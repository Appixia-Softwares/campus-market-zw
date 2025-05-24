"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Building, Heart, MapPin, MessageSquare } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRealtime } from "@/lib/realtime-context"
import { useAuth } from "@/lib/auth-context"
import { getAccommodations, type AccommodationWithDetails } from "@/lib/api/accommodations"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"

interface AccommodationListProps {
  initialAccommodations?: AccommodationWithDetails[]
  filters?: {
    location?: string
    type?: string
    minPrice?: number
    maxPrice?: number
    featured?: boolean
  }
}

export default function AccommodationList({ initialAccommodations, filters }: AccommodationListProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const { subscribeToAccommodations } = useRealtime()
  const [accommodations, setAccommodations] = useState<AccommodationWithDetails[]>(initialAccommodations || [])
  const [loading, setLoading] = useState(!initialAccommodations)
  const [favorites, setFavorites] = useState<string[]>([])

  // Fetch accommodations if not provided
  useEffect(() => {
    if (initialAccommodations) return

    const fetchAccommodations = async () => {
      setLoading(true)
      try {
        const { data, error } = await getAccommodations(filters)
        if (error) throw error

        setAccommodations(data || [])
      } catch (error) {
        console.error("Error fetching accommodations:", error)
        toast({
          title: "Error",
          description: "Failed to load accommodations. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodations()
  }, [initialAccommodations, filters, toast])

  // Fetch user favorites
  useEffect(() => {
    if (!user) return

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from("user_favorites")
          .select("accommodation_id")
          .eq("user_id", user.id)
          .eq("type", "accommodation")

        if (error) throw error

        setFavorites(data.map((fav) => fav.accommodation_id))
      } catch (error) {
        console.error("Error fetching favorites:", error)
      }
    }

    fetchFavorites()
  }, [user])

  // Subscribe to accommodation changes
  useEffect(() => {
    const unsubscribe = subscribeToAccommodations((payload) => {
      if (payload.eventType === "INSERT") {
        // Check if the new accommodation matches our filters
        const newAccommodation = payload.new as AccommodationWithDetails

        // Fetch additional details for the new accommodation
        const fetchDetails = async () => {
          try {
            const { data } = await supabase
              .from("accommodations")
              .select(`
                *,
                locations (name, city),
                accommodation_types (name, description),
                users (full_name, email, avatar_url, verified),
                accommodation_images (id, url, is_primary),
                accommodation_amenities (
                  amenities (id, name, icon)
                )
              `)
              .eq("id", newAccommodation.id)
              .single()

            if (data) {
              // Transform the data
              const transformedData = {
                ...data,
                amenities: data.accommodation_amenities?.map((aa) => aa.amenities).filter(Boolean) || [],
              }

              setAccommodations((prev) => [transformedData, ...prev])

              toast({
                title: "New Listing",
                description: `A new accommodation "${transformedData.title}" was just added!`,
              })
            }
          } catch (error) {
            console.error("Error fetching accommodation details:", error)
          }
        }

        fetchDetails()
      } else if (payload.eventType === "UPDATE") {
        // Update the accommodation in our list
        setAccommodations((prev) => prev.map((acc) => (acc.id === payload.new.id ? { ...acc, ...payload.new } : acc)))
      } else if (payload.eventType === "DELETE") {
        // Remove the accommodation from our list
        setAccommodations((prev) => prev.filter((acc) => acc.id !== payload.old.id))
      }
    })

    return unsubscribe
  }, [subscribeToAccommodations, toast])

  // Toggle favorite
  const toggleFavorite = async (accommodationId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save favorites",
        variant: "destructive",
      })
      return
    }

    // Optimistic update
    setFavorites((prev) => {
      if (prev.includes(accommodationId)) {
        return prev.filter((id) => id !== accommodationId)
      } else {
        return [...prev, accommodationId]
      }
    })

    try {
      const { error } = await supabase.rpc("toggle_accommodation_favorite", {
        accommodation_id: accommodationId,
        user_id: user.id,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error toggling favorite:", error)

      // Revert optimistic update
      setFavorites((prev) => {
        if (prev.includes(accommodationId)) {
          return prev.filter((id) => id !== accommodationId)
        } else {
          return [...prev, accommodationId]
        }
      })

      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (accommodations.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Accommodations Found</h3>
        <p className="text-muted-foreground mb-6">We couldn't find any accommodations matching your criteria.</p>
        <Button onClick={() => (window.location.href = "/accommodation")}>Clear Filters</Button>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accommodations.map((accommodation) => (
          <motion.div
            key={accommodation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/accommodation/${accommodation.id}`} className="block h-full">
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={accommodation.accommodation_images?.[0]?.url || "/placeholder.svg?height=300&width=400"}
                    alt={accommodation.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                    onClick={(e) => toggleFavorite(accommodation.id, e)}
                  >
                    <Heart
                      className={`h-5 w-5 ${favorites.includes(accommodation.id) ? "fill-primary text-primary" : ""}`}
                    />
                  </Button>
                  {accommodation.featured && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Featured</Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-lg line-clamp-1">{accommodation.title}</h3>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{accommodation.locations?.name}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {accommodation.accommodation_types?.name}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-lg font-bold text-primary">
                      ${accommodation.price}
                      <span className="text-sm font-normal text-muted-foreground">/month</span>
                    </div>
                    {accommodation.users?.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Landlord
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{accommodation.description}</p>

                  <div className="flex flex-wrap gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {accommodation.bedrooms} {accommodation.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {accommodation.bathrooms} {accommodation.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
                    </Badge>
                    {accommodation.amenities?.slice(0, 2).map((amenity) => (
                      <Badge key={amenity.id} variant="secondary" className="text-xs">
                        {amenity.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button variant="outline" className="w-full gap-1">
                    <Building className="h-4 w-4" /> View Details
                  </Button>
                  <Button variant="default" className="w-full gap-1">
                    <MessageSquare className="h-4 w-4" /> Contact
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}
