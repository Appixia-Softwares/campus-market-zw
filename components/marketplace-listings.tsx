"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Building, MapPin, DollarSign, Calendar, CheckCircle2, XCircle, Package } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "@/lib/database.types"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

type Product = Database["public"]["Tables"]["products"]["Row"]
type Accommodation = Database["public"]["Tables"]["accommodations"]["Row"]
type Location = Database["public"]["Tables"]["locations"]["Row"]

interface Listing {
  id: string
  title: string
  description: string | null
  price: number
  location: string
  type: string
  date: string
  verified: boolean
  image: string
  listingType: "product" | "accommodation"
}

export function MarketplaceListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function fetchListings() {
      try {
        setLoading(true)
        setError(null)

        // Fetch products
        const { data: products, error: productsError } = await supabase
          .from("products")
          .select(`
            *,
            product_categories(name),
            product_images(url)
          `)
          .eq("status", "active")
          .order("created_at", { ascending: false })

        if (productsError) throw productsError

        // Fetch accommodations
        const { data: accommodations, error: accommodationsError } = await supabase
          .from("accommodations")
          .select(`
            *,
            locations(name, city),
            accommodation_types(name),
            accommodation_images(url)
          `)
          .eq("status", "available")
          .order("created_at", { ascending: false })

        if (accommodationsError) throw accommodationsError

        // Transform products
        const transformedProducts: Listing[] = products.map((product) => ({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          location: "Campus Area", // You might want to add location to products table
          type: product.product_categories?.name || "Product",
          date: formatDistanceToNow(new Date(product.created_at), { addSuffix: true }),
          verified: product.verified,
          image: product.product_images?.[0]?.url || "/placeholder.svg",
          listingType: "product"
        }))

        // Transform accommodations
        const transformedAccommodations: Listing[] = accommodations.map((accommodation) => ({
          id: accommodation.id,
          title: accommodation.title,
          description: accommodation.description,
          price: accommodation.price,
          location: `${accommodation.locations?.name}, ${accommodation.locations?.city}`,
          type: accommodation.accommodation_types?.name || "Accommodation",
          date: formatDistanceToNow(new Date(accommodation.created_at), { addSuffix: true }),
          verified: accommodation.verified,
          image: accommodation.accommodation_images?.[0]?.url || "/placeholder.svg",
          listingType: "accommodation"
        }))

        // Combine and sort by date
        const allListings = [...transformedProducts, ...transformedAccommodations]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        setListings(allListings)
      } catch (err) {
        console.error("Error fetching listings:", err)
        setError("Failed to load listings. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchListings()
  }, [supabase])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="overflow-hidden animate-pulse">
            <div className="aspect-video w-full bg-muted" />
            <CardHeader className="p-4">
              <div className="h-6 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-4 bg-muted rounded w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Error Loading Listings</h3>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Listings Found</h3>
        <p className="text-muted-foreground">Be the first to list an item!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <Card key={listing.id} className="overflow-hidden">
          <div className="aspect-video w-full overflow-hidden">
            <img 
              src={listing.image} 
              alt={listing.title} 
              className="object-cover w-full h-full"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg"
              }}
            />
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
              <span>${listing.price.toFixed(2)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Building className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{listing.type}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-1 text-muted-foreground" />
              <span>{listing.date}</span>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link href={`/${listing.listingType}/${listing.id}`} className="w-full">
              <Button className="w-full">View Details</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
