import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"
import { MessagesPreview } from "@/components/messages-preview"
import { MarketplacePreview } from "@/components/marketplace-preview"
import { CampusEvents } from "@/components/campus-events"
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: "Dashboard | ZimStudentHub",
  description: "Student dashboard for accommodation and marketplace",
}

async function getUserProfile() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.error('Debug - Error getting user:', userError)
    return { user: null, profile: null }
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError) {
    console.error('Debug - Error getting profile:', profileError)
    return { user, profile: null }
  }

  return { user, profile }
}

export default async function DashboardPage() {
  const { user, profile } = await getUserProfile()

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please sign in to view your dashboard</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardStats userId={user.id} />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <RecentActivity userId={user.id} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Messages</CardTitle>
                <CardDescription>You have {profile?.unread_message_count || 0} unread messages</CardDescription>
              </CardHeader>
              <CardContent>
                <MessagesPreview userId={user.id} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Marketplace Highlights</CardTitle>
                <CardDescription>Recently added items that might interest you</CardDescription>
              </CardHeader>
              <CardContent>
                <MarketplacePreview userId={user.id} />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Campus Events</CardTitle>
                <CardDescription>Upcoming events at your university</CardDescription>
              </CardHeader>
              <CardContent>
                <CampusEvents universityId={profile?.university_id} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed statistics about your activity</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">{/* Analytics content */}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>View and download reports</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">{/* Reports content */}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">{/* Notifications content */}</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
