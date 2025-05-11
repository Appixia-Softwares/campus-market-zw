"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, ShoppingBag, Building, MessageSquare, User } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function MobileNavigation() {
  const pathname = usePathname()
  const { profile } = useAuth()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/marketplace",
      label: "Market",
      icon: ShoppingBag,
      active: pathname === "/marketplace" || pathname.startsWith("/marketplace/"),
    },
    {
      href: "/accommodation",
      label: "Rooms",
      icon: Building,
      active: pathname === "/accommodation" || pathname.startsWith("/accommodation/"),
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageSquare,
      active: pathname === "/messages" || pathname.startsWith("/messages/"),
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile" || pathname.startsWith("/profile/"),
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background md:hidden">
      <div className="grid h-full grid-cols-5">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex flex-col items-center justify-center",
              route.active ? "text-primary" : "text-muted-foreground",
            )}
          >
            {route.href === "/profile" && profile?.avatar_url ? (
              <Avatar className="h-6 w-6">
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.full_name || "User"} />
                <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
            ) : (
              <route.icon className="h-5 w-5" />
            )}
            <span className="text-xs mt-1">{route.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
