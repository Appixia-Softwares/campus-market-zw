"use client"

import { useEffect, useState } from "react"
import { ArrowRight, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface Product {
  id: string
  title: string
  price: number
  condition: string
  product_categories: {
    name: string
  }
  product_images: {
    url: string
    is_primary: boolean
  }[]
  users: {
    full_name: string
    verified: boolean
  }
}

export default function ProductShowcase() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Get total count
        const { count } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .eq("status", "active")

        setTotalCount(count || 0)

        // Get featured products or latest if no featured
        const query = supabase
          .from("products")
          .select(`
            id,
            title,
            price,
            condition,
            product_categories(name),
            product_images(url, is_primary),
            users(full_name, verified)
          `)
          .eq("status", "active")
          .limit(4)

        // Try to get featured products first
        const { data: featuredProducts } = await query.eq("featured", true)

        if (featuredProducts && featuredProducts.length > 0) {
          setProducts(featuredProducts)
        } else {
          // If no featured products, get latest products
          const { data: latestProducts } = await query.order("created_at", { ascending: false })
          setProducts(latestProducts || [])
        }
      } catch (error) {
        console.error("Error fetching products:", error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold">
            <span className="text-gradient">Student Marketplace</span>
          </h3>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <CardContent className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold">
          <span className="text-gradient">Student Marketplace</span>
        </h3>
        <Link href="/marketplace">
          <Button variant="ghost" className="gap-2 group">
            {totalCount > 0 ? `View all ${totalCount} products` : "Browse marketplace"}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold">No products yet</h4>
              <p className="text-muted-foreground">
                Be the first to list a product on our marketplace! Students will be able to buy textbooks, electronics,
                and more.
              </p>
            </div>
            <Link href="/signup">
              <Button className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Start selling
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <img
                  src={
                    product.product_images.find((img) => img.is_primary)?.url ||
                    "/placeholder.svg?height=200&width=200" ||
                    "/placeholder.svg"
                  }
                  alt={product.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold line-clamp-1 text-sm">{product.title}</h4>
                    {product.users.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{product.product_categories.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-green-600">ZWL {product.price.toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs">
                      {product.condition}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">by {product.users.full_name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
