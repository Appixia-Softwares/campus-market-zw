"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Heart, MessageSquare, Share2, MapPin, Calendar, Eye, ChevronLeft, ChevronRight, Flag } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"

interface ProductDetails {
  id: string
  title: string
  description: string | null
  price: number
  original_price: number | null
  condition: string
  status: string
  brand: string | null
  model: string | null
  year_purchased: number | null
  location: string | null
  views: number
  likes: number
  created_at: string
  product_categories: {
    name: string
    description: string | null
  }
  users: {
    id: string
    full_name: string
    email: string
    avatar_url: string | null
    verified: boolean
  }
  product_images: {
    id: string
    url: string
    is_primary: boolean
  }[]
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [product, setProduct] = useState<ProductDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchProduct(params.id as string)
      if (user) {
        checkIfFavorite(params.id as string)
      }
    }
  }, [params.id, user])

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_categories (name, description),
          users (id, full_name, email, avatar_url, verified),
          product_images (id, url, is_primary)
        `)
        .eq("id", productId)
        .single()

      if (error) throw error

      setProduct(data)

      // Increment view count
      await supabase.rpc("increment_product_views", { product_id: productId })
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      })
      router.push("/marketplace")
    } finally {
      setLoading(false)
    }
  }

  const checkIfFavorite = async (productId: string) => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", user.id)
        .eq("product_id", productId)
        .single()

      if (data) {
        setIsFavorite(true)
      }
    } catch (error) {
      // Not a favorite or error - either way, not favorited
      setIsFavorite(false)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save favorites",
        variant: "destructive",
      })
      return
    }

    if (!product) return

    try {
      const { data, error } = await supabase.rpc("toggle_product_like", {
        product_id: product.id,
        user_id: user.id,
      })

      if (error) throw error

      setIsFavorite(!isFavorite)
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              likes: isFavorite ? prev.likes - 1 : prev.likes + 1,
            }
          : null,
      )

      toast({
        title: isFavorite ? "Removed from favorites" : "Added to favorites",
        description: isFavorite ? "Product removed from your favorites" : "Product saved to your favorites",
      })
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      })
    }
  }

  const startConversation = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to contact the seller",
        variant: "destructive",
      })
      return
    }

    if (!product) return

    if (product.users.id === user.id) {
      toast({
        title: "Cannot message yourself",
        description: "You cannot start a conversation with yourself",
        variant: "destructive",
      })
      return
    }

    try {
      // Check if conversation already exists
      const { data: existingConversation, error: conversationError } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(participant_1_id.eq.${user.id},participant_2_id.eq.${product.users.id}),and(participant_1_id.eq.${product.users.id},participant_2_id.eq.${user.id})`,
        )
        .eq("product_id", product.id)
        .single()

      if (existingConversation) {
        router.push(`/messages/${existingConversation.id}`)
        return
      }

      // Create new conversation
      const { data: newConversation, error } = await supabase
        .from("conversations")
        .insert({
          participant_1_id: user.id,
          participant_2_id: product.users.id,
          product_id: product.id,
        })
        .select()
        .single()

      if (error) throw error

      router.push(`/messages/${newConversation.id}`)
    } catch (error) {
      console.error("Error starting conversation:", error)
      toast({
        title: "Error",
        description: "Failed to start conversation",
        variant: "destructive",
      })
    }
  }

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description || "",
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      })
    }
  }

  const nextImage = () => {
    if (product?.product_images) {
      setCurrentImageIndex((prev) => (prev === product.product_images.length - 1 ? 0 : prev + 1))
    }
  }

  const prevImage = () => {
    if (product?.product_images) {
      setCurrentImageIndex((prev) => (prev === 0 ? product.product_images.length - 1 : prev - 1))
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    )
  }

  const images =
    product.product_images.length > 0
      ? product.product_images.sort((a, b) => (a.is_primary ? -1 : 1))
      : [{ id: "placeholder", url: "/placeholder.svg?height=400&width=400", is_primary: true }]

  return (
    <div className="container py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img
              src={images[currentImageIndex]?.url || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`aspect-square rounded-md overflow-hidden ${
                    index === currentImageIndex ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={toggleFavorite}>
                  <Heart className={`h-5 w-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon" onClick={shareProduct}>
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
              {product.original_price && product.original_price > product.price && (
                <p className="text-lg text-muted-foreground line-through">${product.original_price.toFixed(2)}</p>
              )}
              <Badge variant="secondary">{product.condition}</Badge>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{product.views} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{product.likes} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Seller Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={product.users.avatar_url || undefined} />
                  <AvatarFallback>
                    {product.users.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{product.users.full_name}</p>
                    {product.users.verified && (
                      <Badge variant="outline" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">Student seller</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={startConversation}
              className="flex-1"
              disabled={product.status === "sold" || product.users.id === user?.id}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              {product.status === "sold" ? "Sold" : "Contact Seller"}
            </Button>
            <Button variant="outline" size="icon">
              <Flag className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Category</p>
                <p className="font-medium">{product.product_categories.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Condition</p>
                <p className="font-medium">{product.condition}</p>
              </div>
              {product.brand && (
                <div>
                  <p className="text-muted-foreground">Brand</p>
                  <p className="font-medium">{product.brand}</p>
                </div>
              )}
              {product.model && (
                <div>
                  <p className="text-muted-foreground">Model</p>
                  <p className="font-medium">{product.model}</p>
                </div>
              )}
              {product.year_purchased && (
                <div>
                  <p className="text-muted-foreground">Year Purchased</p>
                  <p className="font-medium">{product.year_purchased}</p>
                </div>
              )}
              {product.location && (
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {product.location}
                  </p>
                </div>
              )}
            </div>
          </div>

          {product.description && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
