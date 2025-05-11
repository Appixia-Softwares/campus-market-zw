"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { cn } from "@/lib/utils"
import { Bell, Home, Menu, MessageSquare, Package, Search, User, Building } from "lucide-react"
import { Badge } from "./ui/badge"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    { href: "/", label: "Home", icon: Home },
    { href: "/marketplace", label: "Marketplace", icon: Package },
    { href: "/accommodation", label: "Accommodation", icon: Building },
    { href: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <>
      {/* Mobile Navigation */}
      <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
        <div className="flex items-center justify-around h-16">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full px-2 text-xs",
                pathname === route.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div className="relative">
                <route.icon className="w-5 h-5 mb-1" />
                {route.badge && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                  >
                    {route.badge}
                  </Badge>
                )}
              </div>
              {route.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Desktop Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Package className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold">Campus Market</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              {routes.slice(0, 3).map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === route.href ? "text-primary" : "text-muted-foreground hover:text-primary",
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="hidden md:flex">
              <Search className="w-4 h-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="outline" size="icon" className="hidden md:flex relative">
              <Bell className="w-4 h-4" />
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                2
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>
            <ModeToggle />
            <div className="hidden md:flex">
              <Button asChild size="sm" variant="default">
                <Link href="/auth/signin">Sign In</Link>
              </Button>
            </div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="w-5 h-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-2 text-sm font-medium transition-colors",
                        pathname === route.href ? "text-primary" : "text-muted-foreground hover:text-primary",
                      )}
                    >
                      <route.icon className="w-5 h-5" />
                      {route.label}
                      {route.badge && <Badge variant="destructive">{route.badge}</Badge>}
                    </Link>
                  ))}
                  <div className="mt-4">
                    <Button asChild className="w-full" size="sm">
                      <Link href="/auth/signin">Sign In</Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  )
}
