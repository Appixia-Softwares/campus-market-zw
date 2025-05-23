"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bath, Bed, CheckCircle, MapPin, Star, Wifi } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

// Mock data for accommodation listings
const MOCK_LISTINGS = [
  {
    id: "1",
    title: "Modern Studio Apartment",
    location: "Main Campus",
    address: "123 University Ave",
    price: 250,
    priceUnit: "month",
    type: "studio",
    beds: 1,
    baths: 1,
    amenities: ["Wifi", "Furnished", "Utilities Included"],
    verified: true,
    rating: 4.8,
    reviewCount: 24,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "2",
    title: "Shared 2-Bedroom Apartment",
    location: "North Campus",
    address: "456 College St",
    price: 180,
    priceUnit: "month",
    type: "shared",
    beds: 2,
    baths: 1,
    amenities: ["Wifi", "Kitchen", "Laundry"],
    verified: true,
    rating: 4.5,
    reviewCount: 18,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "3",
    title: "Private Room in Student House",
    location: "City Center",
    address: "789 Downtown Rd",
    price: 200,
    priceUnit: "month",
    type: "single",
    beds: 1,
    baths: 1,
    amenities: ["Wifi", "Shared Kitchen", "Study Area"],
    verified: false,
    rating: 4.2,
    reviewCount: 12,
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: "4",
    title: "Luxury Student Apartment",
    location: "South Campus",
    address: "101 Campus Drive",
    price: 320,
    priceUnit: "month",
    type: "apartment",
    beds: 2,
    baths: 2,
    amenities: ["Wifi", "Gym", "Pool", "Study Rooms"],
    verified: true,
    rating: 4.9,
    reviewCount: 36,
    image: "/placeholder.svg?height=200&width=300",
  },
]

export default function FeaturedListings() {
  const [listings, setListings] = useState(MOCK_LISTINGS)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <div className="h-48 bg-muted animate-pulse" />
            <CardHeader className="p-4">
              <div className="h-6 bg-muted animate-pulse rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-4 bg-muted animate-pulse rounded w-full mb-2" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <div className="h-10 bg-muted animate-pulse rounded w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <Card key={listing.id || "fallback-key"} className="overflow-hidden h-full flex flex-col">
          <div className="relative">
            <img src={listing.image || "/placeholder.svg"} alt={listing.title} className="w-full h-48 object-cover" />
            {listing.verified && (
              <Badge variant="secondary" className="absolute top-2 right-2 bg-primary text-primary-foreground">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{listing.title || ""}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span className="line-clamp-1">{listing.address || ""}</span>
                </div>
              </div>
              <Badge variant="outline" className="ml-2 whitespace-nowrap">
                {listing.type || ""}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-4 pt-0 flex-grow">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{listing.beds}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span className="text-sm">{listing.baths}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-amber-500 fill-amber-500" />
                <span className="text-sm font-medium">{listing.rating}</span>
                <span className="text-xs text-muted-foreground ml-1">({listing.reviewCount})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-2">
              {listing.amenities.slice(0, 3).map((amenity, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {amenity === "Wifi" && <Wifi className="h-3 w-3 mr-1" />}
                  {amenity}
                </Badge>
              ))}
              {listing.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{listing.amenities.length - 3} more
                </Badge>
              )}
            </div>
          </CardContent>

          <CardFooter className="p-4 pt-0 mt-auto">
            <div className="w-full flex items-center justify-between">
              <div className="font-semibold text-lg">
                ${listing.price}
                <span className="text-xs text-muted-foreground">/{listing.priceUnit}</span>
              </div>
              <Link href={`/accommodation/${listing.id}`}>
                <Button size="sm">View Details</Button>
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
