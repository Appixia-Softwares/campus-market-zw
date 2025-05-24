"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Trash2, Eye, Heart, Plus, MoreVertical, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/database.types"
import { formatDistanceToNow } from "date-fns"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { deleteProductAction, markProductAsSoldAction } from "@/app/actions/product"

type Product = Database["public"]["Tables"]["products"]["Row"] & {
  product_categories?: { name: string }
  product_images?: { url: string }[]
}

export default function MyListingsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("active")
  const { user } = useAuth()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    if (user) {
      fetchMyProducts()
    }
  }, [user])

  const fetchMyProducts = async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          product_categories(name),
          product_images(url)
        `)
        .eq("seller_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error("Error fetching my products:", err)
      toast.error("Failed to load your listings")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsSold = async (productId: string) => {
    try {
      const result = await markProductAsSoldAction(productId)
      if (result.success) {
        setProducts((prev) =>
          prev.map((product) => (product.id === productId ? { ...product, status: "sold" as const } : product)),
        )
        toast.success("Product marked as sold")
      } else {
        toast.error(result.error || "Failed to mark as sold")
      }
    } catch (err) {
      console.error("Error marking as sold:", err)
      toast.error("Failed to mark as sold")
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return

    try {
      const result = await deleteProductAction(productId)
      if (result.success) {
        setProducts((prev) => prev.filter((product) => product.id !== productId))
        toast.success("Product deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete product")
      }
    } catch (err) {
      console.error("Error deleting product:", err)
      toast.error("Failed to delete product")
    }
  }

  const getFilteredProducts = (status: string) => {
    switch (status) {
      case "active":
        return products.filter((p) => p.status === "active")
      case "sold":
        return products.filter((p) => p.status === "sold")
      case "pending":
        return products.filter((p) => p.status === "pending")
      default:
        return products
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "sold":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">My Listings</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
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
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Link href="/marketplace/listings/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Listing
          </Button>
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({products.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({getFilteredProducts("active").length})</TabsTrigger>
          <TabsTrigger value="sold">Sold ({getFilteredProducts("sold").length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({getFilteredProducts("pending").length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <ProductGrid products={products} onMarkAsSold={handleMarkAsSold} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          <ProductGrid
            products={getFilteredProducts("active")}
            onMarkAsSold={handleMarkAsSold}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="sold" className="mt-6">
          <ProductGrid products={getFilteredProducts("sold")} onMarkAsSold={handleMarkAsSold} onDelete={handleDelete} />
        </TabsContent>

        <TabsContent value="pending" className="mt-6">
          <ProductGrid
            products={getFilteredProducts("pending")}
            onMarkAsSold={handleMarkAsSold}
            onDelete={handleDelete}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProductGrid({
  products,
  onMarkAsSold,
  onDelete,
}: {
  products: Product[]
  onMarkAsSold: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="h-12 w-12 mx-auto text-muted-foreground mb-4">📦</div>
        <h3 className="text-lg font-medium mb-2">No listings found</h3>
        <p className="text-muted-foreground mb-6">Start selling by creating your first listing</p>
        <Link href="/marketplace/listings/new">
          <Button>Create Listing</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <img
              src={product.product_images?.[0]?.url || "/placeholder.svg?height=300&width=300"}
              alt={product.title}
              className="w-full h-full object-cover"
            />

            <Badge variant={getStatusColor(product.status) as any} className="absolute top-2 left-2">
              {product.status}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/50 hover:bg-background/80"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/marketplace/products/${product.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/marketplace/listings/edit/${product.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                {product.status === "active" && (
                  <DropdownMenuItem onClick={() => onMarkAsSold(product.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark as Sold
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onDelete(product.id)} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <CardContent className="p-4">
            <h3 className="font-medium line-clamp-1">{product.title}</h3>
            <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{product.description}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{product.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{product.likes}</span>
                </div>
              </div>
              <span>{formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
