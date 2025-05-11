"use client"

import { useTheme } from "next-themes"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

interface ChartData {
  month: string
  count: number
  [key: string]: any
}

interface AdminAnalyticsChartProps {
  data: ChartData[]
  type: "users" | "listings" | "orders"
}

export default function AdminAnalyticsChart({ data, type }: AdminAnalyticsChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Format data based on chart type
  const formattedData = data.map((item) => {
    switch (type) {
      case "listings":
        return {
          month: item.month,
          Marketplace: item.marketplace_count || 0,
          Accommodation: item.accommodation_count || 0,
        }
      case "orders":
        return {
          month: item.month,
          Completed: item.completed_count || 0,
          Pending: item.pending_count || 0,
          Cancelled: item.cancelled_count || 0,
        }
      case "users":
      default:
        return {
          month: item.month,
          Users: item.count,
        }
    }
  })

  // Define colors based on theme
  const colors = {
    Users: isDark ? "#a78bfa" : "#8b5cf6",
    Marketplace: isDark ? "#60a5fa" : "#3b82f6",
    Accommodation: isDark ? "#34d399" : "#10b981",
    Completed: isDark ? "#34d399" : "#10b981",
    Pending: isDark ? "#fbbf24" : "#d97706",
    Cancelled: isDark ? "#f87171" : "#ef4444",
  }

  // Get keys for the chart based on type
  const keys = Object.keys(formattedData[0] || {}).filter((key) => key !== "month")

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formattedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#374151" : "#e5e7eb"} />
          <XAxis
            dataKey="month"
            stroke={isDark ? "#9ca3af" : "#6b7280"}
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis stroke={isDark ? "#9ca3af" : "#6b7280"} fontSize={12} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderColor: isDark ? "#374151" : "#e5e7eb",
              color: isDark ? "#f9fafb" : "#111827",
            }}
          />
          <Legend />
          {keys.map((key) => (
            <Bar key={key} dataKey={key} fill={colors[key as keyof typeof colors]} radius={[4, 4, 0, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
