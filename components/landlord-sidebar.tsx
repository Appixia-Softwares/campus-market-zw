"use client"

import { Building, Home, MessageSquare, Settings, ShoppingBag, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export function LandlordSidebar() {
  const pathname = usePathname()

  const routes = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/landlord",
      isActive: pathname === "/landlord",
    },
    {
      title: "My Listings",
      icon: Building,
      href: "/landlord/listings",
      isActive: pathname.startsWith("/landlord/listings"),
    },
    {
      title: "Marketplace",
      icon: ShoppingBag,
      href: "/landlord/marketplace",
      isActive: pathname === "/landlord/marketplace",
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/landlord/messages",
      isActive: pathname === "/landlord/messages",
    },
    {
      title: "Profile",
      icon: User,
      href: "/landlord/profile",
      isActive: pathname === "/landlord/profile",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/landlord/settings",
      isActive: pathname === "/landlord/settings",
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href="/landlord" className="flex items-center gap-2">
          <Building className="h-6 w-6 text-primary" />
          <span className="font-bold">Landlord Portal</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {routes.map((route) => (
            <SidebarMenuItem key={route.href}>
              <SidebarMenuButton asChild isActive={route.isActive}>
                <Link href={route.href}>
                  <route.icon className="h-5 w-5" />
                  <span>{route.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
