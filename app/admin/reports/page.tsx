import { createServerClient } from "@/lib/supabase/server"
import { DataTable } from "@/components/admin/data-table"
import { ReportsColumns } from "@/components/admin/reports-columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function AdminReportsPage() {
  const supabase = createServerClient()

  // Get all reports with related data
  const { data: reports, error } = await supabase
    .from("reports")
    .select(`
      *,
      profiles (
        id,
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching reports:", error)
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Manage user reports</p>
        </div>
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">Error loading reports: {error.message}</div>
      </div>
    )
  }

  // Format reports for the data table
  const formattedReports = reports.map((report) => ({
    id: report.id,
    type: report.report_type,
    reporter: report.profiles?.full_name || "Unknown User",
    reporter_email: report.profiles?.email || "Unknown Email",
    item_id: report.item_id || "N/A",
    description: report.description,
    status: report.status,
    date: new Date(report.created_at).toLocaleDateString(),
  }))

  // Group reports by status
  const pendingReports = formattedReports.filter((report) => report.status === "pending")
  const resolvedReports = formattedReports.filter((report) => report.status === "resolved")
  const dismissedReports = formattedReports.filter((report) => report.status === "dismissed")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Manage user reports and issues</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Statistics</CardTitle>
          <CardDescription>Overview of reports on the platform</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{pendingReports.length}</div>
            <p className="text-muted-foreground">Pending Reports</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{resolvedReports.length}</div>
            <p className="text-muted-foreground">Resolved Reports</p>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <div className="text-2xl font-bold">{dismissedReports.length}</div>
            <p className="text-muted-foreground">Dismissed Reports</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="all">All Reports ({formattedReports.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingReports.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedReports.length})</TabsTrigger>
          <TabsTrigger value="dismissed">Dismissed ({dismissedReports.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <DataTable columns={ReportsColumns} data={formattedReports} searchKey="description" />
        </TabsContent>
        <TabsContent value="pending" className="mt-4">
          <DataTable columns={ReportsColumns} data={pendingReports} searchKey="description" />
        </TabsContent>
        <TabsContent value="resolved" className="mt-4">
          <DataTable columns={ReportsColumns} data={resolvedReports} searchKey="description" />
        </TabsContent>
        <TabsContent value="dismissed" className="mt-4">
          <DataTable columns={ReportsColumns} data={dismissedReports} searchKey="description" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
