import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"

interface MarketplacePreviewProps {
  userId: string
}

export async function MarketplacePreview({ userId }: MarketplacePreviewProps) {
  // Fetch recent products from Supabase
  const { data: products } = await supabase
    .from("products")
    .select(`
      id,
      title,
      price,
      created_at,
      status,
      product_images(url, is_primary),
      product_categories(name)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(3)

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No products available</p>
        <Button asChild className="mt-4">
          <Link href="/marketplace">Browse Marketplace</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const primaryImage = product.product_images.find((img) => img.is_primary)?.url || product.product_images[0]?.url

        return (
          <Link
            key={product.id}
            href={`/marketplace/products/${product.id}`}
            className="flex items-center gap-4 p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={primaryImage || "/placeholder.svg?height=64&width=64"}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm leading-none truncate">{product.title}</p>
                <Badge variant="outline" className="ml-2">
                  {product.product_categories.name}
                </Badge>
              </div>
              <p className="mt-1 font-bold text-primary">${product.price}</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
              </p>
            </div>
          </Link>
        )
      })}

      <div className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/marketplace">View All Products</Link>
        </Button>
      </div>
    </div>
  )
}
