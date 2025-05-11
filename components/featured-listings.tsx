import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

// Mock data for featured listings
const featuredListings = [
  {
    id: 1,
    title: "MacBook Pro 2019",
    price: 800,
    condition: "Used - Good",
    location: "UZ Campus",
    image: "/placeholder.svg?height=200&width=300",
    category: "Electronics",
  },
  {
    id: 2,
    title: "Calculus Textbook",
    price: 25,
    condition: "Used - Like New",
    location: "NUST Campus",
    image: "/placeholder.svg?height=200&width=300",
    category: "Books",
  },
  {
    id: 3,
    title: "Desk Lamp",
    price: 15,
    condition: "New",
    location: "MSU Campus",
    image: "/placeholder.svg?height=200&width=300",
    category: "Home",
  },
  {
    id: 4,
    title: "Scientific Calculator",
    price: 30,
    condition: "Used - Fair",
    location: "HIT Campus",
    image: "/placeholder.svg?height=200&width=300",
    category: "Electronics",
  },
]

export default function FeaturedListings() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {featuredListings.map((listing) => (
        <Link href={`/marketplace/${listing.id}`} key={listing.id}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square">
              <Image src={listing.image || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
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
      ))}
    </div>
  )
}
