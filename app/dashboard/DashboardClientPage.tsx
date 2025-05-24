"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingBag, MessageSquare, Plus, Eye, Heart } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { supabase } from "@/lib/supabase"

interface DashboardStats {
  totalListings: number
  activeListings: number
  totalViews: number
  totalMessages: number
  favoriteCount: number
  totalSales: number
}

interface RecentListing {
  id: string
  title: string
  price: number
  status: string
  views: number
  created_at: string
  images: string[]
}

interface RecentMessage {
  id: string
  sender_name: string
  content: string
  created_at: string
  product_title: string
}

export default function DashboardClientPage() {
  const { user, profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    activeListings: 0,
    totalViews: 0,
    totalMessages: 0,
    favoriteCount: 0,
    totalSales: 0,
  })
  const [recentListings, setRecentListings] = useState<RecentListing[]>([])
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      // Fetch user's listings stats
      const { data: listings, error: listingsError } = await supabase
        .from("marketplace_items")
        .select("id, title, price, status, views, created_at, images")
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })

      if (listingsError) throw listingsError

      // Calculate stats
      const totalListings = listings?.length || 0
      const activeListings = listings?.filter((item) => item.status === "available").length || 0
      const totalViews = listings?.reduce((sum, item) => sum + (item.views || 0), 0) || 0

      // Fetch messages count
      const { count: messagesCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)

      // Fetch favorites count
      const { count: favoritesCount } = await supabase
        .from("favorites")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      // Fetch recent messages
      const { data: messages } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          created_at,
          sender:sender_id(full_name),
          marketplace_item:marketplace_item_id(title)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order("created_at", { ascending: false })
        .limit(5)

      setStats({
        totalListings,
        activeListings,
        totalViews,
        totalMessages: messagesCount || 0,
        favoriteCount: favoritesCount || 0,
        totalSales: 0, // Will implement when order system is added
      })

      setRecentListings(listings?.slice(0, 5) || [])
      setRecentMessages(
        messages?.map((msg) => ({
          id: msg.id,
          sender_name: msg.sender?.full_name || "Unknown",
          content: msg.content,
          created_at: msg.created_at,
          product_title: msg.marketplace_item?.title || "Unknown Product",
        })) || [],
      )
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Welcome back, {profile?.full_name || user?.email?.split("@")[0]}!
        </h2>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/marketplace/sell">
              <Plus className="mr-2 h-4 w-4" />
              Sell Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalListings}</div>
            <p className="text-xs text-muted-foreground">{stats.activeListings} active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">Across all listings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
            <p className="text-xs text-muted-foreground">Total conversations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteCount}</div>
            <p className="text-xs text-muted-foreground">Items you liked</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Tabs defaultValue="listings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="listings">Recent Listings</TabsTrigger>
          <TabsTrigger value="messages">Recent Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Listings</CardTitle>
              <CardDescription>Manage and track your marketplace items</CardDescription>
            </CardHeader>
            <CardContent>
              {recentListings.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No listings yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first listing.</p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link href="/marketplace/sell">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Listing
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentListings.map((listing) => (
                    <div key={listing.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                        {listing.images && listing.images.length > 0 ? (
                          <img
                            src={listing.images[0] || "/placeholder.svg"}
                            alt={listing.title}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatPrice(listing.price)} • {listing.views || 0} views
                        </p>
                        <p className="text-xs text-muted-foreground">{formatDate(listing.created_at)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={listing.status === "available" ? "default" : "secondary"}>
                          {listing.status}
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/marketplace/products/${listing.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  <div className="text-center">
                    <Button variant="outline" asChild>
                      <Link href="/marketplace/my-listings">View All Listings</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Latest conversations about your listings</CardDescription>
            </CardHeader>
            <CardContent>
              {recentMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold text-gray-900">No messages yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Messages from interested buyers will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="flex items-start space-x-4 p-4 border rounded-lg">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-foreground">
                          {message.sender_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900">{message.sender_name}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(message.created_at)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">Re: {message.product_title}</p>
                        <p className="text-sm text-gray-900 mt-1 line-clamp-2">{message.content}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/messages/${message.id}`}>Reply</Link>
                      </Button>
                    </div>
                  ))}
                  <div className="text-center">
                    <Button variant="outline" asChild>
                      <Link href="/messages">View All Messages</Link>
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
