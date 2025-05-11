import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle, Heart, MessageSquare, Share2 } from "lucide-react"

// Mock data for accommodation details
const accommodation = {
  id: 1,
  title: "Single Room near UZ",
  price: 200,
  type: "Single Room",
  location: "Avondale, 1.2km from UZ",
  description:
    "Furnished single room with shared bathroom and kitchen. The room includes a bed, desk, chair, and wardrobe. Electricity and water are included in the rent. Security is provided 24/7. WiFi is available at an additional cost of $10 per month. The property is located in a quiet neighborhood, perfect for studying.",
  images: [
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ],
  amenities: ["WiFi", "Water", "Electricity", "Security", "Furnished", "Shared Kitchen", "Shared Bathroom"],
  rules: ["No smoking", "No pets", "No overnight guests", "Quiet hours from 10 PM to 6 AM"],
  landlord: {
    id: 3,
    name: "Robert Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    verified: true,
    joinedDate: "March 2022",
  },
  postedDate: "1 week ago",
  verified: true,
  availability: "Available from June 1, 2023",
}

// Mock data for similar accommodations
const similarAccommodations = [
  {
    id: 2,
    title: "2-Share Apartment",
    price: 150,
    type: "2-Share",
    location: "Mount Pleasant, 0.8km from UZ",
    image: "/placeholder.svg?height=200&width=300",
    verified: false,
  },
  {
    id: 3,
    title: "Single Room with Ensuite",
    price: 250,
    type: "Single Room",
    location: "Avondale, 1.5km from UZ",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
  },
  {
    id: 4,
    title: "Studio Apartment",
    price: 300,
    type: "Self-contained",
    location: "Mount Pleasant, 1.0km from UZ",
    image: "/placeholder.svg?height=200&width=300",
    verified: true,
  },
]

export default function AccommodationPage({ params }: { params: { id: string } }) {
  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon">
            <Link href="/accommodation">
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold md:text-2xl">{accommodation.title}</h1>
            {accommodation.verified && (
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-blue-500" />
                <span>Verified</span>
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Accommodation images */}
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-lg">
              <div className="relative aspect-square md:aspect-video">
                <Image
                  src={accommodation.images[0] || "/placeholder.svg"}
                  alt={accommodation.title}
                  fill
                  className="object-cover"
                />
                <Badge className="absolute top-2 right-2">{accommodation.type}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {accommodation.images.slice(1).map((image, index) => (
                <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${accommodation.title} ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Accommodation details */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold">${accommodation.price}/mo</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="icon">
                          <Heart className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{accommodation.location}</p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Button>Apply for Room</Button>
                    <Button variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message Landlord
                    </Button>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="mb-2 font-semibold">Landlord Information</h3>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={accommodation.landlord.avatar || "/placeholder.svg"}
                          alt={accommodation.landlord.name}
                        />
                        <AvatarFallback>{accommodation.landlord.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="font-medium">{accommodation.landlord.name}</p>
                          {accommodation.landlord.verified && (
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Member since {accommodation.landlord.joinedDate}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="mb-2 font-semibold">Availability</h3>
                    <p>{accommodation.availability}</p>
                  </div>
                  <div className="pt-4 border-t">
                    <h3 className="mb-2 font-semibold">Posted</h3>
                    <p>{accommodation.postedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Accommodation details tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="amenities">Amenities</TabsTrigger>
                <TabsTrigger value="rules">Rules</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4">
                <p className="whitespace-pre-line">{accommodation.description}</p>
              </TabsContent>
              <TabsContent value="amenities" className="mt-4">
                <ul className="grid grid-cols-2 gap-2">
                  {accommodation.amenities.map((amenity, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="rules" className="mt-4">
                <ul className="space-y-2">
                  {accommodation.rules.map((rule, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Similar accommodations */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Similar Accommodations</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {similarAccommodations.map((accommodation) => (
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
                    <div className="mt-2 text-xs text-muted-foreground">{accommodation.location}</div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
