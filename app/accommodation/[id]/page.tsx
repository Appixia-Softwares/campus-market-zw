import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Heart,
  Info,
  MapPin,
  MessageSquare,
  Phone,
  Share2,
  Star,
  User,
} from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import PropertyGallery from "@/components/property-gallery"
import PropertyAmenities from "@/components/property-amenities"
import BookingForm from "@/components/booking-form"

export default function AccommodationDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the property data based on the ID
  const property = {
    id: params.id,
    title: "Modern Studio Apartment",
    description:
      "A beautiful, fully furnished studio apartment perfect for students. Located just 5 minutes walk from the Main Campus, this property offers comfort and convenience.",
    longDescription:
      "This modern studio apartment is designed with students in mind. The open-plan living space includes a comfortable bed, study desk, and a small kitchenette. The bathroom is clean and modern with a shower. The apartment is fully furnished and includes all utilities (water, electricity, and internet). The building has 24/7 security and a common laundry room. It's located in a quiet neighborhood, just a 5-minute walk from the Main Campus and close to shops, restaurants, and public transportation.",
    location: "Main Campus",
    address: "123 University Ave, Campus Town",
    price: 250,
    priceUnit: "month",
    type: "studio",
    size: "25m²",
    beds: 1,
    baths: 1,
    amenities: ["Wifi", "Furnished", "Utilities Included", "Study Desk", "Kitchenette", "Security", "Laundry Room"],
    verified: true,
    rating: 4.8,
    reviewCount: 24,
    availableFrom: "2023-09-01",
    landlord: {
      name: "John Smith",
      phone: "+1234567890",
      email: "john@example.com",
      responseRate: 95,
      responseTime: "within 1 hour",
      verified: true,
      image: "/placeholder.svg?height=100&width=100",
    },
    images: [
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
      "/placeholder.svg?height=400&width=600",
    ],
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b sticky top-0 z-10 bg-background">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Agripa</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                Dashboard
              </Button>
            </Link>
            <Link href="/accommodation">
              <Button variant="ghost" size="sm">
                Accommodation
              </Button>
            </Link>
            <Link href="/bookings">
              <Button variant="ghost" size="sm">
                My Bookings
              </Button>
            </Link>
            <ModeToggle />
            <Link href="/profile">
              <Button variant="outline" size="icon" className="rounded-full">
                <span className="sr-only">Profile</span>
                <img src="/placeholder.svg?height=32&width=32" alt="Profile" className="rounded-full h-8 w-8" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Link href="/accommodation" className="text-sm text-muted-foreground hover:underline">
                    Accommodation
                  </Link>
                  <span className="text-sm text-muted-foreground">/</span>
                  <span className="text-sm">{property.title}</span>
                </div>
                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                <div className="flex items-center text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{property.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  {property.verified && (
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge variant="outline">{property.type}</Badge>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-amber-500 fill-amber-500" />
                    <span className="text-sm font-medium">{property.rating}</span>
                    <span className="text-xs text-muted-foreground ml-1">({property.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <PropertyGallery images={property.images} />

                <div className="mt-6">
                  <Tabs defaultValue="details">
                    <TabsList className="w-full justify-start">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="amenities">Amenities</TabsTrigger>
                      <TabsTrigger value="reviews">Reviews</TabsTrigger>
                      <TabsTrigger value="location">Location</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Property Details</CardTitle>
                          <CardDescription>Complete information about this accommodation</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <p>{property.longDescription}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">Type</span>
                              <span className="font-medium">{property.type}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">Size</span>
                              <span className="font-medium">{property.size}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">Bedrooms</span>
                              <span className="font-medium">{property.beds}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm text-muted-foreground">Bathrooms</span>
                              <span className="font-medium">{property.baths}</span>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-medium mb-2">Availability</h3>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span>Available from {new Date(property.availableFrom).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="amenities" className="mt-4">
                      <PropertyAmenities amenities={property.amenities} />
                    </TabsContent>

                    <TabsContent value="reviews" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Reviews</CardTitle>
                          <CardDescription>What students are saying about this accommodation</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center gap-2 mb-4">
                            <div className="bg-primary/10 rounded-full p-2">
                              <Star className="h-6 w-6 text-primary fill-primary" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold">{property.rating}</div>
                              <div className="text-sm text-muted-foreground">{property.reviewCount} reviews</div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            {/* This would be a list of reviews in a real app */}
                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <img
                                  src="/placeholder.svg?height=40&width=40"
                                  alt="Reviewer"
                                  className="rounded-full h-10 w-10"
                                />
                                <div>
                                  <div className="font-medium">Sarah Johnson</div>
                                  <div className="text-sm text-muted-foreground">June 2023</div>
                                </div>
                                <div className="ml-auto flex items-center">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <span className="ml-1">4.9</span>
                                </div>
                              </div>
                              <p className="text-sm">
                                Great place to stay! The location is perfect, just a short walk to campus. The apartment
                                is clean, modern, and has everything I need. The landlord is very responsive and
                                helpful.
                              </p>
                            </div>

                            <div className="p-4 border rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <img
                                  src="/placeholder.svg?height=40&width=40"
                                  alt="Reviewer"
                                  className="rounded-full h-10 w-10"
                                />
                                <div>
                                  <div className="font-medium">Michael Brown</div>
                                  <div className="text-sm text-muted-foreground">May 2023</div>
                                </div>
                                <div className="ml-auto flex items-center">
                                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                                  <span className="ml-1">4.7</span>
                                </div>
                              </div>
                              <p className="text-sm">
                                I've been living here for a semester and I'm very happy with my choice. The studio is
                                comfortable and has good natural light. The internet is fast and reliable, which is
                                important for online classes.
                              </p>
                            </div>

                            <Button variant="outline" className="w-full">
                              View All Reviews
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="location" className="mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Location</CardTitle>
                          <CardDescription>{property.address}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                              <p className="text-muted-foreground">Map view would be displayed here</p>
                              <Button variant="outline" className="mt-2">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View on Map
                              </Button>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <h3 className="font-medium">Nearby</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-sm">Main Campus (5 min walk)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-sm">Grocery Store (7 min walk)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-sm">Bus Stop (3 min walk)</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="text-sm">Cafes & Restaurants (10 min walk)</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="md:col-span-1">
                <div className="space-y-6">
                  <Card className="sticky top-24">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>${property.price}</span>
                        <span className="text-sm font-normal text-muted-foreground">per {property.priceUnit}</span>
                      </CardTitle>
                      <CardDescription>
                        Available from {new Date(property.availableFrom).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <BookingForm propertyId={property.id} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Landlord Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-4">
                        <img
                          src={property.landlord.image || "/placeholder.svg"}
                          alt={property.landlord.name}
                          className="rounded-full h-12 w-12"
                        />
                        <div>
                          <div className="font-medium flex items-center">
                            {property.landlord.name}
                            {property.landlord.verified && <CheckCircle className="h-4 w-4 ml-1 text-primary" />}
                          </div>
                          <div className="text-sm text-muted-foreground">Landlord</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Responds {property.landlord.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{property.landlord.responseRate}% response rate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Member since 2022</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <Button variant="outline" className="w-full">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message Landlord
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center">
                        <Info className="h-5 w-5 mr-2" />
                        Safety Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                            1
                          </div>
                          <span>Always verify the landlord's identity before making payments</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                            2
                          </div>
                          <span>Use our secure payment system to protect your money</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                            3
                          </div>
                          <span>Report suspicious listings or behavior to our support team</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-card mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Building className="h-5 w-5 text-primary" />
              <span className="font-semibold">Agripa</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Agripa. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
