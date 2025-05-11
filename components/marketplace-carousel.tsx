"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type Listing = {
  id: string
  title: string
  price: number
  condition: string
  location: string
  category: string
  profile?: any
  marketplace_images?: { image_url: string }[]
}

type MarketplaceCarouselProps = {
  listings?: Listing[]
}

export default function MarketplaceCarousel({ listings = [] }: MarketplaceCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null)

  // Use mock data if no listings are provided
  const displayListings =
    listings.length > 0
      ? listings
      : [
          {
            id: "1",
            title: "MacBook Pro 2019",
            price: 800,
            condition: "Used - Good",
            location: "UZ Campus",
            category: "Electronics",
            marketplace_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
          },
          {
            id: "2",
            title: "Calculus Textbook",
            price: 25,
            condition: "Used - Like New",
            location: "NUST Campus",
            category: "Books",
            marketplace_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
          },
          {
            id: "3",
            title: "Desk Lamp",
            price: 15,
            condition: "New",
            location: "MSU Campus",
            category: "Home",
            marketplace_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
          },
          {
            id: "4",
            title: "Scientific Calculator",
            price: 30,
            condition: "Used - Fair",
            location: "HIT Campus",
            category: "Electronics",
            marketplace_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
          },
          {
            id: "5",
            title: "Engineering Drawing Set",
            price: 20,
            condition: "Used - Good",
            location: "UZ Campus",
            category: "Stationery",
            marketplace_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
          },
          {
            id: "6",
            title: "Mini Fridge",
            price: 75,
            condition: "Used - Fair",
            location: "NUST Campus",
            category: "Appliances",
            marketplace_images: [{ image_url: "/placeholder.svg?height=200&width=300" }],
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
            <Link href={`/marketplace/${listing.id}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md h-full">
                <div className="relative aspect-square">
                  <Image
                    src={listing.marketplace_images?.[0]?.image_url || "/placeholder.svg?height=200&width=300"}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                  <Badge className="absolute top-2 right-2">{listing.category}</Badge>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{listing.title}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold">${listing.price}</span>
                    <span className="text-xs text-muted-foreground">{listing.condition}</span>
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
