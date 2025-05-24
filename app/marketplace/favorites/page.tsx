"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface FavoriteProduct {
  id: string
  product_id: string
  created_at: string
  products: {
    id: string
    title: string
    description: string | null
    price: number
    condition: string
    status: string
    created_at: string
    product_categories: {
      name: string
    }
    product_images: {
      url: string
    }[]
    users: {
      full_name: string
    }
  }
}

export default function FavoritesPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("user_favorites")
        .select(`
          *,
          products (
            *,
            product_categories (name),
            product_images (url),
            users (full_name)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) throw error

      setFavorites(data || [])
    } catch (error) {
      console.error("Error fetching favorites:", error)
      toast({
        title: "Error",
        description: "Failed to load your favorites",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (favoriteId: string, productId: string) => {
    try {
      const { error } = await supabase.from("user_favorites").delete().eq("id", favoriteId)

      if (error) throw error

      // Update likes count
      await supabase.rpc("toggle_product_like", {
        product_id: productId,
        user_id: user!.id,
      })

      setFavorites((prev) => prev.filter((f) => f.id !== favoriteId))
      toast({
        title: "Removed from favorites",
        description: "Product removed from your favorites",
      })
    } catch (error) {
      console.error("Error removing favorite:", error)
      toast({
        title: "Error",
        description: "Failed to remove from favorites",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Favorites</h1>
          <p className="text-muted-foreground">Products you've saved for later</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-4">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <p className="text-muted-foreground">Products you've saved for later</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Heart className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">Start browsing products and save the ones you like</p>
          <Link href="/marketplace">
            <Button>Browse Products</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((favorite) => {
            const product = favorite.products
            return (
              <Card key={favorite.id} className="overflow-hidden group hover:shadow-md transition-shadow duration-300">
                <div className="relative aspect-square overflow-hidden">
                  <img
                    src={product.product_images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                    onClick={() => removeFavorite(favorite.id, product.id)}
                  >
                    <Heart className="h-5 w-5 fill-primary text-primary" />
                  </Button>
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
                      {product.product_categories?.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>By {product.users?.full_name}</span>
                    <span>{formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}</span>
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Link href={`/marketplace/products/${product.id}`} className="flex-1">
                    <Button variant="outline" className="w-full gap-1">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFavorite(favorite.id, product.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
