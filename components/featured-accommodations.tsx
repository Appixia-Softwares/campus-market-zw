import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

// Mock data for featured accommodations
const featuredAccommodations = [
  {
    id: 1,
    title: "Single Room near UZ",
    price: 200,
    type: "Single Room",
    location: "Avondale, 1.2km from UZ",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
    amenities: ["WiFi", "Water", "Security"],
  },
  {
    id: 2,
    title: "2-Share Apartment",
    price: 150,
    type: "2-Share",
    location: "Mount Pleasant, 0.8km from UZ",
    image: "/placeholder.svg?height=200&width=300",
    verified: false,
    amenities: ["WiFi", "Furnished", "Parking"],
  },
  {
    id: 3,
    title: "Self-contained Studio",
    price: 300,
    type: "Self-contained",
    location: "Belvedere, 1.5km from HIT",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
    amenities: ["WiFi", "Kitchen", "Private Bathroom"],
  },
  {
    id: 4,
    title: "3-Share House",
    price: 120,
    type: "3-Share",
    location: "Senga, 0.5km from MSU",
    image: "/placeholder.svg?height=200&width=300",
    verified: false,
    amenities: ["WiFi", "Furnished", "Garden"],
  },
]

export default function FeaturedAccommodations() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {featuredAccommodations.map((accommodation) => (
        <Link href={`/accommodation/${accommodation.id}`} key={accommodation.id}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square">
              <Image
                src={accommodation.image || "/placeholder.svg"}
                alt={accommodation.title}
                fill
                className="object-cover"
              />
              <Badge className="absolute top-2 right-2">{accommodation.type}</Badge>
              {accommodation.verified && (
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                  <CheckCircle className="w-3 h-3 text-blue-500" />
                  <span className="text-xs font-medium">Verified</span>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold truncate">{accommodation.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold">${accommodation.price}/mo</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {accommodation.amenities.map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 text-xs text-muted-foreground">{accommodation.location}</CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}
