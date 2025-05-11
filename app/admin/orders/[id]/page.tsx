import { createServerClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { ArrowLeft, User, Package, Calendar, MapPin, Clock } from "lucide-react"
import AdminOrderActions from "@/components/admin/admin-order-actions"

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient()

  // Get the order with related data
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      marketplace_listings (
        *,
        marketplace_images (*)
      ),
      profiles!orders_buyer_id_fkey (
        id,
        full_name,
        email,
        avatar_url,
        phone
      ),
      seller:profiles!orders_seller_id_fkey (
        id,
        full_name,
        email,
        avatar_url,
        phone
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !order) {
    notFound()
  }

  // Format dates
  const orderDate = new Date(order.created_at).toLocaleDateString()
  const orderTime = new Date(order.created_at).toLocaleTimeString()
  const meetupDate = order.meetup_date ? new Date(order.meetup_date).toLocaleDateString() : "Not set"
  const meetupTime = order.meetup_time || "Not set"
  const updatedDate = order.updated_at ? new Date(order.updated_at).toLocaleDateString() : orderDate
  const updatedTime = order.updated_at ? new Date(order.updated_at).toLocaleTimeString() : orderTime

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="outline" size="sm" asChild className="mb-2">
            <Link href="/admin/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">Order ID: {order.id}</p>
        </div>
        <Badge
          variant={
            order.status === "completed" || order.status === "received"
              ? "success"
              : order.status === "cancelled"
                ? "destructive"
                : order.status === "shipped"
                  ? "default"
                  : "outline"
          }
          className="text-base py-1 px-3"
        >
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Details about the ordered product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {order.marketplace_listings?.marketplace_images?.[0] ? (
                <img
                  src={order.marketplace_listings.marketplace_images[0].image_url || "/placeholder.svg"}
                  alt={order.marketplace_listings.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ) : (
                <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{order.marketplace_listings?.title}</h3>
                <p className="text-muted-foreground">
                  Category: {order.marketplace_listings?.category || "Not specified"}
                </p>
                <p className="text-muted-foreground">
                  Condition: {order.marketplace_listings?.condition || "Not specified"}
                </p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Price</p>
                <p className="font-medium">${order.marketplace_listings?.price.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{order.quantity}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">${order.total_price.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/marketplace/${order.listing_id}`}>View Product Listing</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Information about the order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Order Date</p>
              </div>
              <p>
                {orderDate} at {orderTime}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Last Updated</p>
              </div>
              <p>
                {updatedDate} at {updatedTime}
              </p>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Meetup Date & Time</p>
              </div>
              <p>
                {meetupDate} at {meetupTime}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Meetup Location</p>
              </div>
              <p>{order.meetup_location || "Not specified"}</p>
            </div>
            {order.notes && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Notes</p>
                <p className="p-2 bg-muted rounded-md">{order.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buyer Information</CardTitle>
            <CardDescription>Details about the buyer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {order.profiles?.avatar_url ? (
                <img
                  src={order.profiles.avatar_url || "/placeholder.svg"}
                  alt={order.profiles.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{order.profiles?.full_name}</h3>
                <p className="text-muted-foreground">{order.profiles?.email}</p>
              </div>
            </div>
            <Separator />
            {order.profiles?.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{order.profiles.phone}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/admin/users/${order.buyer_id}`}>View Buyer Profile</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
            <CardDescription>Details about the seller</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              {order.seller?.avatar_url ? (
                <img
                  src={order.seller.avatar_url || "/placeholder.svg"}
                  alt={order.seller.full_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div>
                <h3 className="font-medium">{order.seller?.full_name}</h3>
                <p className="text-muted-foreground">{order.seller?.email}</p>
              </div>
            </div>
            <Separator />
            {order.seller?.phone && (
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p>{order.seller.phone}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link href={`/admin/users/${order.seller_id}`}>View Seller Profile</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Actions</CardTitle>
          <CardDescription>Manage this order</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminOrderActions order={order} />
        </CardContent>
      </Card>
    </div>
  )
}
