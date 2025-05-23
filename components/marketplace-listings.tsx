import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, MapPin, DollarSign, Calendar, CheckCircle2, XCircle } from "lucide-react"

export function MarketplaceListings() {
  const listings = [
    {
      id: 1,
      title: "Modern Studio Apartment",
      location: "123 Campus Drive",
      price: "$550/month",
      type: "Studio",
      landlord: "Jane Smith",
      date: "Listed on May 1, 2025",
      verified: true,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 2,
      title: "Spacious 3 Bedroom House",
      location: "456 University Blvd",
      price: "$850/month",
      type: "House",
      landlord: "Mike Johnson",
      date: "Listed on May 5, 2025",
      verified: true,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 3,
      title: "Private Room in Shared Apartment",
      location: "789 College Street",
      price: "$400/month",
      type: "Private Room",
      landlord: "Sarah Williams",
      date: "Listed on May 10, 2025",
      verified: false,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 4,
      title: "Cozy 1 Bedroom Apartment",
      location: "101 Academic Avenue",
      price: "$600/month",
      type: "Apartment",
      landlord: "David Brown",
      date: "Listed on May 12, 2025",
      verified: true,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 5,
      title: "Student Dormitory Room",
      location: "202 Dorm Lane",
      price: "$350/month",
      type: "Shared Room",
      landlord: "Lisa Davis",
      date: "Listed on May 15, 2025",
      verified: false,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: 6,
      title: "Luxury 2 Bedroom Apartment",
      location: "303 Elite Street",
      price: "$750/month",
      type: "Apartment",
      landlord: "Robert Wilson",
      date: "Listed on May 18, 2025",
      verified: true,
      image: "/placeholder.svg?height=200&width=400",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img src={listing.image || "/placeholder.svg"} alt={listing.title} className="object-cover w-full h-full" />
          </div>
          <CardHeader className="p-4">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{listing.title}</CardTitle>
              <Badge
                variant="outline"
                className={`flex items-center gap-1 ${listing.verified ? "text-primary border-primary" : "text-destructive border-destructive"}`}
              >
                {listing.verified ? (
                  <>
                    <CheckCircle2 className="h-3 w-3" />
                    Verified
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3" />
                    Unverified
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{listing.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <DollarSign className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{listing.price}</span>
            </div>
            <div className="flex items-center text-sm">
              <Building className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{listing.type}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{listing.date}</span>
            </div>
            <p className="text-sm text-muted-foreground pt-2">Listed by: {listing.landlord}</p>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Button className="w-full">View Details</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
