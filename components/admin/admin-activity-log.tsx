"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  user_id: string
  action: string
  details: any
  created_at: string
  profiles: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

interface AdminActivityLogProps {
  activities: Activity[]
}

export default function AdminActivityLog({ activities }: AdminActivityLogProps) {
  if (!activities.length) {
    return <div className="text-center py-8 text-muted-foreground">No recent activity to display</div>
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case "login":
        return "🔑"
      case "signup":
        return "👤"
      case "create_listing":
        return "📦"
      case "update_listing":
        return "✏️"
      case "delete_listing":
        return "🗑️"
      case "create_order":
        return "🛒"
      case "update_order":
        return "📝"
      case "send_message":
        return "💬"
      case "verification_request":
        return "🔍"
      case "report":
        return "🚩"
      default:
        return "📋"
    }
  }

  const getActionDescription = (activity: Activity) => {
    const { action, details } = activity
    const userName = activity.profiles?.full_name || "Unknown user"

    switch (action) {
      case "login":
        return `${userName} logged in`
      case "signup":
        return `${userName} created an account`
      case "create_listing":
        return `${userName} created a new ${details.type || ""} listing: ${details.title || ""}`
      case "update_listing":
        return `${userName} updated a ${details.type || ""} listing: ${details.title || ""}`
      case "delete_listing":
        return `${userName} deleted a ${details.type || ""} listing`
      case "create_order":
        return `${userName} placed an order for ${details.product || ""}`
      case "update_order":
        return `${userName} updated order status to ${details.status || ""}`
      case "send_message":
        return `${userName} sent a message to ${details.receiver || ""}`
      case "verification_request":
        return `${userName} requested verification`
      case "report":
        return `${userName} reported a ${details.type || "issue"}`
      default:
        return `${userName} performed an action: ${action}`
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="p-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={activity.profiles?.avatar_url || "/placeholder.svg"}
                alt={activity.profiles?.full_name}
              />
              <AvatarFallback>{activity.profiles?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden="true">
                  {getActionIcon(activity.action)}
                </span>
                <p className="font-medium">{getActionDescription(activity)}</p>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
