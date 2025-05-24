"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  MessageSquare,
  ShoppingBag,
  Heart,
  Star,
  AlertCircle,
  Settings,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/api/notifications"
import { formatDistanceToNow } from "date-fns"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  link?: string
  type: string
  read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    if (user) {
      fetchNotifications()
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await getNotifications(user.id)
      if (error) throw error
      setNotifications(data as Notification[])
    } catch (err) {
      console.error("Error fetching notifications:", err)
      toast.error("Failed to load notifications")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))

      const { error } = await markNotificationAsRead(id)
      if (error) throw error
    } catch (err) {
      console.error("Error marking notification as read:", err)
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif)))
      toast.error("Failed to mark as read")
    }
  }

  const handleMarkAllAsRead = async () => {
    if (!user) return

    try {
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))

      const { error } = await markAllNotificationsAsRead(user.id)
      if (error) throw error

      toast.success("All notifications marked as read")
    } catch (err) {
      console.error("Error marking all as read:", err)
      fetchNotifications()
      toast.error("Failed to mark all as read")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      setNotifications((prev) => prev.filter((notif) => notif.id !== id))

      const { error } = await deleteNotification(id)
      if (error) throw error

      toast.success("Notification deleted")
    } catch (err) {
      console.error("Error deleting notification:", err)
      fetchNotifications()
      toast.error("Failed to delete notification")
    }
  }

  const getFilteredNotifications = (filter: string) => {
    switch (filter) {
      case "unread":
        return notifications.filter((n) => !n.read)
      case "messages":
        return notifications.filter((n) => n.type === "message")
      case "marketplace":
        return notifications.filter((n) => n.type === "product" || n.type === "listing")
      case "system":
        return notifications.filter((n) => n.type === "system")
      default:
        return notifications
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageSquare className="h-5 w-5 text-blue-600" />
      case "product":
      case "listing":
        return <ShoppingBag className="h-5 w-5 text-green-600" />
      case "favorite":
        return <Heart className="h-5 w-5 text-red-600" />
      case "review":
        return <Star className="h-5 w-5 text-yellow-600" />
      case "system":
        return <AlertCircle className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (loading) {
    return (
      <div className="container max-w-4xl py-6">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-muted rounded animate-pulse" />
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 bg-muted rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your marketplace activity</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead} className="gap-2">
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
          <Link href="/settings/notifications">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all" className="relative">
            All
            {notifications.length > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
                {notifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 text-xs">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        {["all", "unread", "messages", "marketplace", "system"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <NotificationList
              notifications={getFilteredNotifications(tab)}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function NotificationList({
  notifications,
  onMarkAsRead,
  onDelete,
}: {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No notifications</h3>
        <p className="text-muted-foreground">You're all caught up!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence initial={false}>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card
              className={`transition-all hover:shadow-md ${!notification.read ? "bg-muted/30 border-primary/20" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="p-2 rounded-full bg-muted">{getNotificationIcon(notification.type)}</div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                          {notification.link && (
                            <Link href={notification.link}>
                              <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                                View →
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => onMarkAsRead(notification.id)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => onDelete(notification.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {!notification.read && (
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
