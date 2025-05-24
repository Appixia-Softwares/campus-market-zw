"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, GraduationCap, MapPin, Calendar, Plus, TrendingUp, Award, Star } from "lucide-react"

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("feed")

  // Mock data - replace with real data from your database
  const topSellers = [
    {
      id: "1",
      name: "Sarah Mukamuri",
      university: "University of Zimbabwe",
      avatar: "/placeholder.svg?height=40&width=40",
      itemsSold: 24,
      rating: 4.9,
      verified: true,
    },
    {
      id: "2",
      name: "Tendai Moyo",
      university: "Midlands State University",
      avatar: "/placeholder.svg?height=40&width=40",
      itemsSold: 18,
      rating: 4.8,
      verified: true,
    },
    {
      id: "3",
      name: "Chipo Ndoro",
      university: "NUST",
      avatar: "/placeholder.svg?height=40&width=40",
      itemsSold: 15,
      rating: 4.7,
      verified: false,
    },
  ]

  const communityStats = [
    { label: "Active Students", value: "2,847", icon: Users, color: "text-blue-600" },
    { label: "Universities", value: "12", icon: GraduationCap, color: "text-green-600" },
    { label: "Items Sold", value: "1,234", icon: TrendingUp, color: "text-purple-600" },
    { label: "Success Rate", value: "94%", icon: Award, color: "text-yellow-600" },
  ]

  const recentActivity = [
    {
      id: "1",
      user: "John Doe",
      action: "sold",
      item: "MacBook Pro 2020",
      time: "2 hours ago",
      university: "UZ",
    },
    {
      id: "2",
      user: "Mary Smith",
      action: "listed",
      item: "Engineering Textbooks",
      time: "4 hours ago",
      university: "MSU",
    },
    {
      id: "3",
      user: "Peter Jones",
      action: "joined",
      item: "the community",
      time: "6 hours ago",
      university: "NUST",
    },
  ]

  return (
    <div className="container max-w-6xl py-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Student Community</h1>
          <p className="text-muted-foreground">Connect with fellow students across Zimbabwe's universities</p>
        </div>
        <Button className="gap-2 w-full md:w-auto">
          <Plus className="h-4 w-4" />
          Join Discussion
        </Button>
      </div>

      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {communityStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <stat.icon className={`h-8 w-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="feed">Community Feed</TabsTrigger>
          <TabsTrigger value="leaderboard">Top Sellers</TabsTrigger>
          <TabsTrigger value="universities">Universities</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                          <span className="font-medium">{activity.item}</span>
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{activity.time}</span>
                          <Badge variant="outline" className="text-xs">
                            {activity.university}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium">Be Respectful</h4>
                      <p className="text-sm text-muted-foreground">Treat all community members with respect</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium">Honest Listings</h4>
                      <p className="text-sm text-muted-foreground">Provide accurate descriptions and photos</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium">Safe Transactions</h4>
                      <p className="text-sm text-muted-foreground">Meet in public places on campus</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">94%</div>
                    <div className="text-sm text-muted-foreground">Successful transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">$45,230</div>
                    <div className="text-sm text-muted-foreground">Total value traded</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">2.3k</div>
                    <div className="text-sm text-muted-foreground">Active this month</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Popular Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Textbooks</span>
                    <Badge variant="secondary">342</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Electronics</span>
                    <Badge variant="secondary">189</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Clothing</span>
                    <Badge variant="secondary">156</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Furniture</span>
                    <Badge variant="secondary">98</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Sellers This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellers.map((seller, index) => (
                  <div key={seller.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </div>
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={seller.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{seller.name}</h4>
                        {seller.verified && <Badge className="bg-green-600 text-xs">Verified</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{seller.university}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm font-medium">{seller.itemsSold} items sold</span>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{seller.rating}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="universities" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "University of Zimbabwe", students: 1247, items: 456, city: "Harare" },
              { name: "Midlands State University", students: 892, items: 321, city: "Gweru" },
              { name: "National University of Science and Technology", students: 734, items: 289, city: "Bulawayo" },
              { name: "Chinhoyi University of Technology", students: 456, items: 167, city: "Chinhoyi" },
              { name: "Great Zimbabwe University", students: 321, items: 123, city: "Masvingo" },
              { name: "Bindura University of Science Education", students: 289, items: 98, city: "Bindura" },
            ].map((uni, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{uni.name}</h4>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{uni.city}</span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{uni.students}</div>
                          <div className="text-xs text-muted-foreground">Students</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{uni.items}</div>
                          <div className="text-xs text-muted-foreground">Items</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Events Coming Soon</h3>
            <p className="text-muted-foreground mb-6">We're working on bringing you campus events and meetups</p>
            <Button variant="outline">Get Notified</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
