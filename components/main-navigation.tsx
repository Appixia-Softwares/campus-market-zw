"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { useAuth } from "@/components/providers/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Home,
  ShoppingBag,
  Building,
  MessageSquare,
  User,
  LogOut,
  Settings,
  Shield,
  Package,
  Menu,
  X,
  Search,
  ShoppingCart,
} from "lucide-react"
import { signOut } from "@/lib/actions/auth"
import Notifications from "@/components/notifications"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

export default function MainNavigation() {
  const pathname = usePathname()
  const { user, profile, isLoading } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Handle scroll for transparent to solid header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/marketplace",
      label: "Marketplace",
      icon: ShoppingBag,
      active: pathname === "/marketplace" || pathname.startsWith("/marketplace/"),
    },
    {
      href: "/accommodation",
      label: "Accommodation",
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
      href: "/orders",
      label: "Orders",
      icon: ShoppingCart,
      active: pathname === "/orders" || pathname.startsWith("/orders/"),
    },
  ]

  const isLandingPage = pathname === "/"
  const headerClass = cn(
    "sticky top-0 z-50 w-full transition-all duration-300",
    isScrolled || !isLandingPage ? "bg-background/95 backdrop-blur-sm border-b" : "bg-transparent",
  )

  const linkClass = (active: boolean) =>
    cn(
      "text-sm font-medium transition-colors hover:text-primary",
      active ? "text-foreground" : isScrolled || !isLandingPage ? "text-muted-foreground" : "text-white/90",
    )

  return (
    <>
      {/* Desktop Navigation */}
      <header className={headerClass}>
        <div className="container flex h-16 items-center px-4 mx-auto">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Package className={cn("h-6 w-6", isScrolled || !isLandingPage ? "text-primary" : "text-white")} />
            <span className={cn(isScrolled || !isLandingPage ? "text-foreground" : "text-white")}>Campus Market</span>
          </Link>

          {/* Desktop Menu */}
          <nav className="mx-6 hidden md:flex items-center space-x-4 lg:space-x-6">
            {routes.map((route) => (
              <Link key={route.href} href={route.href} className={linkClass(route.active)}>
                {route.label}
              </Link>
            ))}
          </nav>

          {/* Search (Desktop) */}
          <div className="hidden md:flex relative mx-auto max-w-sm flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search for items or accommodations..." className="pl-8 w-full max-w-sm" />
          </div>

          {/* Right side items */}
          <div className="ml-auto flex items-center space-x-4">
            <ModeToggle />

            {!isLoading && user && (
              <>
                <Notifications />

                <Link href="/orders" className="hidden md:flex relative">
                  <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                  <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                    0
                  </Badge>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                        <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    {profile?.role === "admin" && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Shield className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/accommodation">
                        <Building className="mr-2 h-4 w-4" />
                        <span>Accommodation Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form action={signOut} className="w-full">
                        <button type="submit" className="flex w-full items-center">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!isLoading && !user && (
              <div className="hidden md:flex gap-2">
                <Button asChild variant="outline">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <Link href="/" className="flex items-center gap-2 font-bold" onClick={() => setIsOpen(false)}>
                      <Package className="h-6 w-6 text-primary" />
                      <span>Campus Market</span>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  {/* Mobile search */}
                  <div className="relative mb-6">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search..." className="pl-8 w-full" />
                  </div>

                  {/* Mobile menu items */}
                  <nav className="flex flex-col gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-2 text-sm font-medium transition-colors p-2 rounded-md",
                          route.active
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                        )}
                      >
                        <route.icon className="h-5 w-5" />
                        {route.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t">
                    {!isLoading && user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || "User"} />
                            <AvatarFallback>{profile?.full_name?.charAt(0) || "U"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{profile?.full_name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button asChild variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                            <Link href="/profile">Profile</Link>
                          </Button>
                          <Button asChild variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                            <Link href="/settings">Settings</Link>
                          </Button>
                        </div>
                        <form action={signOut} className="w-full">
                          <Button type="submit" className="w-full" variant="destructive" size="sm">
                            Sign Out
                          </Button>
                        </form>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Button asChild variant="outline" onClick={() => setIsOpen(false)}>
                          <Link href="/auth/signin">Sign In</Link>
                        </Button>
                        <Button asChild onClick={() => setIsOpen(false)}>
                          <Link href="/auth/signup">Sign Up</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
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
              <route.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
