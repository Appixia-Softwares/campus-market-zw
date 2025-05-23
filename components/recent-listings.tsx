import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { CheckCircle2, XCircle } from "lucide-react"

export function RecentListings() {
  const listings = [
    {
      id: 1,
      title: "2 Bedroom Apartment near Campus",
      location: "123 University Ave",
      price: "$650/month",
      status: "Active",
      verified: true,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      title: "Studio Apartment with Utilities",
      location: "456 College St",
      price: "$450/month",
      status: "Active",
      verified: true,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      title: "Shared Room in Student House",
      location: "789 Dorm Lane",
      price: "$350/month",
      status: "Pending",
      verified: false,
      image: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      title: "Private Room with Bathroom",
      location: "101 Campus Drive",
      price: "$500/month",
      status: "Active",
      verified: true,
      image: "/placeholder.svg?height=40&width=40",
    },
  ]

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Listings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={listing.image || "/placeholder.svg"} alt={listing.title} />
                <AvatarFallback>RM</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <Link href={`/landlord/listings/${listing.id}`} className="font-medium hover:underline">
                  {listing.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {listing.location} • {listing.price}
                </p>
              </div>
              <div className="flex space-x-2">
                <Badge variant={listing.status === "Active" ? "default" : "secondary"}>{listing.status}</Badge>
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
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
