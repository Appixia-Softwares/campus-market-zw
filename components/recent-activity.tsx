import { formatDistanceToNow } from "date-fns"
import { MessageSquare, Home, ShoppingBag, Heart, Eye, Star } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface RecentActivityProps {
  userId: string
}

export async function RecentActivity({ userId }: RecentActivityProps) {
  // Fetch recent activity from Supabase
  const { data: activities } = await supabase
    .from("user_activities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent activity</p>
      </div>
    )
  }

  // Map activity types to icons
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5" />
      case "accommodation_view":
      case "accommodation_booking":
        return <Home className="h-5 w-5" />
      case "product_view":
      case "product_purchase":
        return <ShoppingBag className="h-5 w-5" />
      case "like":
        return <Heart className="h-5 w-5" />
      case "view":
        return <Eye className="h-5 w-5" />
      case "review":
        return <Star className="h-5 w-5" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <div className="rounded-full bg-primary/10 p-2 text-primary">{getActivityIcon(activity.activity_type)}</div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.description}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
