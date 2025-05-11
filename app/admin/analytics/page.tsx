import { getAnalyticsData } from "@/lib/actions/analytics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShoppingBag, Building, MessageSquare } from "lucide-react"
import AdminAnalyticsChart from "@/components/admin/admin-analytics-chart"
import AdminActivityLog from "@/components/admin/admin-activity-log"

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalyticsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Platform performance and user activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.counts.totalUsers}</div>
            <p className="text-xs text-muted-foreground">{analytics.counts.newUsersToday} new today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Marketplace Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.counts.totalMarketplaceListings}</div>
            <p className="text-xs text-muted-foreground">Active marketplace listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Accommodation Listings</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.counts.totalAccommodationListings}</div>
            <p className="text-xs text-muted-foreground">Active accommodation listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.counts.totalMessages}</div>
            <p className="text-xs text-muted-foreground">{analytics.counts.todayMessages} sent today</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders Overview</CardTitle>
          <CardDescription>Summary of order activity on the platform</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{analytics.counts.totalOrders}</div>
            <p className="text-muted-foreground">Total Orders</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{analytics.counts.pendingOrders}</div>
            <p className="text-muted-foreground">Pending Orders</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{analytics.counts.completedOrders}</div>
            <p className="text-muted-foreground">Completed Orders</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="listings">Listings</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAnalyticsChart data={analytics.charts.userGrowth} type="users" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="listings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Listing Growth</CardTitle>
              <CardDescription>Monthly new listings</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAnalyticsChart data={analytics.charts.listingGrowth} type="listings" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Activity</CardTitle>
              <CardDescription>Monthly order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminAnalyticsChart data={analytics.charts.orders} type="orders" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminActivityLog activities={analytics.recentActivity} />
        </CardContent>
      </Card>
    </div>
  )
}
