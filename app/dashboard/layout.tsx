"use client"

import type React from "react"
import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import DashboardSidebar from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Sidebar: overlay on mobile, collapsible on desktop */}
      {/* Desktop sidebar */}
      <div className={`hidden md:block transition-all duration-300 h-full ${collapsed ? 'w-16' : 'w-64'} flex-shrink-0 ${collapsed ? '' : 'bg-background border-r'}`}>
        <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} isMobile={false} />
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          {/* Sidebar */}
          <div className="relative w-64 h-full bg-background border-r shadow-lg">
            <DashboardSidebar collapsed={false} onToggle={() => setSidebarOpen(false)} isMobile={true} />
          </div>
        </div>
      )}
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader onMobileMenu={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  )
}
