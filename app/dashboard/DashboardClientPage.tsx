"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  GraduationCap,
  MapPin,
  Calendar,
  CheckCircle,
  AlertCircle,
  Home,
  Package,
  MessageSquare,
  Bell,
  Loader2,
  RefreshCw,
  Activity,
  TrendingUp,
  Eye,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { useRealtime } from "@/lib/realtime-context"
import { useToast } from "@/components/ui/use-toast"
import AnalyticsPage from "./analytics/page"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface DashboardStats {
  accommodations: number
  products: number
  messages: number
  notifications: number
  totalViews: number
  totalLikes: number
}

interface RecentActivity {
  id: string
  type: "accommodation" | "product" | "message" | "booking"
  title: string
  description: string
  created_at: string
  status?: string
}

export default function DashboardClientPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const { subscribeToNotifications, subscribeToMessages } = useRealtime()
  const { toast } = useToast()

  const [stats, setStats] = useState<DashboardStats>({
    accommodations: 0,
    products: 0,
    messages: 0,
    notifications: 0,
    totalViews: 0,
    totalLikes: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [activityLoading, setActivityLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch user stats
  const fetchUserStats = async () => {
    if (!user) return

    try {
      setError(null)

      const [
        { count: accommodationsCount },
        { count: productsCount },
        { count: messagesCount },
        { count: notificationsCount },
        { data: accommodationViews },
        { data: productViews },
        { data: productLikes },
      ] = await Promise.all([
        supabase.from("accommodations").select("*", { count: "exact", head: true }).eq("owner_id", user.id),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("seller_id", user.id),
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user.id)
          .eq("read", false),
        supabase
          .from("notifications")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)
          .eq("read", false),
        supabase.from("accommodations").select("views").eq("owner_id", user.id),
        supabase.from("products").select("views").eq("seller_id", user.id),
        supabase
          .from("product_likes")
          .select("*", { count: "exact", head: true })
          .in(
            "product_id",
            (await supabase.from("products").select("id").eq("seller_id", user.id)).data?.map((p) => p.id) || [],
          ),
      ])

      const totalAccommodationViews = accommodationViews?.reduce((sum, item) => sum + (item.views || 0), 0) || 0
      const totalProductViews = productViews?.reduce((sum, item) => sum + (item.views || 0), 0) || 0

      setStats({
        accommodations: accommodationsCount || 0,
        products: productsCount || 0,
        messages: messagesCount || 0,
        notifications: notificationsCount || 0,
        totalViews: totalAccommodationViews + totalProductViews,
        totalLikes: productLikes?.length || 0,
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
      setError("Failed to load dashboard statistics")
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive",
      })
    } finally {
      setStatsLoading(false)
    }
  }

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    if (!user) return

    try {
      setActivityLoading(true)

      // Get recent accommodations
      const { data: accommodations } = await supabase
        .from("accommodations")
        .select("id, title, created_at, status")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      // Get recent products
      const { data: products } = await supabase
        .from("products")
        .select("id, title, created_at, status")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      // Get recent messages
      const { data: messages } = await supabase
        .from("messages")
        .select("id, content, created_at, sender_id, users!messages_sender_id_fkey(full_name)")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      // Get recent bookings
      const { data: bookings } = await supabase
        .from("bookings")
        .select("id, created_at, status, accommodations(title)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5)

      // Combine and sort all activities
      const activities: RecentActivity[] = [
        ...(accommodations?.map((item) => ({
          id: item.id,
          type: "accommodation" as const,
          title: `Listed accommodation: ${item.title}`,
          description: `Status: ${item.status}`,
          created_at: item.created_at,
          status: item.status,
        })) || []),
        ...(products?.map((item) => ({
          id: item.id,
          type: "product" as const,
          title: `Listed product: ${item.title}`,
          description: `Status: ${item.status}`,
          created_at: item.created_at,
          status: item.status,
        })) || []),
        ...(messages?.map((item) => ({
          id: item.id,
          type: "message" as const,
          title: `Message from ${item.users?.full_name || "Unknown"}`,
          description: item.content.substring(0, 50) + (item.content.length > 50 ? "..." : ""),
          created_at: item.created_at,
        })) || []),
        ...(bookings?.map((item) => ({
          id: item.id,
          type: "booking" as const,
          title: `Booking for ${item.accommodations?.title || "accommodation"}`,
          description: `Status: ${item.status}`,
          created_at: item.created_at,
          status: item.status,
        })) || []),
      ]

      // Sort by date and take the most recent 10
      activities.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setRecentActivity(activities.slice(0, 10))
    } catch (error) {
      console.error("Error fetching recent activity:", error)
      toast({
        title: "Error",
        description: "Failed to load recent activity",
        variant: "destructive",
      })
    } finally {
      setActivityLoading(false)
    }
  }

  // Refresh all data
  const handleRefresh = async () => {
    setRefreshing(true)
    await Promise.all([fetchUserStats(), fetchRecentActivity()])
    setRefreshing(false)
    toast({
      title: "Success",
      description: "Dashboard data refreshed",
    })
  }

  // Initial data fetch
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      fetchUserStats()
      fetchRecentActivity()
    }
  }, [user, loading, router])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return

    const unsubscribeNotifications = subscribeToNotifications(user.id, () => {
      fetchUserStats() // Refresh stats when new notification arrives
    })

    return () => {
      unsubscribeNotifications()
    }
  }, [user, subscribeToNotifications])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-muted-foreground">Unable to load user data</p>
          <Button className="mt-4" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "accommodation":
        return <Home className="h-4 w-4 text-blue-600" />
      case "product":
        return <Package className="h-4 w-4 text-green-600" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      case "booking":
        return <Calendar className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <span className="text-2xl">🇿🇼</span>
            Welcome back, {profile.full_name}!
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your CampusMarket Zimbabwe account</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Badge variant={profile.verified ? "default" : "secondary"}>
            {profile.verified ? (
              <>
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </>
            ) : (
              <>
                <AlertCircle className="h-3 w-3 mr-1" />
                Pending Verification
              </>
            )}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {profile.role}
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* User Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{profile.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">University</p>
                <p className="font-medium">{profile.university?.name || "Not specified"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{profile.university?.location || "Zimbabwe"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-medium">
                  {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "Recently"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accommodations</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats.accommodations}</p>
                )}
              </div>
              <Home className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats.products}</p>
                )}
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Unread Messages</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats.messages}</p>
                )}
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Notifications</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats.notifications}</p>
                )}
              </div>
              <Bell className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                )}
              </div>
              <Eye className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Likes</p>
                {statsLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold">{stats.totalLikes}</p>
                )}
              </div>
              <TrendingUp className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for Zimbabwe students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/landlord/listings/new" className="w-full">
                  <Button className="w-full justify-start" variant="outline">
                    <Home className="mr-2 h-4 w-4" />
                    List Accommodation
                  </Button>
                </Link>
                <Link href="/marketplace/listings/new" className="w-full">
                  <Button className="w-full justify-start" variant="outline">
                    <Package className="mr-2 h-4 w-4" />
                    Sell Item
                  </Button>
                </Link>
                <Link href="/messages" className="w-full">
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    View Messages ({stats.messages})
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
                <CardDescription>Your account verification and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Email Verification</span>
                  <Badge variant={profile.email_verified ? "default" : "secondary"}>
                    {profile.email_verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Phone Verification</span>
                  <Badge variant={profile.phone_verified ? "default" : "secondary"}>
                    {profile.phone_verified ? "Verified" : "Not Set"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Profile Status</span>
                  <Badge variant={profile.status === "active" ? "default" : "secondary"} className="capitalize">
                    {profile.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions on CampusMarket Zimbabwe</CardDescription>
            </CardHeader>
            <CardContent>
              {activityLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                      <div className="mt-1">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {activity.status && (
                        <Badge variant="outline" className="capitalize">
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No recent activity to display.</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start by listing an accommodation or product to see your activity here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}
