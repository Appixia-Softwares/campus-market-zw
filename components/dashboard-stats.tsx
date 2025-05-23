import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare, Home, ShoppingBag, Heart } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface DashboardStatsProps {
  userId: string
}

export async function DashboardStats({ userId }: DashboardStatsProps) {
  // Fetch stats from Supabase
  const [
    { count: messageCount },
    { count: savedAccommodationsCount },
    { count: savedProductsCount },
    { count: likedProductsCount },
  ] = await Promise.all([
    supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`),
    supabase.from("saved_accommodations").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("saved_products").select("*", { count: "exact", head: true }).eq("user_id", userId),
    supabase.from("product_likes").select("*", { count: "exact", head: true }).eq("user_id", userId),
  ])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{messageCount || 0}</div>
          <p className="text-xs text-muted-foreground">Total conversations</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saved Accommodations</CardTitle>
          <Home className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savedAccommodationsCount || 0}</div>
          <p className="text-xs text-muted-foreground">Properties saved for later</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saved Products</CardTitle>
          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{savedProductsCount || 0}</div>
          <p className="text-xs text-muted-foreground">Items saved for later</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Liked Products</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{likedProductsCount || 0}</div>
          <p className="text-xs text-muted-foreground">Products you've liked</p>
        </CardContent>
      </Card>
    </div>
  )
}
