import { createServerClient } from "@/lib/supabase/server"
import { DataTable } from "@/components/admin/data-table"
import { OrdersColumns } from "@/components/admin/orders-columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminOrdersPage() {
  const supabase = createServerClient()

  // Get all orders with related data
  const { data: orders, error } = await supabase
    .from("orders")
    .select(`
      *,
      marketplace_listings (
        id,
        title,
        price
      ),
      profiles!orders_buyer_id_fkey (
        id,
        full_name,
        email
      ),
      seller:profiles!orders_seller_id_fkey (
        id,
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching orders:", error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage all orders on the platform</p>
        </div>
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">Error loading orders: {error.message}</div>
      </div>
    )
  }

  // Format orders for the data table
  const formattedOrders = orders.map((order) => ({
    id: order.id,
    product: order.marketplace_listings?.title || "Unknown Product",
    buyer: order.profiles?.full_name || "Unknown Buyer",
    buyer_email: order.profiles?.email || "Unknown Email",
    seller: order.seller?.full_name || "Unknown Seller",
    seller_email: order.seller?.email || "Unknown Email",
    amount: `$${order.total_price.toFixed(2)}`,
    status: order.status,
    date: new Date(order.created_at).toLocaleDateString(),
    meetup_date: order.meetup_date ? new Date(order.meetup_date).toLocaleDateString() : "Not set",
    meetup_location: order.meetup_location || "Not set",
  }))

  // Group orders by status
  const pendingOrders = formattedOrders.filter((order) => ["pending", "processing"].includes(order.status))
  const completedOrders = formattedOrders.filter((order) => ["completed", "received"].includes(order.status))
  const cancelledOrders = formattedOrders.filter((order) => order.status === "cancelled")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage all orders on the platform</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Statistics</CardTitle>
          <CardDescription>Overview of order activity on the platform</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{pendingOrders.length}</div>
            <p className="text-muted-foreground">Pending Orders</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{completedOrders.length}</div>
            <p className="text-muted-foreground">Completed Orders</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{cancelledOrders.length}</div>
            <p className="text-muted-foreground">Cancelled Orders</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Orders ({formattedOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingOrders.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedOrders.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledOrders.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <DataTable columns={OrdersColumns} data={formattedOrders} searchKey="product" />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <DataTable columns={OrdersColumns} data={pendingOrders} searchKey="product" />
        </TabsContent>
        <TabsContent value="completed" className="mt-4">
          <DataTable columns={OrdersColumns} data={completedOrders} searchKey="product" />
        </TabsContent>
        <TabsContent value="cancelled" className="mt-4">
          <DataTable columns={OrdersColumns} data={cancelledOrders} searchKey="product" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
