"use client"

import type React from "react"
import DashboardSidebar from "@/components/dashboard-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { useState } from "react"

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  return (  
    <div className="flex h-screen w-screen overflow-hidden">
    {/* Sidebar */}
    <div className={`transition-all duration-300 h-full ${collapsed ? 'w-16' : 'w-64'} flex-shrink-0`}>
      <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
    </div>
    {/* Main Content Area */}
    <div className="flex-1 flex flex-col overflow-hidden">
      <DashboardHeader />
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background">
        {children}
      </main>
    </div>
  </div>
  )
}
