"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageSquare, Tag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRealtime } from "@/lib/realtime-context"
import { useAuth } from "@/lib/auth-context"
import { getProducts, type ProductWithDetails } from "@/lib/api/products"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase-client"

interface MarketplaceGridProps {
  initialProducts?: ProductWithDetails[]
  filters?: {
    category?: string
    condition?: string
    minPrice?: number
    maxPrice?: number
    featured?: boolean
    search?: string
  }
}

export default function MarketplaceGrid({ initialProducts, filters }: MarketplaceGridProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const { subscribeToProducts } = useRealtime()
  const [products, setProducts] = useState<ProductWithDetails[]>(initialProducts || [])
  const [loading, setLoading] = useState(!initialProducts)
  const [favorites, setFavorites] = useState<string[]>([])

  // Fetch products if not provided
  useEffect(() => {
    if (initialProducts) return

    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data, error } = await getProducts(filters)
        if (error) throw error

        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [initialProducts, filters, toast])

  // Fetch user favorites
  useEffect(() => {
    if (!user) return

    const fetchFavorites = async () => {
      try {
        const { data, error } = await supabase
          .from("user_favorites")
          .select("product_id")
          .eq("user_id", user.id)
          .eq("type", "product")

        if (error) throw error

        setFavorites(data.map((fav) => fav.product_id))
      } catch (error) {
        console.error("Error fetching favorites:", error)
      }
    }

    fetchFavorites()
  }, [user])

  // Subscribe to product changes
  useEffect(() => {
    const unsubscribe = subscribeToProducts((payload) => {
      if (payload.eventType === "INSERT") {
        // Check if the new product matches our filters
        const newProduct = payload.new as ProductWithDetails

        // Fetch additional details for the new product
        const fetchDetails = async () => {
          try {
            const { data } = await supabase
              .from("products")
              .select(`
                *,
                product_categories (name, description),
                users (full_name, email, avatar_url, verified),
                product_images (id, url, is_primary)
              `)
              .eq("id", newProduct.id)
              .single()

            if (data) {
              setProducts((prev) => [data, ...prev])

              toast({
                title: "New Product",
                description: `A new product "${data.title}" was just added!`,
              })
            }
          } catch (error) {
            console.error("Error fetching product details:", error)
          }
        }

        fetchDetails()
      } else if (payload.eventType === "UPDATE") {
        // Update the product in our list
        setProducts((prev) => prev.map((prod) => (prod.id === payload.new.id ? { ...prod, ...payload.new } : prod)))
      } else if (payload.eventType === "DELETE") {
        // Remove the product from our list
        setProducts((prev) => prev.filter((prod) => prod.id !== payload.old.id))
      }
    })

    return unsubscribe
  }, [subscribeToProducts, toast])

  // Toggle favorite
  const toggleFavorite = async (productId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save favorites",
        variant: "destructive",
      })
      return
    }

    // Optimistic update
    setFavorites((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else {
        return [...prev, productId]
      }
    })

    try {
      const { error } = await supabase.rpc("toggle_product_like", {
        product_id: productId,
        user_id: user.id,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error toggling favorite:", error)

      // Revert optimistic update
      setFavorites((prev) => {
        if (prev.includes(productId)) {
          return prev.filter((id) => id !== productId)
        } else {
          return [...prev, productId]
        }
      })

      toast({
        title: "Error",
        description: "Failed to update favorites. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Products Found</h3>
        <p className="text-muted-foreground mb-6">We couldn't find any products matching your criteria.</p>
        <Button onClick={() => (window.location.href = "/marketplace")}>Clear Filters</Button>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Link href={`/marketplace/products/${product.id}`} className="block h-full">
              <Card className="overflow-hidden h-full hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.product_images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                    onClick={(e) => toggleFavorite(product.id, e)}
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  {product.status === "sold" && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                      <Badge variant="destructive" className="text-sm px-3 py-1">
                        Sold
                      </Badge>
                    </div>
                  )}
                  {product.featured && (
                    <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Featured</Badge>
                  )}
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium line-clamp-1">{product.title}</h3>
                      <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {product.product_categories?.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <p>{product.location}</p>
                    <div className="mx-1 h-1 w-1 rounded-full bg-muted-foreground"></div>
                    <p>{new Date(product.created_at).toLocaleDateString()}</p>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button variant="default" className="w-full gap-1" disabled={product.status === "sold"}>
                    <MessageSquare className="h-4 w-4" /> Contact
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}
