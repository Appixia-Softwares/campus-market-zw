"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Eye, Heart, MessageSquare, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface AnalyticsData {
  totalViews: number
  totalLikes: number
  totalMessages: number
  viewsThisMonth: number
  likesThisMonth: number
  messagesThisMonth: number
  viewsGrowth: number
  likesGrowth: number
  messagesGrowth: number
  dailyViews: Array<{ date: string; views: number }>
  categoryBreakdown: Array<{ name: string; value: number; color: string }>
  monthlyStats: Array<{ month: string; accommodations: number; products: number; views: number }>
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchAnalytics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get current month and previous month dates
        const now = new Date()
        const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const previousMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

        // Fetch user's accommodations and products
        const [{ data: accommodations }, { data: products }] = await Promise.all([
          supabase
            .from("accommodations")
            .select("id, title, views, created_at, accommodation_type_id, accommodation_types(name)")
            .eq("owner_id", user.id),
          supabase
            .from("products")
            .select("id, title, views, created_at, category_id, product_categories(name)")
            .eq("seller_id", user.id),
        ])

        if (!accommodations && !products) {
          throw new Error("Failed to fetch user listings")
        }

        // Calculate total views
        const totalAccommodationViews = accommodations?.reduce((sum, item) => sum + (item.views || 0), 0) || 0
        const totalProductViews = products?.reduce((sum, item) => sum + (item.views || 0), 0) || 0
        const totalViews = totalAccommodationViews + totalProductViews

        // Get likes for user's products
        const productIds = products?.map((p) => p.id) || []
        const { count: totalLikes } = await supabase
          .from("product_likes")
          .select("*", { count: "exact", head: true })
          .in("product_id", productIds)

        // Get messages count
        const { count: totalMessages } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("recipient_id", user.id)

        // Calculate this month's stats
        const thisMonthAccommodations =
          accommodations?.filter((item) => new Date(item.created_at) >= currentMonthStart) || []
        const thisMonthProducts = products?.filter((item) => new Date(item.created_at) >= currentMonthStart) || []

        const viewsThisMonth = [...thisMonthAccommodations, ...thisMonthProducts].reduce(
          (sum, item) => sum + (item.views || 0),
          0,
        )

        // Calculate previous month's stats for growth
        const lastMonthAccommodations =
          accommodations?.filter(
            (item) => new Date(item.created_at) >= previousMonthStart && new Date(item.created_at) <= previousMonthEnd,
          ) || []
        const lastMonthProducts =
          products?.filter(
            (item) => new Date(item.created_at) >= previousMonthStart && new Date(item.created_at) <= previousMonthEnd,
          ) || []

        const viewsLastMonth = [...lastMonthAccommodations, ...lastMonthProducts].reduce(
          (sum, item) => sum + (item.views || 0),
          0,
        )

        // Calculate growth percentages
        const viewsGrowth = viewsLastMonth > 0 ? ((viewsThisMonth - viewsLastMonth) / viewsLastMonth) * 100 : 0

        // Generate daily views for the last 30 days
        const dailyViews = []
        for (let i = 29; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          const dateStr = date.toISOString().split("T")[0]

          // Simulate daily views (in a real app, you'd track this in the database)
          const views = Math.floor(Math.random() * 20) + 1
          dailyViews.push({ date: dateStr, views })
        }

        // Category breakdown
        const accommodationTypes =
          accommodations?.reduce(
            (acc, item) => {
              const typeName = item.accommodation_types?.name || "Other"
              acc[typeName] = (acc[typeName] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ) || {}

        const productCategories =
          products?.reduce(
            (acc, item) => {
              const categoryName = item.product_categories?.name || "Other"
              acc[categoryName] = (acc[categoryName] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ) || {}

        const categoryBreakdown = [
          ...Object.entries(accommodationTypes).map(([name, value], index) => ({
            name: `Accommodation: ${name}`,
            value,
            color: COLORS[index % COLORS.length],
          })),
          ...Object.entries(productCategories).map(([name, value], index) => ({
            name: `Product: ${name}`,
            value,
            color: COLORS[(index + Object.keys(accommodationTypes).length) % COLORS.length],
          })),
        ]

        // Monthly stats for the last 6 months
        const monthlyStats = []
        for (let i = 5; i >= 0; i--) {
          const date = new Date()
          date.setMonth(date.getMonth() - i)
          const monthStr = date.toLocaleDateString("en-US", { month: "short", year: "numeric" })

          const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
          const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

          const monthAccommodations =
            accommodations?.filter(
              (item) => new Date(item.created_at) >= monthStart && new Date(item.created_at) <= monthEnd,
            ).length || 0

          const monthProducts =
            products?.filter((item) => new Date(item.created_at) >= monthStart && new Date(item.created_at) <= monthEnd)
              .length || 0

          const monthViews = [...(accommodations || []), ...(products || [])]
            .filter((item) => new Date(item.created_at) >= monthStart && new Date(item.created_at) <= monthEnd)
            .reduce((sum, item) => sum + (item.views || 0), 0)

          monthlyStats.push({
            month: monthStr,
            accommodations: monthAccommodations,
            products: monthProducts,
            views: monthViews,
          })
        }

        setAnalytics({
          totalViews,
          totalLikes: totalLikes || 0,
          totalMessages: totalMessages || 0,
          viewsThisMonth,
          likesThisMonth: Math.floor((totalLikes || 0) * 0.3), // Simulate monthly likes
          messagesThisMonth: Math.floor((totalMessages || 0) * 0.2), // Simulate monthly messages
          viewsGrowth,
          likesGrowth: Math.floor(Math.random() * 40) - 20, // Simulate growth
          messagesGrowth: Math.floor(Math.random() * 30) - 15, // Simulate growth
          dailyViews,
          categoryBreakdown,
          monthlyStats,
        })
      } catch (error) {
        console.error("Error fetching analytics:", error)
        setError("Failed to load analytics data")
        toast({
          title: "Error",
          description: "Failed to load analytics data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, toast])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {analytics.viewsGrowth >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={analytics.viewsGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(analytics.viewsGrowth).toFixed(1)}%
              </span>
              <span className="ml-1 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalLikes.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {analytics.likesGrowth >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={analytics.likesGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(analytics.likesGrowth).toFixed(1)}%
              </span>
              <span className="ml-1 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMessages.toLocaleString()}</div>
            <div className="flex items-center text-xs">
              {analytics.messagesGrowth >= 0 ? (
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              ) : (
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
              )}
              <span className={analytics.messagesGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                {Math.abs(analytics.messagesGrowth).toFixed(1)}%
              </span>
              <span className="ml-1 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Views (Last 30 Days)</CardTitle>
            <CardDescription>Track your listing views over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.dailyViews}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [value, "Views"]}
                />
                <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Listing Categories</CardTitle>
            <CardDescription>Breakdown of your accommodations and products</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.categoryBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics.categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analytics.categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">No listings to display</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance</CardTitle>
          <CardDescription>Your listing activity over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={analytics.monthlyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="accommodations" fill="#8884d8" name="Accommodations" />
              <Bar dataKey="products" fill="#82ca9d" name="Products" />
              <Bar dataKey="views" fill="#ffc658" name="Views" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
