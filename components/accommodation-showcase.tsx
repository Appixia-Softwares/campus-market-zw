"use client"

import { useEffect, useState } from "react"
import { ArrowRight, Home, MapPin, Users, Bath } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface Accommodation {
  id: string
  title: string
  price: number
  bedrooms: number
  bathrooms: number
  max_occupants: number
  locations: {
    name: string
    city: string
  }
  accommodation_types: {
    name: string
  }
  accommodation_images: {
    url: string
    is_primary: boolean
  }[]
  users: {
    full_name: string
    verified: boolean
  }
}

export default function AccommodationShowcase() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        // Get total count
        const { count } = await supabase
          .from("accommodations")
          .select("*", { count: "exact", head: true })
          .eq("status", "available")

        setTotalCount(count || 0)

        // Get featured accommodations or latest if no featured
        const query = supabase
          .from("accommodations")
          .select(`
            id,
            title,
            price,
            bedrooms,
            bathrooms,
            max_occupants,
            locations(name, city),
            accommodation_types(name),
            accommodation_images(url, is_primary),
            users(full_name, verified)
          `)
          .eq("status", "available")
          .limit(4)

        // Try to get featured accommodations first
        const { data: featuredAccommodations } = await query.eq("featured", true)

        if (featuredAccommodations && featuredAccommodations.length > 0) {
          setAccommodations(featuredAccommodations)
        } else {
          // If no featured accommodations, get latest
          const { data: latestAccommodations } = await query.order("created_at", { ascending: false })
          setAccommodations(latestAccommodations || [])
        }
      } catch (error) {
        console.error("Error fetching accommodations:", error)
        setAccommodations([])
      } finally {
        setLoading(false)
      }
    }

    fetchAccommodations()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">
            <span className="text-gradient">Student Accommodation</span>
          </h3>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-video bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          <span className="text-gradient">Student Accommodation</span>
        </h3>
        <Link href="/accommodation">
          <Button variant="ghost" className="gap-2 group">
            {totalCount > 0 ? `View all ${totalCount} listings` : "Browse accommodation"}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {accommodations.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <Home className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">No accommodations yet</h4>
              <p className="text-muted-foreground">
                Be the first to list accommodation! Students are looking for rooms, flats, and houses near universities.
              </p>
            </div>
            <Link href="/signup">
              <Button className="gap-2">
                <Home className="h-4 w-4" />
                List accommodation
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {accommodations.map((accommodation) => (
            <Card key={accommodation.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-video overflow-hidden bg-gray-100">
                <img
                  src={
                    accommodation.accommodation_images.find((img) => img.is_primary)?.url ||
                    "/placeholder.svg?height=200&width=300" ||
                    "/placeholder.svg"
                  }
                  alt={accommodation.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold line-clamp-1 text-sm">{accommodation.title}</h4>
                    {accommodation.users.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>
                      {accommodation.locations.name}, {accommodation.locations.city}
                    </span>
                  </div>
                  <p className="font-bold text-green-600">ZWL {accommodation.price.toLocaleString()}/month</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      <span>{accommodation.bedrooms} bed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />
                      <span>{accommodation.bathrooms} bath</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{accommodation.max_occupants} max</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">by {accommodation.users.full_name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
