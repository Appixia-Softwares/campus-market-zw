"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowUpRight, DollarSign, Heart, MessageSquare, ShoppingBag, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import Link from "next/link"

// Mock data for marketplace stats
const MOCK_STATS = {
  activeListings: 2,
  totalSold: 5,
  totalEarnings: 175,
  savedItems: 8,
  views: 86,
  messages: 9,
}

// Mock data for sales chart
const MOCK_SALES_DATA = [
  { month: "Jan", sales: 0 },
  { month: "Feb", sales: 0 },
  { month: "Mar", sales: 1 },
  { month: "Apr", sales: 0 },
  { month: "May", sales: 2 },
  { month: "Jun", sales: 1 },
  { month: "Jul", sales: 0 },
  { month: "Aug", sales: 1 },
  { month: "Sep", sales: 0 },
  { month: "Oct", sales: 0 },
  { month: "Nov", sales: 0 },
  { month: "Dec", sales: 0 },
]

export default function MarketplaceStats() {
  const [stats, setStats] = useState(null)
  const [salesData, setSalesData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setStats(MOCK_STATS)
      setSalesData(MOCK_SALES_DATA)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <Card className="hover-card-animation">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <CardTitle>Marketplace Stats</CardTitle>
          </div>
          <Link href="/marketplace/stats">
            <Button variant="ghost" size="sm" className="gap-1">
              Detailed Stats
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
        <CardDescription>Overview of your marketplace activity</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-muted rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="h-40 bg-muted rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <StatItem
                title="Active Listings"
                value={stats.activeListings}
                icon={<ShoppingBag className="h-4 w-4" />}
                color="emerald"
              />
              <StatItem
                title="Total Sold"
                value={stats.totalSold}
                icon={<DollarSign className="h-4 w-4" />}
                color="blue"
              />
              <StatItem
                title="Total Earnings"
                value={`$${stats.totalEarnings}`}
                icon={<ArrowUpRight className="h-4 w-4" />}
                color="purple"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Sales History</h4>
                <div className="h-40 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={salesData}>
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis
                        width={30}
                        tick={{ fontSize: 12 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          borderColor: "hsl(var(--border))",
                        }}
                        formatter={(value) => [`${value} items`, "Sales"]}
                      />
                      <Line
                        type="monotone"
                        dataKey="sales"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6, strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Engagement</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-rose-500" />
                      </Badge>
                      <span className="text-sm">Saved Items</span>
                    </div>
                    <span className="font-medium">{stats.savedItems}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 text-blue-500"
                        >
                          <path
                            d="M7.5 0C3.35786 0 0 3.35786 0 7.5C0 11.6421 3.35786 15 7.5 15C11.6421 15 15 11.6421 15 7.5C15 3.35786 11.6421 0 7.5 0ZM7.5 1C11.0899 1 14 3.91015 14 7.5C14 11.0899 11.0899 14 7.5 14C3.91015 14 1 11.0899 1 7.5C1 3.91015 3.91015 1 7.5 1ZM7.5 3C7.22386 3 7 3.22386 7 3.5V8.5C7 8.77614 7.22386 9 7.5 9H10.5C10.7761 9 11 8.77614 11 8.5C11 8.22386 10.7761 8 10.5 8H8V3.5C8 3.22386 7.77614 3 7.5 3Z"
                            fill="currentColor"
                            fillRule="evenodd"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </Badge>
                      <span className="text-sm">Total Views</span>
                    </div>
                    <span className="font-medium">{stats.views}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="h-8 w-8 p-0 flex items-center justify-center">
                        <MessageSquare className="h-4 w-4 text-primary" />
                      </Badge>
                      <span className="text-sm">Messages</span>
                    </div>
                    <span className="font-medium">{stats.messages}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

function StatItem({ title, value, icon, color }) {
  const colorMap = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    amber: "text-amber-600 dark:text-amber-400",
  }

  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{title}</p>
      <div className="flex items-center gap-1">
        <span className={`${colorMap[color]}`}>{icon}</span>
        <span className="text-xl font-bold">{value}</span>
      </div>
    </div>
  )
}
