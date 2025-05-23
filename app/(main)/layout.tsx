import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { PageTransition } from "@/components/ui/page-transition"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <PageTransition>
        <main className="flex-1">{children}</main>
      </PageTransition>
    </div>
  )
}
