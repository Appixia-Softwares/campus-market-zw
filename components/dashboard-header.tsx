"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Building, Calendar, HelpCircle, MessageSquare, Search, User } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"

export default function DashboardHeader() {
  const [searchFocused, setSearchFocused] = useState(false)
  const { user, profile, signOut } = useAuth()

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

  // Get user status badge
  const getStatusBadge = () => {
    if (!profile) return null

    const statusColors = {
      active: "bg-green-500",
      pending: "bg-yellow-500",
      inactive: "bg-gray-500",
      suspended: "bg-red-500",
    }

    return (
      <Badge variant="outline" className={`text-xs ${statusColors[profile.status]} text-white border-none`}>
        {profile.status}
      </Badge>
    )
  }

  return (
    <header className="border-b sticky top-0 z-10 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Building className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">CampusMarket 🇿🇼</span>
          </Link>
        </div>

        <div className="hidden md:flex relative max-w-md w-full mx-4">
          <div
            className={`absolute inset-0 bg-primary/5 rounded-lg -m-1 transition-all duration-300 ${
              searchFocused ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          ></div>
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accommodation, marketplace items..."
            className="pl-8 bg-muted border-none focus-visible:ring-primary/20 focus-visible:ring-offset-0"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
            <Calendar className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" className="relative hover:bg-primary/10 transition-colors">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative notification-badge hover:bg-primary/10 transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                {[1, 2, 3].map((i) => (
                  <DropdownMenuItem key={i} className="flex flex-col items-start py-2 cursor-pointer">
                    <div className="font-medium">New message from landlord</div>
                    <div className="text-sm text-muted-foreground">Regarding your recent booking inquiry</div>
                    <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center font-medium text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="hover:bg-primary/10 transition-colors">
            <HelpCircle className="h-5 w-5" />
          </Button>

          <ModeToggle />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 h-10 px-3 rounded-full border-2 transition-all duration-300 hover:border-primary"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium">{getDisplayName()}</span>
                  <div className="flex items-center gap-1">
                    {profile?.university?.abbreviation && (
                      <span className="text-xs text-muted-foreground">{profile.university.abbreviation}</span>
                    )}
                    {getStatusBadge()}
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{getDisplayName()}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  {profile?.university && (
                    <p className="text-xs leading-none text-muted-foreground">{profile.university.name}</p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/bookings" className="cursor-pointer">
                  My Bookings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/payments" className="cursor-pointer">
                  Payments
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => signOut()}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
