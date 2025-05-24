"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface ProductCardProps {
  product: {
    id: string
    title: string
    price: number
    images: { url: string }[]
    condition: string
    created_at: string
    seller: {
      id: string
      full_name: string
    }
    favorites_count: number
    messages_count: number
  }
  onFavorite?: () => void
}

export function ProductCard({ product, onFavorite }: ProductCardProps) {
  const { toast } = useToast()
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleFavorite = async () => {
    try {
      setIsLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Error",
          description: "Please sign in to add favorites",
          variant: "destructive"
        })
        return
      }

      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .match({ user_id: user.id, product_id: product.id })
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: user.id, product_id: product.id })
      }

      setIsFavorited(!isFavorited)
      onFavorite?.()
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: "Failed to update favorite status",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden group">
      <Link href={`/marketplace/products/${product.id}`}>
        <div className="relative aspect-square">
          <Image
            src={product.images[0]?.url || '/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          <Badge className="absolute top-2 right-2">
            {product.condition}
          </Badge>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/marketplace/products/${product.id}`}>
          <h3 className="font-semibold line-clamp-1">{product.title}</h3>
        </Link>
        <p className="text-lg font-bold mt-1">${product.price.toFixed(2)}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Listed by {product.seller.full_name}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFavorite}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          <span>{product.favorites_count}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="flex items-center gap-1"
        >
          <Link href={`/marketplace/products/${product.id}#messages`}>
            <MessageCircle className="h-4 w-4" />
            <span>{product.messages_count}</span>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
} 