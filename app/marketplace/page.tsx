"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Filter,
  Search,
  MessageSquare,
  Heart,
  ChevronDown,
  Plus,
  Building,
  Tag,
  Clock,
  ArrowUpRight,
} from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/database.types"
import { formatDistanceToNow } from "date-fns"

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_categories?: { name: string }
  product_images?: { url: string }[]
}

type Accommodation = Database["public"]["Tables"]["accommodations"]["Row"] & {
  locations?: { name: string; city: string }
  accommodation_types?: { name: string }
  accommodation_images?: { url: string }[]
}

interface FeaturedListing {
  id: string
  title: string
  price: number
  imageUrl: string
  type: string
  listingType: "product" | "accommodation"
}

export default function MarketplacePage() {
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true)
        setError(null)

        // Fetch featured products
        const { data: featuredProducts, error: productsError } = await supabase
          .from("products")
          .select(`
            *,
            product_categories(name),
            product_images(url)
          `)
          .eq("status", "active")
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(4)

        if (productsError) {
          console.error("Error fetching featured products:", productsError)
          throw productsError
        }

        // Fetch featured accommodations
        const { data: featuredAccommodations, error: accommodationsError } = await supabase
          .from("accommodations")
          .select(`
            *,
            locations(name, city),
            accommodation_types(name),
            accommodation_images(url)
          `)
          .eq("status", "available")
          .eq("featured", true)
          .order("created_at", { ascending: false })
          .limit(4)

        if (accommodationsError) {
          console.error("Error fetching featured accommodations:", accommodationsError)
          throw accommodationsError
        }

        // Transform and combine featured listings
        const transformedProducts: FeaturedListing[] = (featuredProducts || []).map((product) => ({
          id: product.id,
          title: product.title,
          price: product.price,
          imageUrl: product.product_images?.[0]?.url || "/placeholder.svg",
          type: product.product_categories?.name || "Product",
          listingType: "product"
        }))

        const transformedAccommodations: FeaturedListing[] = (featuredAccommodations || []).map((accommodation) => ({
          id: accommodation.id,
          title: accommodation.title,
          price: accommodation.price,
          imageUrl: accommodation.accommodation_images?.[0]?.url || "/placeholder.svg",
          type: accommodation.accommodation_types?.name || "Accommodation",
          listingType: "accommodation"
        }))

        setFeaturedListings([...transformedProducts, ...transformedAccommodations])

        // Fetch all products and accommodations for their respective tabs
        const { data: allProducts, error: allProductsError } = await supabase
          .from("products")
          .select(`
            *,
            product_categories(name),
            product_images(url)
          `)
          .eq("status", "active")
          .order("created_at", { ascending: false })

        if (allProductsError) {
          console.error("Error fetching all products:", allProductsError)
          throw allProductsError
        }

        const { data: allAccommodations, error: allAccommodationsError } = await supabase
          .from("accommodations")
          .select(`
            *,
            locations(name, city),
            accommodation_types(name),
            accommodation_images(url)
          `)
          .eq("status", "available")
          .order("created_at", { ascending: false })

        if (allAccommodationsError) {
          console.error("Error fetching all accommodations:", allAccommodationsError)
          throw allAccommodationsError
        }

        if (allProducts) setProducts(allProducts)
        if (allAccommodations) setAccommodations(allAccommodations)

      } catch (err: any) {
        console.error("Error fetching listings:", err)
        setError(err.message || "Failed to load listings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [supabase])

  if (loading) {
    return (
      <div className="container py-8 animate-in fade-in duration-500">
        <div className="flex flex-col gap-6">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video w-full bg-muted" />
                <CardContent className="p-4">
                  <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Error Loading Marketplace</h1>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Campus Marketplace</h1>
          <p className="text-muted-foreground">Discover products and accommodations from your campus community</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search listings..." className="w-full pl-8" />
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="products">Products</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="date-desc">
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Link href="/dashboard/student/listings/new">
            <Button className="w-full md:w-auto gap-1 shadow-sm">
              <Plus className="h-4 w-4" /> Add Listing
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="featured" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="featured">Featured</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="accommodation">Housing</TabsTrigger>
          </TabsList>

          <TabsContent value="featured" className="mt-6 space-y-8">
            {/* Featured Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">Featured Listings</h2>
                  <p className="text-muted-foreground">Handpicked listings from our community</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {featuredListings.map((listing) => (
                  <FeaturedCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6" id="products">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">All Products</h2>
                <p className="text-muted-foreground">Browse all products from students</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accommodation" className="mt-6" id="accommodation">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">All Accommodations</h2>
                <p className="text-muted-foreground">Find your perfect student housing</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accommodations.map((accommodation) => (
                  <AccommodationCard key={accommodation.id} accommodation={accommodation} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function FeaturedCard({ listing }: { listing: FeaturedListing }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300 border-primary/10">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={listing.imageUrl}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground">{listing.type}</Badge>
          <h3 className="text-white font-semibold text-lg">{listing.title}</h3>
          <p className="text-white/90 text-sm">${listing.price.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  )
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={product.product_images?.[0]?.url || "/placeholder.svg"}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
        {product.status === "sold" && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm px-3 py-1">
              Sold
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium line-clamp-1">{product.title}</h3>
            <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {product.condition}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <p>{formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/product/${product.id}`} className="w-full">
          <Button variant="default" className="w-full gap-1">
            <MessageSquare className="h-4 w-4" /> Contact
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function AccommodationCard({ accommodation }: { accommodation: Accommodation }) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all duration-300">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={accommodation.accommodation_images?.[0]?.url || "/placeholder.svg"}
          alt={accommodation.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg"
          }}
        />
        {accommodation.verified && <Badge className="absolute top-3 left-3 bg-green-600 text-white">Verified</Badge>}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-medium text-lg">{accommodation.title}</h3>
            <p className="text-lg font-bold text-primary">${accommodation.price}/month</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {accommodation.status}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-3">{accommodation.description}</p>

        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="h-3 w-3 mr-1" />
          <p>Listed {formatDistanceToNow(new Date(accommodation.created_at), { addSuffix: true })}</p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/accommodation/${accommodation.id}`} className="w-full">
          <Button variant="outline" className="w-full gap-1">
            <Building className="h-4 w-4" /> View Details
          </Button>
        </Link>
        <Button variant="default" className="w-full gap-1">
          <MessageSquare className="h-4 w-4" /> Contact
        </Button>
      </CardFooter>
    </Card>
  )
}
