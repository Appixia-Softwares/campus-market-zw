"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { ChevronLeft, ChevronRight, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type Accommodation = {
  id: string
  title: string
  price: number
  type: string
  location: string
  is_verified: boolean
  profile?: any
  accommodation_images?: { image_url: string }[]
  accommodation_amenities?: { amenity: string }[]
}

type AccommodationCarouselProps = {
  listings?: Accommodation[]
}

export default function AccommodationCarousel({ listings = [] }: AccommodationCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  // Use mock data if no listings are provided
  const displayListings =
    listings.length > 0
      ? listings
      : [
          {
            id: "1",
            title: "Single Room near UZ",
            price: 200,
            type: "Single Room",
            location: "Avondale, 1.2km from UZ",
            is_verified: true,
            accommodation_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
            accommodation_amenities: [{ amenity: "WiFi" }, { amenity: "Water" }, { amenity: "Security" }],
          },
          {
            id: "2",
            title: "2-Share Apartment",
            price: 150,
            type: "2-Share",
            location: "Mount Pleasant, 0.8km from UZ",
            is_verified: false,
            accommodation_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
            accommodation_amenities: [{ amenity: "WiFi" }, { amenity: "Furnished" }, { amenity: "Parking" }],
          },
          {
            id: "3",
            title: "Self-contained Studio",
            price: 300,
            type: "Self-contained",
            location: "Belvedere, 1.5km from HIT",
            is_verified: true,
            accommodation_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
            accommodation_amenities: [{ amenity: "WiFi" }, { amenity: "Kitchen" }, { amenity: "Private Bathroom" }],
          },
          {
            id: "4",
            title: "3-Share House",
            price: 120,
            type: "3-Share",
            location: "Senga, 0.5km from MSU",
            is_verified: false,
            accommodation_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
            accommodation_amenities: [{ amenity: "WiFi" }, { amenity: "Furnished" }, { amenity: "Garden" }],
          },
          {
            id: "5",
            title: "Bachelor Pad",
            price: 250,
            type: "Studio",
            location: "Hatfield, 2km from UZ",
            is_verified: true,
            accommodation_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
            accommodation_amenities: [{ amenity: "WiFi" }, { amenity: "Furnished" }, { amenity: "Security" }],
          },
          {
            id: "6",
            title: "Shared Cottage",
            price: 180,
            type: "2-Share",
            location: "Borrowdale, 3km from UZ",
            is_verified: false,
            accommodation_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
            accommodation_amenities: [{ amenity: "WiFi" }, { amenity: "Garden" }, { amenity: "Parking" }],
          },
        ]

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const { current } = carouselRef
      const scrollAmount = direction === "left" ? -current.offsetWidth : current.offsetWidth
      current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="relative">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Scroll left</span>
        </Button>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {displayListings.map((listing) => (
          <div key={listing.id} className="min-w-[280px] max-w-[280px] snap-start">
            <Link href={`/accommodation/${listing.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                <div className="relative aspect-square">
                  <Image
                    src={listing.accommodation_images?.[0]?.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2">{listing.type}</Badge>
                  {listing.is_verified && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                      <CheckCircle className="w-3 h-3 text-blue-500" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{listing.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold">${listing.price}/mo</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {listing.accommodation_amenities?.slice(0, 3).map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity.amenity}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">{listing.location}</CardFooter>
              </Card>
            </Link>
          </div>
        ))}
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-background/80 backdrop-blur-sm"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-5 w-5" />
          <span className="sr-only">Scroll right</span>
        </Button>
      </div>
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
