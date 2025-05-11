import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { Filter, Plus, Search } from "lucide-react"
import { getMarketplaceListings } from "@/lib/actions/marketplace"
import { OptimizedImage } from "@/components/optimized-image"
import { Suspense } from "react"
import MarketplaceLoading from "./loading"

// Categories for filter
const categories = ["All Categories", "Electronics", "Books", "Clothing", "Home", "Sports", "Other"]

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const condition = typeof searchParams.condition === "string" ? searchParams.condition : undefined
  const location = typeof searchParams.location === "string" ? searchParams.location : undefined
  const minPrice = typeof searchParams.minPrice === "string" ? Number.parseInt(searchParams.minPrice) : undefined
  const maxPrice = typeof searchParams.maxPrice === "string" ? Number.parseInt(searchParams.maxPrice) : undefined
  const search = typeof searchParams.search === "string" ? searchParams.search : undefined

  return (
    <Suspense fallback={<MarketplaceLoading />}>
      <MarketplaceContent
        category={category}
        condition={condition}
        location={location}
        minPrice={minPrice}
        maxPrice={maxPrice}
        search={search}
      />
    </Suspense>
  )
}

async function MarketplaceContent({
  category,
  condition,
  location,
  minPrice,
  maxPrice,
  search,
}: {
  category?: string
  condition?: string
  location?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}) {
  const listings = await getMarketplaceListings()

  // Filter listings based on search parameters
  const filteredListings = listings.filter((listing) => {
    if (category && category !== "All Categories" && listing.category !== category) return false
    if (condition && listing.condition !== condition) return false
    if (location && !listing.location.includes(location)) return false
    if (minPrice && listing.price < minPrice) return false
    if (maxPrice && listing.price > maxPrice) return false
    if (search && !listing.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <Button asChild>
            <Link href="/marketplace/new">
              <Plus className="w-4 h-4 mr-2" />
              List an Item
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
                  <h3 className="mb-2 text-sm font-medium">Category</h3>
                  <Select defaultValue={category || "All Categories"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Price Range</h3>
                  <Slider defaultValue={[minPrice || 0, maxPrice || 1000]} max={1000} step={10} className="my-6" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${minPrice || 0}</span>
                    <span className="text-sm">${maxPrice || 1000}</span>
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Condition</h3>
                  <div className="space-y-2">
                    {["New", "Used - Like New", "Used - Good", "Used - Fair"].map((conditionOption) => (
                      <div key={conditionOption} className="flex items-center">
                        <input
                          type="checkbox"
                          id={conditionOption}
                          className="mr-2"
                          checked={condition === conditionOption}
                        />
                        <label htmlFor={conditionOption} className="text-sm">
                          {conditionOption}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 text-sm font-medium">Location</h3>
                  <Select defaultValue={location || "All Campuses"}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Campuses">All Campuses</SelectItem>
                      <SelectItem value="UZ">UZ Campus</SelectItem>
                      <SelectItem value="NUST">NUST Campus</SelectItem>
                      <SelectItem value="MSU">MSU Campus</SelectItem>
                      <SelectItem value="HIT">HIT Campus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Apply Filters</Button>
              </div>
            </CardContent>
          </Card>

          {/* Listings grid */}
          <div className="flex-1">
            {filteredListings.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredListings.map((listing) => (
                  <Link href={`/marketplace/${listing.id}`} key={listing.id}>
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <div className="relative aspect-square">
                        <OptimizedImage
                          src={listing.marketplace_images?.[0]?.image_url || "/placeholder.svg?height=200&width=300"}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-2 right-2">{listing.category}</Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold truncate">{listing.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{listing.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold">${listing.price}</span>
                          <span className="text-xs text-muted-foreground">{listing.condition}</span>
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">{listing.location}</div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No listings found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
                <Button asChild className="mt-4">
                  <Link href="/marketplace/new">List an Item</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
