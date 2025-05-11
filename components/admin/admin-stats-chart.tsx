"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    users: 12,
  },
  {
    name: "Feb",
    users: 18,
  },
  {
    name: "Mar",
    users: 24,
  },
  {
    name: "Apr",
    users: 32,
  },
  {
    name: "May",
    users: 40,
  },
  {
    name: "Jun",
    users: 52,
  },
]

export default function AdminStatsChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
