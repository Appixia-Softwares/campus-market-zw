"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { OptimizedImage } from "@/components/optimized-image"
import Link from "next/link"
import type { Tables } from "@/lib/supabase/database.types"

type ListingWithImages = Tables<"marketplace_listings"> & {
  marketplace_images: Tables<"marketplace_images">[]
  profiles?: Tables<"profiles">
}

interface MarketplaceCarouselProps {
  listings: ListingWithImages[]
  title?: string
}

export function MarketplaceCarousel({ listings, title = "Featured Listings" }: MarketplaceCarouselProps) {
  if (!listings || listings.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {listings.map((listing) => (
            <CarouselItem key={listing.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Link href={`/marketplace/${listing.id}`}>
                <Card className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <OptimizedImage
                      src={listing.marketplace_images?.[0]?.image_url || "/placeholder.svg?height=300&width=400"}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2">{listing.category}</Badge>
                    <Badge className="absolute top-2 left-2" variant="outline">
                      {listing.condition}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{listing.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{listing.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold">${listing.price}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  )
}
