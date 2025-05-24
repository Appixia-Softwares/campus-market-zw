"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, Phone, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_categories?: { name: string }
  product_images?: { url: string }[]
  users?: { full_name: string; phone?: string }
}

export default function FavoritesPage() {
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  const fetchFavorites = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("saved_items")
        .select(`
          saveable_id,
          products!inner(
            *,
            product_categories(name),
            product_images(url),
            users(full_name, phone)
          )
        `)
        .eq("user_id", user?.id)
        .eq("saveable_type", "product")

      if (error) throw error

      const products = data?.map((item) => item.products).filter(Boolean) as Product[]
      setFavoriteProducts(products || [])
    } catch (err) {
      console.error("Error fetching favorites:", err)
      toast.error("Failed to load favorites")
    } finally {
      setLoading(false)
    }
  }

  const removeFavorite = async (productId: string) => {
    try {
      await supabase
        .from("saved_items")
        .delete()
        .eq("user_id", user?.id)
        .eq("saveable_id", productId)
        .eq("saveable_type", "product")

      setFavoriteProducts((prev) => prev.filter((product) => product.id !== productId))
      toast.success("Removed from favorites")
    } catch (err) {
      console.error("Error removing favorite:", err)
      toast.error("Failed to remove from favorites")
    }
  }

  const contactViaWhatsApp = (product: Product) => {
    const phone = product.users?.phone
    if (!phone) {
      toast.error("Seller's phone number not available")
      return
    }

    let formattedPhone = phone.replace(/\s+/g, "")
    if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+263" + formattedPhone.substring(1)
    }

    const message = `Hi! I'm interested in your "${product.title}" listed on CampusMarket Zimbabwe for $${product.price}. Is it still available?`
    const whatsappUrl = `https://wa.me/${formattedPhone.replace("+", "")}?text=${encodeURIComponent(message)}`

    window.open(whatsappUrl, "_blank")
  }

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">My Favorites</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
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
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">My Favorites</h1>
        <Badge variant="secondary">{favoriteProducts.length} items</Badge>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
          <p className="text-muted-foreground mb-6">Start browsing the marketplace to save items you like</p>
          <Link href="/marketplace">
            <Button>Browse Marketplace</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden group hover:shadow-md transition-all duration-300">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Link href={`/marketplace/products/${product.id}`}>
                  <img
                    src={product.product_images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>

                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                  onClick={() => removeFavorite(product.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>

                {product.status === "sold" && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Badge variant="destructive">Sold</Badge>
                  </div>
                )}
              </div>

              <CardContent className="p-4">
                <Link href={`/marketplace/products/${product.id}`}>
                  <h3 className="font-medium line-clamp-1 hover:text-primary">{product.title}</h3>
                  <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}</span>
                    <Badge variant="outline" className="text-xs">
                      {product.product_categories?.name}
                    </Badge>
                  </div>
                </Link>
              </CardContent>

              <CardFooter className="p-4 pt-0 flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-1"
                  disabled={product.status === "sold"}
                  onClick={() => contactViaWhatsApp(product)}
                >
                  <Phone className="h-4 w-4" /> WhatsApp
                </Button>
                <Link href={`/messages/new?product=${product.id}`} className="flex-1">
                  <Button variant="default" className="w-full gap-1" disabled={product.status === "sold"}>
                    <MessageSquare className="h-4 w-4" /> Message
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
