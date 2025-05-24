"use client"

import React from "react"
import {
  Building,
  Calendar,
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
} from "lucide-react"
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"

// Add props type
interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

export default function DashboardSidebar({ collapsed, onToggle, isMobile }: DashboardSidebarProps) {
  const pathname = usePathname() || ""
  const { user, profile, signOut } = useAuth()
  const actuallyCollapsed = isMobile ? false : collapsed;

  // Generate initials from full name
  const getInitials = (fullName: string) => {
    return fullName
      .split(" ")
      .map((name) => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join("")
  }

  // Get display name
  const getDisplayName = () => {
    if (profile?.full_name) {
      return profile.full_name
    }
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split("@")[0]
    }
    return "User"
  }

  // Get user initials
  const getUserInitials = () => {
    const displayName = getDisplayName()
    return getInitials(displayName)
  }

  // Get verification status
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

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className={`flex items-center gap-2 px-4 py-2 ${actuallyCollapsed ? 'justify-center px-2 py-2' : ''}`}>
            <Building className="h-6 w-6 text-primary animate-bounce-slow" />
            {!actuallyCollapsed && <span className="font-bold text-xl">CampusMarket</span>}
            <button
              onClick={onToggle}
              className={`ml-auto p-1 rounded hover:bg-muted transition ${actuallyCollapsed ? '' : ''}`}
              aria-label={actuallyCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <svg
                className={`w-5 h-5 transition-transform ${actuallyCollapsed ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
              </svg>
            </button>
          </div>

          {/* User Profile Section - hide when collapsed */}
          {!actuallyCollapsed && (
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
              {/* Status and Verification */}
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
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Dashboard">
                <Link href="/dashboard" className="transition-all hover:text-primary flex items-center gap-2 justify-center md:justify-start">
                  <Home className="h-4 w-4" />
                  {!actuallyCollapsed && <span>Dashboard</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Accommodation">
                <div className="transition-all flex items-center gap-2 justify-center md:justify-start cursor-not-allowed opacity-60">
                  <Search className="h-4 w-4" />
                  {!actuallyCollapsed && (
                    <>
                      <span>Find Accommodation</span>
                      <span className="ml-2 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Coming Soon</span>
                    </>
                  )}
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/bookings"} tooltip="My Bookings">
                <Link href="/bookings" className="transition-all hover:text-primary flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="h-4 w-4" />
                  {!actuallyCollapsed && <span>My Bookings</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/messages"} tooltip="Messages">
                <Link href="/messages" className="transition-all hover:text-primary flex items-center gap-2 justify-center md:justify-start">
                  <MessageSquare className="h-4 w-4" />
                  {!actuallyCollapsed && (
                    <>
                      <span>Messages</span>
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                        3
                      </span>
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/payments"} tooltip="Payments">
                <Link href="/payments" className="transition-all hover:text-primary flex items-center gap-2 justify-center md:justify-start">
                  <CreditCard className="h-4 w-4" />
                  {!actuallyCollapsed && <span>Payments</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Separator className="my-2" />

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === "/marketplace" || pathname.startsWith("/marketplace/")}
                tooltip="Marketplace"
              >
                <Link href="/marketplace" className="transition-all hover:text-primary flex items-center gap-2 justify-center md:justify-start">
                  <ShoppingBag className="h-4 w-4" />
                  {!actuallyCollapsed && <span>Marketplace</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/events"} tooltip="Events">
                <Link href="/events" className="transition-all hover:text-primary flex items-center gap-2 justify-center md:justify-start">
                  <Calendar className="h-4 w-4" />
                  {!actuallyCollapsed && <span>Events</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/community"} tooltip="Community">
                <Link href="/community" className="transition-all hover:text-primary flex items-center gap-2 justify-center md:justify-start">
                  <Users className="h-4 w-4" />
                  {!actuallyCollapsed && <span>Community</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/profile"} tooltip="Profile">
                <Link href="/profile" className="transition-all hover:text-primary flex items-center gap-2 justify-center md:justify-start">
                  <User className="h-4 w-4" />
                  {!actuallyCollapsed && (
                    <>
                      <span>Profile</span>
                      {!verificationStatus.verified && <Badge variant="destructive" className="ml-auto text-xs">!</Badge>}
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/settings"} tooltip="Settings">
                <Link href="/settings" className="transition-all hover:text-primary flex items-center gap-2 justify-center md:justify-start">
                  <Settings className="h-4 w-4" />
                  {!actuallyCollapsed && <span>Settings</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Logout" onClick={() => signOut()}>
                <button className="transition-all hover:text-destructive w-full flex items-center gap-2 justify-center md:justify-start">
                  <LogOut className="h-4 w-4" />
                  {!actuallyCollapsed && <span>Logout</span>}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  )
}
