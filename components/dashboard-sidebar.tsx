"use client"

import {
  CreditCard,
  Home,
  LogOut,
  MessageSquare,
  Search,
  Settings,
  ShoppingBag,
  User,
  Users,
  GraduationCap,
  Plus,
  Heart,
  TrendingUp,
  Bell,
  Menu,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useEffect, useState } from "react"
import { getUnreadMessageCount } from "@/lib/api/messages"
import { getUnreadNotificationCount } from "@/lib/api/notifications"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface DashboardSidebarProps {
  collapsed: boolean
  onToggle: () => void
  isMobile?: boolean
}

export default function DashboardSidebar({ collapsed, onToggle, isMobile }: DashboardSidebarProps) {
  const pathname = usePathname() || ""
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchUnreadCounts()
    }
  }, [user])

  const fetchUnreadCounts = async () => {
    if (!user) return

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

  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
  }

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name
    if (user?.email) return user.email.split("@")[0]
    return "User"
  }

  const getUserInitials = () => {
    const displayName = getDisplayName()
    return getInitials(displayName)
  }

  const getVerificationStatus = () => {
    if (!profile) return { verified: false, count: 0 }

    let verifiedCount = 0
    if (profile.email_verified) verifiedCount++
    if (profile.phone_verified) verifiedCount++
    if (profile.university_id) verifiedCount++

    return {
      verified: verifiedCount === 3,
      count: verifiedCount,
      total: 3,
    }
  }

  const verificationStatus = getVerificationStatus()

  const handleSignOut = async () => {
    await signOut()
    router.push("/login")
  }

  const menuItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      title: "Marketplace",
      href: "/marketplace",
      icon: ShoppingBag,
      active: pathname === "/marketplace" || pathname.startsWith("/marketplace/"),
    },
    {
      title: "Sell Item",
      href: "/marketplace/listings/new",
      icon: Plus,
      active: pathname === "/marketplace/listings/new",
    },
    {
      title: "My Listings",
      href: "/my-listings",
      icon: TrendingUp,
      active: pathname === "/my-listings",
    },
    {
      title: "Favorites",
      href: "/favorites",
      icon: Heart,
      active: pathname === "/favorites",
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
      active: pathname === "/messages" || pathname.startsWith("/messages/"),
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    {
      title: "Notifications",
      href: "/notifications",
      icon: Bell,
      active: pathname === "/notifications",
      badge: unreadNotifications > 0 ? unreadNotifications : undefined,
    },
  ]

  const comingSoonItems = [
    {
      title: "Accommodation",
      icon: Search,
      comingSoon: true,
    },
    {
      title: "Payments",
      icon: CreditCard,
      comingSoon: true,
    },
  ]

  const bottomItems = [
    {
      title: "Community",
      href: "/community",
      icon: Users,
      active: pathname === "/community",
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
      active: pathname === "/profile",
      badge: !verificationStatus.verified ? "!" : undefined,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ]

  const SidebarContent = () => (
    <>
      <SidebarHeader>
        <div
          className={`flex items-center gap-2 px-4 py-2 ${collapsed && !isMobile ? "justify-center px-2 py-2" : ""}`}
        >
          <ShoppingBag className="h-6 w-6 text-primary animate-pulse" />
          {(!collapsed || isMobile) && <span className="font-bold text-xl">CampusMarket</span>}
          {!isMobile && (
            <Button variant="ghost" size="icon" onClick={onToggle} className="ml-auto h-6 w-6">
              {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
            </Button>
          )}
        </div>

        {(!collapsed || isMobile) && (
          <div className="px-4 py-3 bg-muted/30 rounded-lg mx-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getDisplayName()}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                {profile?.university && (
                  <div className="flex items-center gap-1 mt-1">
                    <GraduationCap className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground truncate">
                      {profile.university.abbreviation || profile.university.name}
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {profile?.status && (
                  <Badge variant={profile.status === "active" ? "default" : "secondary"} className="text-xs">
                    {profile.status}
                  </Badge>
                )}
                {profile?.role && profile.role !== "user" && (
                  <Badge variant="outline" className="text-xs">
                    {profile.role}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {verificationStatus.verified ? (
                  <span className="text-green-600 font-medium">✓ Verified</span>
                ) : (
                  <span>
                    {verificationStatus.count}/{verificationStatus.total} verified
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={item.active}>
                <Link
                  href={item.href}
                  className="transition-all hover:text-primary flex items-center gap-2 justify-start"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {(!collapsed || isMobile) && (
                    <>
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="destructive"
                          className="ml-auto text-xs h-5 w-5 p-0 flex items-center justify-center"
                        >
                          {item.badge > 9 ? "9+" : item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <Separator className="my-2" />

          {comingSoonItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton disabled>
                <div className="transition-all flex items-center gap-2 justify-start cursor-not-allowed opacity-60">
                  <item.icon className="h-4 w-4" />
                  {(!collapsed || isMobile) && (
                    <>
                      <span>{item.title}</span>
                      <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                        Coming Soon
                      </span>
                    </>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}

          <Separator className="my-2" />

          {bottomItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={item.active}>
                <Link
                  href={item.href}
                  className="transition-all hover:text-primary flex items-center gap-2 justify-start"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {(!collapsed || isMobile) && (
                    <>
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                {(!collapsed || isMobile) && <span className="ml-2">Logout</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  )

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-80">
          <Sidebar className="border-0">
            <SidebarContent />
          </Sidebar>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Sidebar className={`transition-all duration-300 ${collapsed ? "w-16" : "w-80"}`}>
      <SidebarContent />
    </Sidebar>
  )
}
