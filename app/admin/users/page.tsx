import { createServerClient } from "@/lib/supabase/server"
import { DataTable } from "@/components/admin/data-table"
import { columns } from "@/components/admin/users-columns"

export default async function AdminUsersPage() {
  const supabase = createServerClient()

  const { data: users, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users Management</h1>
        <p className="text-muted-foreground">Manage all users on the platform</p>
      </div>

      <DataTable columns={columns} data={users || []} />
    </div>
  )
}
