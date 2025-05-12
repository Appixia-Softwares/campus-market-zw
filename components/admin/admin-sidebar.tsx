"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Users,
  ShoppingBag,
  Home,
  Flag,
  Database,
  Settings,
  Package,
  MessageSquare,
  AlertTriangle,
  LogOut,
  Globe,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const links = [
  { name: "Dashboard", href: "/admin", icon: BarChart3 },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Orders", href: "/admin/orders", icon: Package },
  { name: "Marketplace", href: "/admin/marketplace", icon: ShoppingBag },
  { name: "Accommodation", href: "/admin/accommodation", icon: Home },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Verifications", href: "/admin/verifications", icon: Flag },
  { name: "Reports", href: "/admin/reports", icon: AlertTriangle },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Seed Data", href: "/admin/seed", icon: Database },
  { name: "Seed Global Data", href: "/admin/seed-global", icon: Globe },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <nav className="space-y-2">
          {links.map((link) => {
            const LinkIcon = link.icon
            const isActive = pathname === link.href

            return (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
                  isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground",
                )}
              >
                <LinkIcon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto pt-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
