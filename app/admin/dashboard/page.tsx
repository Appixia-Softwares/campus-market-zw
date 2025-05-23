import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, Users, ShoppingBag, HomeIcon, TrendingUp, ArrowUp, ArrowDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Mock data for the dashboard
const stats = [
  {
    title: "Total Users",
    value: "2,856",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Products Listed",
    value: "1,204",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingBag,
  },
  {
    title: "Accommodations",
    value: "432",
    change: "+5.7%",
    trend: "up",
    icon: HomeIcon,
  },
  {
    title: "Active Transactions",
    value: "87",
    change: "-2.3%",
    trend: "down",
    icon: TrendingUp,
  },
]

// Mock recent users
const recentUsers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    university: "University of Zimbabwe",
    status: "active",
    joinedAt: "2023-05-12T10:34:23Z",
  },
  {
    id: 2,
    name: "Michael Takawira",
    email: "michael.t@example.com",
    university: "National University of Science and Technology",
    status: "active",
    joinedAt: "2023-05-11T14:22:10Z",
  },
  {
    id: 3,
    name: "Tendai Moyo",
    email: "tendai.m@example.com",
    university: "Midlands State University",
    status: "pending",
    joinedAt: "2023-05-10T09:15:45Z",
  },
  {
    id: 4,
    name: "Lisa Ncube",
    email: "lisa.n@example.com",
    university: "Harare Institute of Technology",
    status: "active",
    joinedAt: "2023-05-09T16:40:12Z",
  },
  {
    id: 5,
    name: "David Chigumira",
    email: "david.c@example.com",
    university: "Chinhoyi University of Technology",
    status: "inactive",
    joinedAt: "2023-05-08T11:52:33Z",
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Badge variant="outline" className="text-sm font-normal">
          Last updated: {new Date().toLocaleString()}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs">
                {stat.trend === "up" ? (
                  <ArrowUp className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDown className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>{stat.change}</span>
                <span className="ml-1 text-muted-foreground">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-6">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>Recently registered users on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>University</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32&text=${user.name.charAt(0)}`} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.university}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : user.status === "pending" ? "outline" : "secondary"
                        }
                        className={
                          user.status === "active"
                            ? "bg-green-500 hover:bg-green-600"
                            : user.status === "pending"
                              ? "text-yellow-600 border-yellow-300 bg-yellow-50 hover:bg-yellow-100 dark:text-yellow-400 dark:border-yellow-800 dark:bg-yellow-950/20"
                              : ""
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.joinedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
            <CardDescription>User growth and engagement</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="rounded-lg border bg-card p-3">
              <div className="text-sm font-medium">New Users (This Week)</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-2xl font-bold">124</div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  18%
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-3">
              <div className="text-sm font-medium">Active Users (Daily)</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-2xl font-bold">856</div>
                <Badge
                  variant="outline"
                  className="flex items-center gap-1 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                >
                  <ArrowUpRight className="h-3 w-3" />
                  12%
                </Badge>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-3">
              <div className="text-sm font-medium">Verified Users</div>
              <div className="mt-2 flex items-center justify-between">
                <div className="text-2xl font-bold">1,432</div>
                <div className="text-sm text-muted-foreground">50.1% of total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
