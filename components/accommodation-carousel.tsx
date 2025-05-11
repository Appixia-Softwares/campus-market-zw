"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { OptimizedImage } from "@/components/optimized-image"
import Link from "next/link"
import type { Tables } from "@/lib/supabase/database.types"

type AccommodationWithImages = Tables<"accommodation_listings"> & {
  accommodation_images: Tables<"accommodation_images">[]
  profiles?: Tables<"profiles">
}

interface AccommodationCarouselProps {
  accommodations: AccommodationWithImages[]
  title?: string
}

export function AccommodationCarousel({
  accommodations,
  title = "Featured Accommodations",
}: AccommodationCarouselProps) {
  if (!accommodations || accommodations.length === 0) {
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
          {accommodations.map((accommodation) => (
            <CarouselItem key={accommodation.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <Link href={`/accommodation/${accommodation.id}`}>
                <Card className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    <OptimizedImage
                      src={
                        accommodation.accommodation_images?.[0]?.image_url || "/placeholder.svg?height=300&width=400"
                      }
                      alt={accommodation.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                    <Badge className="absolute top-2 right-2">{accommodation.type}</Badge>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold truncate">{accommodation.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{accommodation.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-lg font-bold">${accommodation.price}/mo</span>
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
