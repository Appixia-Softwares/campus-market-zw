import { createServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, ShoppingBag, Building, Flag } from "lucide-react"
import AdminStatsChart from "@/components/admin/admin-stats-chart"
import AdminRecentActivity from "@/components/admin/admin-recent-activity"

export default async function AdminDashboardPage() {
  const supabase = createServerClient()

  // Get counts
  const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true })
  const { count: marketplaceCount } = await supabase
    .from("marketplace_listings")
    .select("*", { count: "exact", head: true })
  const { count: accommodationCount } = await supabase
    .from("accommodation_listings")
    .select("*", { count: "exact", head: true })
  const { count: reportsCount } = await supabase.from("reports").select("*", { count: "exact", head: true })

  // Get pending verifications count
  const { count: pendingVerificationsCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", false)
    .not("verification_document", "is", null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount || 0}</div>
            <p className="text-xs text-muted-foreground">Registered users on the platform</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Marketplace Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{marketplaceCount || 0}</div>
            <p className="text-xs text-muted-foreground">Active marketplace listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Accommodation Listings</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accommodationCount || 0}</div>
            <p className="text-xs text-muted-foreground">Active accommodation listings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingVerificationsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Verification requests to review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminStatsChart />
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminRecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
