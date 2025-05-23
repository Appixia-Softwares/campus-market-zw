"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Bell, Check, Trash2, MessageSquare, Calendar, CreditCard, Info } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRealtime } from "@/lib/realtime-context"
import { useAuth } from "@/lib/auth-context"
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/lib/api/notifications"
import { formatDistanceToNow } from "date-fns"
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

export default function NotificationsPanel() {
  const { toast } = useToast()
  const { user } = useAuth()
  const { subscribeToNotifications } = useRealtime()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch notifications
  useEffect(() => {
    if (!user) return

    const fetchNotifications = async () => {
      setLoading(true)
      try {
        const { data, error } = await getNotifications(user.id)
        if (error) throw error

        setNotifications(data as Notification[])
      } catch (error) {
        console.error("Error fetching notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user, toast])

  // Subscribe to new notifications
  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToNotifications(user.id, (payload) => {
      const newNotification = payload.new as Notification
      setNotifications((prev) => [newNotification, ...prev])
    })

    return unsubscribe
  }, [user, subscribeToNotifications])

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))

      const { error } = await markNotificationAsRead(id)
      if (error) throw error
    } catch (error) {
      console.error("Error marking notification as read:", error)

      // Revert optimistic update
      setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: false } : notif)))

      toast({
        title: "Error",
        description: "Failed to update notification. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user) return

    try {
      // Optimistic update
      setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))

      const { error } = await markAllNotificationsAsRead(user.id)
      if (error) throw error

      toast({
        title: "Success",
        description: "All notifications marked as read",
      })
    } catch (error) {
      console.error("Error marking all notifications as read:", error)

      // Fetch fresh data to revert
      const { data } = await getNotifications(user.id)
      if (data) {
        setNotifications(data as Notification[])
      }

      toast({
        title: "Error",
        description: "Failed to update notifications. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Delete notification
  const handleDelete = async (id: string) => {
    try {
      // Optimistic update
      setNotifications((prev) => prev.filter((notif) => notif.id !== id))

      const { error } = await deleteNotification(id)
      if (error) throw error
    } catch (error) {
      console.error("Error deleting notification:", error)

      // Fetch fresh data to revert
      const { data } = await getNotifications(user.id)
      if (data) {
        setNotifications(data as Notification[])
      }

      toast({
        title: "Error",
        description: "Failed to delete notification. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "message":
        return (
          <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
            <MessageSquare className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          </div>
        )
      case "booking":
        return (
          <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
            <Calendar className="h-4 w-4 text-green-600 dark:text-green-300" />
          </div>
        )
      case "payment":
        return (
          <div className="bg-yellow-100 dark:bg-yellow-900 p-2 rounded-full">
            <CreditCard className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
          </div>
        )
      case "system":
        return (
          <div className="bg-purple-100 dark:bg-purple-900 p-2 rounded-full">
            <Info className="h-4 w-4 text-purple-600 dark:text-purple-300" />
          </div>
        )
      default:
        return (
          <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
            <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          </div>
        )
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Notifications</span>
            <Skeleton className="h-8 w-24" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Notifications</span>
          {notifications.some((n) => !n.read) && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="h-4 w-4 mr-1" /> Mark all as read
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 p-3 rounded-lg ${notification.read ? "bg-transparent" : "bg-muted/50"}`}
              >
                {getNotificationIcon(notification.type)}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDelete(notification.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                    </span>
                    {notification.link && (
                      <Link href={notification.link}>
                        <Button variant="link" size="sm" className="h-auto p-0">
                          View
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}
