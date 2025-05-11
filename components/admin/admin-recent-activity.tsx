"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

const activities = [
  {
    id: 1,
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "signed up",
    time: new Date(Date.now() - 1000 * 60 * 5),
  },
  {
    id: 2,
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "listed a new item",
    time: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: 3,
    user: {
      name: "Bob Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "applied for accommodation",
    time: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 4,
    user: {
      name: "Alice Williams",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "submitted verification",
    time: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: 5,
    user: {
      name: "Charlie Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    action: "reported a listing",
    time: new Date(Date.now() - 1000 * 60 * 120),
  },
]

export default function AdminRecentActivity() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <p className="text-sm">
              <span className="font-medium">{activity.user.name}</span> {activity.action}
            </p>
            <p className="text-xs text-muted-foreground">{formatDistanceToNow(activity.time, { addSuffix: true })}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
