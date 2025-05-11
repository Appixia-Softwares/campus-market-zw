import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getOrderById } from "@/lib/actions/orders"
import { getSession } from "@/lib/actions/auth"
import { OrderStatus } from "@/components/order-status"
import { ReviewForm } from "@/components/review-form"
import { redirect } from "next/navigation"
import Link from "next/link"
import { OptimizedImage } from "@/components/optimized-image"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, MapPin, Calendar, Clock, FileText, Phone } from "lucide-react"

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()

  if (!session) {
    redirect(`/auth/signin?callbackUrl=/orders/${params.id}`)
  }

  const order = await getOrderById(params.id)

  if (!order) {
    redirect("/orders")
  }

  const isBuyer = session.user.id === order.buyer_id
  const isSeller = session.user.id === order.seller_id
  const otherParty = isBuyer ? order.seller : order.profiles
  const isCompleted = order.status === "completed" || order.status === "received"
  const canReview = isCompleted && !isBuyer // Only buyers can leave reviews after completion

  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/orders">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Order Details</h1>
        <p className="text-muted-foreground">
          Order placed {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderStatus orderId={order.id} currentStatus={order.status} isBuyer={isBuyer} isSeller={isSeller} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-40 h-40">
                  <OptimizedImage
                    src={
                      order.marketplace_listings.marketplace_images?.[0]?.image_url ||
                      "/placeholder.svg?height=160&width=160"
                    }
                    alt={order.marketplace_listings.title}
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{order.marketplace_listings.title}</h3>
                  <p className="text-muted-foreground mt-1">{order.marketplace_listings.description}</p>
                  <div className="mt-2">
                    <Badge>{order.marketplace_listings.condition}</Badge>
                    <Badge className="ml-2">{order.marketplace_listings.category}</Badge>
                  </div>
                  <div className="mt-4">
                    <div className="font-medium">
                      Price: ${order.marketplace_listings.price.toFixed(2)} x {order.quantity} ={" "}
                      <span className="font-bold">${order.total_price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/marketplace/${order.marketplace_listings.id}`}>View Listing</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meetup Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div>{order.meetup_location || "Not specified"}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Date</div>
                    <div>{order.meetup_date ? new Date(order.meetup_date).toLocaleDateString() : "Not specified"}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Time</div>
                    <div>{order.meetup_time || "Not specified"}</div>
                  </div>
                </div>
                {order.notes && (
                  <div className="flex items-start">
                    <FileText className="w-5 h-5 mr-2 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Notes</div>
                      <div>{order.notes}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {canReview && (
            <Card>
              <CardHeader>
                <CardTitle>Leave a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewForm revieweeId={otherParty.id} revieweeName={otherParty.full_name || "this user"} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{isBuyer ? "Seller" : "Buyer"} Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={otherParty.avatar_url || "/placeholder.svg?height=40&width=40"}
                    alt={otherParty.full_name || ""}
                  />
                  <AvatarFallback>{otherParty.full_name?.[0] || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{otherParty.full_name}</div>
                  <Button asChild variant="link" className="p-0 h-auto text-sm">
                    <Link href={`/profile/${otherParty.id}`}>View Profile</Link>
                  </Button>
                </div>
              </div>
              {otherParty.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{otherParty.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono text-xs">{order.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date Placed:</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge className="capitalize">{order.status}</Badge>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Item Price:</span>
                    <span>${order.marketplace_listings.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantity:</span>
                    <span>{order.quantity}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2">
                    <span>Total:</span>
                    <span>${order.total_price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any issues with this order, please contact the {isBuyer ? "seller" : "buyer"} directly or
                report the issue to our support team.
              </p>
              <Button asChild variant="outline" className="w-full">
                <Link href="/support">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
