import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getUserOrders } from "@/lib/actions/orders"
import { getSession } from "@/lib/actions/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { OptimizedImage } from "@/components/optimized-image"
import { formatDistanceToNow } from "date-fns"

export default async function OrdersPage() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/signin?callbackUrl=/orders")
  }

  const buyerOrders = await getUserOrders("buyer")
  const sellerOrders = await getUserOrders("seller")

  return (
    <div className="container px-4 py-6 mx-auto md:py-10">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      <Tabs defaultValue="buying" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="buying">Buying ({buyerOrders.length})</TabsTrigger>
          <TabsTrigger value="selling">Selling ({sellerOrders.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="buying" className="space-y-6">
          {buyerOrders.length > 0 ? (
            buyerOrders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative w-full md:w-32 h-32">
                        <OptimizedImage
                          src={
                            order.marketplace_listings.marketplace_images?.[0]?.image_url ||
                            "/placeholder.svg?height=128&width=128"
                          }
                          alt={order.marketplace_listings.title}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <h3 className="font-semibold text-lg">{order.marketplace_listings.title}</h3>
                          <Badge
                            className={`capitalize w-fit ${
                              order.status === "completed" || order.status === "received"
                                ? "bg-green-500"
                                : order.status === "cancelled"
                                  ? "bg-red-500"
                                  : order.status === "confirmed"
                                    ? "bg-blue-500"
                                    : "bg-yellow-500"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Seller: {order.seller.full_name}</div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between mt-2">
                          <div>
                            <div className="font-medium">
                              ${order.marketplace_listings.price.toFixed(2)} x {order.quantity} ={" "}
                              <span className="font-bold">${order.total_price.toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Ordered {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                            </div>
                          </div>
                          <div className="text-sm">
                            {order.meetup_date && (
                              <div>
                                Meetup: {new Date(order.meetup_date).toLocaleDateString()},{" "}
                                {order.meetup_time || "Time TBD"}
                              </div>
                            )}
                            {order.meetup_location && <div>Location: {order.meetup_location}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">You haven't placed any orders yet.</p>
              <Link href="/marketplace" className="text-primary hover:underline font-medium">
                Browse the marketplace
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="selling" className="space-y-6">
          {sellerOrders.length > 0 ? (
            sellerOrders.map((order) => (
              <Link href={`/orders/${order.id}`} key={order.id}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="relative w-full md:w-32 h-32">
                        <OptimizedImage
                          src={
                            order.marketplace_listings.marketplace_images?.[0]?.image_url ||
                            "/placeholder.svg?height=128&width=128"
                          }
                          alt={order.marketplace_listings.title}
                          fill
                          className="rounded-md object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <h3 className="font-semibold text-lg">{order.marketplace_listings.title}</h3>
                          <Badge
                            className={`capitalize w-fit ${
                              order.status === "completed" || order.status === "received"
                                ? "bg-green-500"
                                : order.status === "cancelled"
                                  ? "bg-red-500"
                                  : order.status === "confirmed"
                                    ? "bg-blue-500"
                                    : "bg-yellow-500"
                            }`}
                          >
                            {order.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">Buyer: {order.profiles.full_name}</div>
                        <div className="flex flex-col md:flex-row md:items-center gap-2 md:justify-between mt-2">
                          <div>
                            <div className="font-medium">
                              ${order.marketplace_listings.price.toFixed(2)} x {order.quantity} ={" "}
                              <span className="font-bold">${order.total_price.toFixed(2)}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Ordered {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                            </div>
                          </div>
                          <div className="text-sm">
                            {order.meetup_date && (
                              <div>
                                Meetup: {new Date(order.meetup_date).toLocaleDateString()},{" "}
                                {order.meetup_time || "Time TBD"}
                              </div>
                            )}
                            {order.meetup_location && <div>Location: {order.meetup_location}</div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p className="mb-4">You haven't received any orders yet.</p>
              <Link href="/marketplace/create" className="text-primary hover:underline font-medium">
                List an item for sale
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
