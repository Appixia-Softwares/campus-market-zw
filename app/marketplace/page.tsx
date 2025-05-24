"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { MessageSquare } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase-client"

interface Product {
  id: string
  title: string
  description: string
  price: number
  product_categories: { name: string } | null
  product_images: { url: string }[] | null
  status: string
  featured: boolean
  created_at: string
}

interface FeaturedListing {
  id: string
  title: string
  price: number
  imageUrl: string
  type: string
  listingType: string
}

const MarketplacePage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([])

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all products
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

      setProducts(allProducts || [])

      // Fetch featured products only
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
        .limit(8)

      if (productsError) {
        console.error("Error fetching featured products:", productsError)
        throw productsError
      }

      // Transform featured products
      const transformedProducts: FeaturedListing[] = (featuredProducts || []).map((product) => ({
        id: product.id,
        title: product.title,
        price: product.price,
        imageUrl: product.product_images?.[0]?.url || "/placeholder.svg",
        type: product.product_categories?.name || "Product",
        listingType: "product",
      }))

      setFeaturedListings(transformedProducts)
    }

    fetchData()
  }, [])

  return (
    <div className="container py-10">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <p className="text-muted-foreground">Browse listings from students</p>
      </div>

      <Tabs defaultValue="featured" className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="featured">Featured</TabsTrigger>
          <TabsTrigger value="products">All Products</TabsTrigger>
        </TabsList>

        <TabsContent value="featured" className="mt-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Featured Products</h2>
                <p className="text-muted-foreground">Handpicked products from our community</p>
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
      </Tabs>
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{product.title}</CardTitle>
        {product.product_categories && (
          <CardDescription className="text-xs text-muted-foreground">{product.product_categories.name}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-md">
          <img
            src={product.product_images?.[0]?.url || "/placeholder.svg"}
            alt={product.title}
            className="object-cover transition-all hover:scale-105"
          />
        </div>
        <div className="text-2xl font-bold py-2">${product.price}</div>
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/marketplace/products/${product.id}`} className="w-full">
          <Button variant="default" className="w-full gap-1">
            <MessageSquare className="h-4 w-4" /> View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

interface FeaturedCardProps {
  listing: FeaturedListing
}

const FeaturedCard: React.FC<FeaturedCardProps> = ({ listing }) => {
  return (
    <Card className="bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{listing.title}</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">{listing.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-md">
          <img
            src={listing.imageUrl || "/placeholder.svg"}
            alt={listing.title}
            className="object-cover transition-all hover:scale-105"
          />
        </div>
        <div className="text-2xl font-bold py-2">${listing.price}</div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/marketplace/${listing.listingType}s/${listing.id}`}>
          <Button variant="outline" className="w-full">
            <MessageSquare className="h-4 w-4 mr-2" /> View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export default MarketplacePage
