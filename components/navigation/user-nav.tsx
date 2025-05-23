"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, LogOut, MessageSquare, Settings, User, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRealtime } from "@/lib/realtime-context"
import { getUnreadMessageCount } from "@/lib/api/messages"
import { getUnreadNotificationCount } from "@/lib/api/notifications"
import { useSupabaseClient } from "@supabase/auth-helpers-react"

export function UserNav() {
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const { subscribeToMessages, subscribeToNotifications } = useRealtime()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const supabase = useSupabaseClient()

  // Fetch unread counts
  useEffect(() => {
    if (!user) return

    const fetchUnreadCounts = async () => {
      try {
        const [messagesResult, notificationsResult] = await Promise.all([
          getUnreadMessageCount(user.id),
          getUnreadNotificationCount(user.id),
        ])

        setUnreadMessages(messagesResult.count || 0)
        setUnreadNotifications(notificationsResult.count || 0)
      } catch (error) {
        console.error("Error fetching unread counts:", error)
      }
    }

    fetchUnreadCounts()
  }, [user])

  // Subscribe to new messages
  useEffect(() => {
    if (!user) return

    // We'll subscribe to all conversations for this user
    const unsubscribe = supabase
      .channel(`messages:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `read=eq.false`,
        },
        (payload) => {
          const message = payload.new
          if (message.sender_id !== user.id) {
            setUnreadMessages((prev) => prev + 1)
          }
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(unsubscribe)
    }
  }, [user])

  // Subscribe to new notifications
  useEffect(() => {
    if (!user) return

    const unsubscribe = subscribeToNotifications(user.id, (payload) => {
      setUnreadNotifications((prev) => prev + 1)
    })

    return unsubscribe
  }, [user, subscribeToNotifications])

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Log in
          </Button>
        </Link>
        <Link href="/signup">
          <Button size="sm">Sign up</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/messages">
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
          {unreadMessages > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadMessages > 9 ? "9+" : unreadMessages}
            </Badge>
          )}
        </Button>
      </Link>

      <Link href="/notifications">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadNotifications > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center"
            >
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </Badge>
          )}
        </Button>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ""} alt={profile?.full_name || ""} />
              <AvatarFallback>{profile?.full_name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
