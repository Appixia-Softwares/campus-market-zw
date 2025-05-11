import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { CheckCircle, Filter, Plus, Search } from "lucide-react"
import { getAccommodationListings } from "@/lib/actions/accommodation"
import { OptimizedImage } from "@/components/optimized-image"
import { Suspense } from "react"
import AccommodationLoading from "./loading"

// Room types for filter
const roomTypes = ["All Types", "Single Room", "2-Share", "3-Share", "Self-contained", "Studio"]

export default async function AccommodationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const type = typeof searchParams.type === "string" ? searchParams.type : undefined
  const location = typeof searchParams.location === "string" ? searchParams.location : undefined
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseInt(searchParams.minPrice) : undefined
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseInt(searchParams.maxPrice) : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined
  const verified = searchParams.verified === "true"

  return (
    <Suspense fallback={<AccommodationLoading />}>
      <AccommodationContent
        type={type}
        location={location}
        minPrice={minPrice}
        maxPrice={maxPrice}
        search={search}
        verified={verified}
      />
    </Suspense>
  )
}

async function AccommodationContent({
  type,
  location,
  minPrice,
  maxPrice,
  search,
  verified,
}: {
  type?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  search?: string
  verified: boolean
}) {
  const accommodations = await getAccommodationListings()

  // Filter accommodations based on search parameters
  const filteredAccommodations = accommodations.filter((accommodation) => {
    if (type && type !== "All Types" && accommodation.type !== type) return false
    if (location && !accommodation.location.includes(location)) return false
    if (minPrice && accommodation.price < minPrice) return false
    if (maxPrice && accommodation.price > maxPrice) return false
    if (search && !accommodation.title.toLowerCase().includes(search.toLowerCase())) return false
    if (verified && !accommodation.is_verified) return false
    return true
  })

  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Accommodation</h1>
          <Button asChild>
            <Link href="/accommodation/new">
              <Plus className="w-4 h-4 mr-2" />
              List a Property
            </Link>
          </Button>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          {/* Search and filters for mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="pl-8" />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>

          {/* Sidebar filters for desktop */}
          <Card className="hidden md:block w-64 h-fit sticky top-20">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="mb-2 text-sm font-medium">Search</h3>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="pl-8" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Room Type</h3>
                  <Select defaultValue={type || "All Types"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roomTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Price Range (Monthly)</h3>
                  <Slider defaultValue={[minPrice || 0, maxPrice || 500]} max={500} step={10} className="my-6" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${minPrice || 0}</span>
                    <span className="text-sm">${maxPrice || 500}</span>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Amenities</h3>
                  <div className="space-y-2">
                    {["WiFi", "Furnished", "Private Bathroom", "Security", "Water"].map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input type="checkbox" id={amenity} className="mr-2" />
                        <label htmlFor={amenity} className="text-sm">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Campus</h3>
                  <Select defaultValue={location || "All Campuses"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Campuses">All Campuses</SelectItem>
                      <SelectItem value="UZ">Near UZ</SelectItem>
                      <SelectItem value="NUST">Near NUST</SelectItem>
                      <SelectItem value="MSU">Near MSU</SelectItem>
                      <SelectItem value="HIT">Near HIT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="verified" className="mr-1" checked={verified} />
                  <label htmlFor="verified" className="text-sm flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-blue-500" />
                    Verified Only
                  </label>
                </div>
                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* Listings grid */}
          <div className="flex-1">
            {filteredAccommodations.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredAccommodations.map((accommodation) => (
                  <Link href={`/accommodation/${accommodation.id}`} key={accommodation.id}>
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <div className="relative aspect-square">
                        <OptimizedImage
                          src={
                            accommodation.accommodation_images?.[0]?.image_url ||
                            "/placeholder.svg?height=200&width=300"
                          }
                          alt={accommodation.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-2 right-2">{accommodation.type}</Badge>
                        {accommodation.is_verified && (
                          <div className="absolute top-2 left-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
                            <CheckCircle className="w-3 h-3 text-blue-500" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{accommodation.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{accommodation.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold">${accommodation.price}/mo</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {accommodation.accommodation_amenities?.slice(0, 3).map((amenity) => (
                            <Badge key={amenity.id} variant="outline" className="text-xs">
                              {amenity.amenity}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">{accommodation.location}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No accommodations found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
                <Button asChild className="mt-4">
                  <Link href="/accommodation/new">List a Property</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
