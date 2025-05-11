import type React from "react"
import type { Metadata } from "next"
import AdminSidebar from "@/components/admin/admin-sidebar"
import RoleGuard from "@/components/providers/role-guard"

export const metadata: Metadata = {
  title: "Admin Dashboard - Campus Market",
  description: "Admin dashboard for Campus Market",
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 p-8">{children}</div>
      </div>
    </RoleGuard>
  )
}
